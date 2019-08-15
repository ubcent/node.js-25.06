/*
 * Признаки REST:
 * JSON
 * GET - Read
 * POST - Create
 * PUT - Update (full update)
 * PATCH - Update (partial update)
 * DELETE - Delete
 * Вся информация, необходимая для совершения запроса должна содержаться в нем.
 * Нельзя использовать механизмы сохранения состояния на сервере (куки и сессии)
 * SEF-url (человекопонятные url)
 *
 * OPTIONS (Access-Contol-Allow-Origin:)
*/
const path = require('path');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Task, User } = require('./models');
const mongoose = require('mongoose');
mongoose.connection = require('./models/connection');

const SECRET = 'very super puper secret';

const app = express();
app.use(cors());
app.use(express.json());

app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));
app.use(express.urlencoded({extended: false}));

// Идентификация
const checkToken = async (req, res, next) => {
  if(req.headers.authorization) {
    const [type, token] = req.headers.authorization.split(' ');
    jwt.verify(token, SECRET, (err, payload) => {
      if(err) {
        return res.status(401).json({ message: 'Wrong token' });
      }
      console.log(payload);
      req.user = payload;
      next();
    });
  } else {
    res.status(401).json({ message: 'No token present' });
  }
};

app.use('/tasks', checkToken);

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.get('/tasks/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  res.json(task);
});

app.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  const savedTask = await task.save();
  res.json(savedTask);
});

app.put('/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body);
  res.json(task);
});

app.patch('/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, { $set: req.body });
  res.json(task);
});

app.delete('/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  res.json(task);
});

// Аутентификация
app.post('/auth', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({email: username});
  if(!user) {
    return res.json({ result: 'failure', message: 'Unexpected credentials' });
  }
  const isPasswordValid = await user.comparePassword(password);
  if(!isPasswordValid) {
    return res.json({ result: 'failure', message: 'Unexpected credentials' });
  }
  const identity = {
    id: user._id,
    email: user.email,
  };
  const token = jwt.sign(identity, SECRET);
  res.json({ result: 'success', token });
});

app.post('/register', async (req, res) => {
  const candidate = await User.findOne({ email: req.body.email });
  if(!candidate) {
    const user = new User(req.body);
    const savedUser = await user.save();
    return res.json({ result: 'success' });
  }
  res.json({ result: 'failure' });
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/auth');
});

app.listen(8888);