const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/user');
const Todos = require('./models/todos');

const mongoUrl = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
const app = express();
const PORT = process.env.APP_PORT || 8000;
const JWT_SECRET = 'some secret word';

const checkAuthenticated = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).json({ message: 'Not token present' });
    return;
  }

  const [_, token] = req.headers.authorization.split(' ');

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ message: 'Wrong token' });
    }

    req.user = payload;
    next();
  });
};

mongoose.connect(mongoUrl, { useNewUrlParser: true, useFindAndModify: true });

app.use(express.json());
app.use('/tasks', checkAuthenticated);
app.use(cors());

app.get('/tasks', async (_, res) => {
  const todos = await Todos.find();
  res.json({ todos });
});

app.get('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const todo = await Todos.findById(id);
  res.json({ todo });
});

app.patch('/tasks/:id', async (req, res) => {
  const { done } = req.body;
  const { id } = req.params;

  try {
    await Todos.findByIdAndUpdate(id, { done });
    res.status(200).json({ status: 'OK' });
  } catch (err) {
    res.status(400).json({ message: 'Some error' });
    console.error(err);
  };
});

app.post('/tasks', async (req, res) => {
  const { text, done } = req.body;

  const todo = new Todos({
    text,
    done,
  });

  todo.save()
    .then(() => {
      res.status(200).json({ todo });
    })
    .catch(err => {
      res.status(400).json({ message: 'Some error' });
      console.error(err);
    });
});

app.delete('/delete/:id', async (req, res) => {
  try {
    await Todos.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: 'OK' });
  } catch (err) {
    res.status(400).json({ message: 'Some error' });
    console.error(err);
  };
});

app.post('/register', async (req, res) => {
  const isUserExist = !!await User.findOne({ email: req.body.email });

  if (isUserExist) {
    return res.json({ message: 'Email already exists' });
  }

  const user = new User(req.body);
  await user.save();

  const identity = {
    id: user._id,
    email: user.email,
  };

  const token = jwt.sign(identity, JWT_SECRET);

  res.json({ result: 'success', token });
});

app.post('/auth', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({email: username});

  if (!user) {
    return res.json({ result: 'failure', message: 'Unexpected credentials' });
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return res.json({ result: 'failure', message: 'Unexpected credentials' });
  }

  const identity = {
    id: user._id,
    email: user.email,
  };

  const token = jwt.sign(identity, JWT_SECRET);

  res.json({ result: 'success', token });
});

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
