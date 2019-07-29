const express = require('express');
const path = require('path');
const consolidate = require('consolidate');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb://localhost:27017/todolist', {useNewUrlParser: true});

const User = require('./models/user');
const Task = require('./models/tasks');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static( './static/' ));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

const userOn = {
    logged: {},

    async addUser(newUser) {
    let user = new User(newUser);
    user = await user.save();
    return user._id;
    },

};

app.get('/users/all', async (req, res) => {
    const users = await User.find();
    res.send(users);
});

app.get('/users/:id', async (req, res) => {
    const users = await User.find();
    if (users[req.params.id]) {
        res.send(`Имя: ${users[req.params.id].firstName}<br>
    Фамилия: ${users[req.params.id].lastName}<br>
    ID: ${users[req.params.id]._id}
    `);
    } else res.send('Пользователь не найден.');
});

app.post('/login', async (request, response) => {
    const req = request.body.params;
    if(req.login !== '') {
        const user = await User.findOne({login: req.login}).limit(1);
        if(user) {
            if (await user.password === req.password) {
                response.cookie('todo',user._id);
                response.send({url:"/todolist.html"});
                const tasks = await Task.find({userId: user._id});
                userOn.logged[user._id] = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    todolist: tasks,
                };
            } else response.send('Неправильный логин или пароль.');
        } else response.send('Неправильный логин или пароль.');
    } else response.send('Некорректные параметры запроса.');
});

app.post('/register', async (request, response) => {
    const req = request.body.params;
    if(req.login && req.password ) {
        await userOn.addUser(req);
        response.send(`ok`);
    } else response.send('Некорректные параметры запроса.');
});

app.post('/todo', async (request, response) => {
    const req = request.body.params;
    if(req.userId) {
        const data = await Task.find({userId: req.userId});
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

app.listen(8008);