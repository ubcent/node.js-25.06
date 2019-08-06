const express = require('express');
const path = require('path');
const consolidate = require('consolidate');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost:27017/todolist', {useNewUrlParser: true});

const User = require('./models/user');
const Task = require('./models/tasks');
const passport = require('./passport');


app.use(session({
    secret: 'my super secret phrase 123',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static( './static/' ));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});
app.use(passport.initialize);
app.use(passport.session);

app.use('/todo', passport.checkAuthenticated);

const userOn = {
    logged: {},

    async addUser(newUser) {
    let user = new User(newUser);
    user = await user.save();
    return user._id;
    },

};

app.post('/login', passport.authHandler);

app.get('/register', async (req, res) => {
        return res.send({url:'/register.html'});
});

app.get('/login', async (req, res) => {
    return res.redirect('/index.html');
});

app.get('/todo', async (req, res) => {
    if(req.user) {
        return res.send({url:'/todolist.html'});
    } else if (!req.user) {
        res.redirect('/index.html');
    }
    res.send('/register.html');
});

app.post('/register', async (request, response) => {
    const req = request.body.params;
    const exists = await User.findOne({login: req.login});
    if (exists) {
        response.send(`Пользователь ${req.login} уже зарегистрован!`);
    } else {
        if(req.login && req.password ) {
            await userOn.addUser(req);
            response.send({url: '/index.html', msg: 'Успешно'});
        } else response.send('Error!');
    }
});

app.post('/todo', async (request, response) => {
    const req = request.body.params;
    if(req.userId) {
        const data = await Task.find({userId: req.userId}).lean();
        response.send(data);
    } else response.send('Некорректные параметры запроса.');
});

app.post('/todo/done', async (request, response) => {
    const req = request.body.params;
    if(req.taskId) {
        const data = await Task.updateOne({_id: req.taskId}, {taskStatus: 'done'});
        response.send(data);
    } else response.send('Некорректные параметры запроса.');
});

app.post('/todo/new', async (request, response) => {
    const req = request.body.params;
     if(req.taskName || req.taskData) {
        let newTask = await Task(req);
        await newTask.save();
        response.send('ok');
    } else response.send('Некорректные параметры запроса.');
});

app.post('/todo/delete', async (request, response) => {
    const req = request.body.params;
    if(req.taskId) {
        const data = await Task.updateOne({_id: req.taskId}, {taskDeleted: true});
        response.send('ok');
    } else response.send('Некорректные параметры запроса.');
});


app.get('/logout', (req, res) => {
    req.logout();
    res.clearCookie('todo');
    res.redirect('/index.html');
});

app.listen(8008);