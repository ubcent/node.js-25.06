const path = require('path');

const express = require('express');
const consolidate = require('consolidate');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const Task = require('./models/task');
const User = require('./models/user');
const passport = require('./passport');

mongoose.connect('mongodb://192.168.99.100:32783/ToDo', { useNewUrlParser: true, useFindAndModify: true });

const app = express();
app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(passport.initialize);
app.use(passport.session);

app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'super 12345 secret variable',
    resave: true,
    saveUninitialized: false,
    store : new MongoStore({
        mongooseConnection : mongoose.connection
    }),
}));

app.use('/tasks',passport.checkAuthenticated);

app.get('/tasks', async (req, res) => {
    let views = req.session.views || 0;
    /*req.session.views = ++views;
    const tasks = await Task.find().lean();
    console.log(req.session.views);*/
    res.render('tasks', { tasks: tasks.map((task) => ({...task, completed: task.status === 'completed'})) });
});

app.post('/tasks/add', async (req, res) => {
    const task = new Task(req.body);
    await task.save();
    res.redirect('/tasks');
});

app.post('/tasks/delete', async (req, res) => {
    await Task.findByIdAndRemove(req.body.id);
    res.redirect('/tasks');
});

app.post('/tasks/complete', async (req, res) => {
    await Task.findByIdAndUpdate(req.body.id, { $set: { status: 'completed' } });
    res.redirect('/tasks');
});

app.post('/tasks/update', async (req, res) => {
    await Task.findByIdAndUpdate(req.body.id, { $set: { title: req.body.title, description : req.body.description } });
    res.redirect('/tasks');
});

app.get('/tasks/:id/edit', async (req, res) => {
    const task = await Task.findById(req.params.id).lean();

    res.render('task', task);
});

app.get('/register', async (req, res) =>{
    if(req.user){
        return res.redirect('/tasks')
    }
   res.render('register');
});

app.post('/register', async (req, res) =>{
    const  user = new User(req.body);
    const savedUser = await user.save();

    res.redirect('/tasks');
});

app.get('/auth', (req, res) =>{
    if(req.user){
        return res.redirect('/tasks')
    }
    res.render('auth', {error : req.query.error})
});

app.post('/auth', passport.authHandler);

app.get('/logout',(req, res) =>{
    req.logout();
    res.redirect('auth');
});

app.listen(8888);
