const path = require('path');
const express = require('express');
const consolidate = require('consolidate');
const mongoose = require('mongoose');
mongoose.connection = require('./models/connection');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const { Task, User } = require('./models');
const passport = require('./passport');

const app = express();

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));
app.use(express.urlencoded({extended: false}));
app.use(session({
  secret: 'super 12345 secret variable',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
}));
app.use(passport.initialize);
app.use(passport.session);
app.use('/tasks', passport.checkAuthenticated);

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find().lean();
  res.render('tasks', { tasks: tasks.map((task) => ({...task, completed: task.status === 'completed', urgent: task.priority === 'urgent'})) });
});

app.post('/tasks/add', async (req, res) => {
  const task = new Task(req.body);
  const savedTask = await task.save();
  res.redirect('/tasks');
});

app.post('/tasks/delete', async (req, res) => {
  await Task.findByIdAndRemove(req.body.id);
  res.redirect('/tasks');
});

app.post('/tasks/complete', async (req, res) => {
  await Task.findByIdAndUpdate(req.body.id, {$set: {status: 'completed'}});
  res.redirect('/tasks');
});

app.post('/tasks/update', async (req, res) => {
  await Task.findByIdAndUpdate(req.body.id, {$set: {title: req.body.title, priority: req.body.priority}});
  res.redirect('/tasks');
});

app.get('/tasks/:id/edit', async (req, res) => {
  const task = await Task.findById(req.params.id).lean();
  res.render('update', task);
});

app.get('/register', async (req,res) => {
  if (req.user) {
    return res.redirect('/tasks');
  }
  res.render('register');
});

app.post('/register', async (req,res) => {
  const user = new User(req.body);
  const savedUser = await user.save();
  res.redirect('/tasks');
});

app.get('/auth', (req, res) => {
  if (req.user) {
    return res.redirect('/tasks');
  }
  res.render('auth', {error: !!req.query.error});
});

app.post('/auth', passport.authHandler);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/auth');
});

app.listen(8888);
