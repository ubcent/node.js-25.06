const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const format = require('date-fns/format');
require(path.resolve(__dirname, 'config', 'db_config'));


const app = express();
const Task = require('./models/task');
const User = require('./models/user');
const passport = require('./passport');
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/', express.static(path.resolve(__dirname, '..', 'public')));

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
  tasks.forEach((elem) => {
    const newDate = format(elem.update, 'YYYY-MM-DD HH:mm');
    Object.assign(elem, {update: newDate});
  });
  res.send(tasks);
});

app.delete('/tasks/remove', async (req, res) => {
  const tasks = await Task.deleteOne({_id: req.body.id});
  res.send(tasks);
});

app.post('/tasks/add', async (req, res) => {
  const {title, description} = req.body;
  const tasks = new Task({
    title,
    description,
  });
  tasks.save()
      .then(() => {
        res.status(200).end();
      })
      .catch((err) => {
        res.status(400).end();
        console.error(err);
      });
  res.send(tasks);
});

app.put('/tasks/update', async (req, res) => {
  const {id, title, description, status} = req.body;
  const tasks = await Task.updateOne(
      {_id: id},
      {
        title: title,
        description: description,
        status: status,
        update: new Date(),
      }
  );
  res.send(tasks);
});

app.post('/register', async (req, res) => {
  const user = new User(req.body);
  const savedUser = await user.save();
  if (savedUser) {
    res.send(JSON.stringify({result: 'success'}));
  }
});
app.get('/auth', (req, res) => {
  if (req.user) {
    res.send(JSON.stringify({result: 'success'}));
  } else {
    res.send(JSON.stringify({result: 'failure'}));
  }
});
app.post('/auth', passport.authHandler);

app.get('/logout', (req, res) => {
  req.logout();
  res.send(JSON.stringify({result: 'success'}));
});

app.listen(3000, () => console.log('Listen on port 3000...'));
