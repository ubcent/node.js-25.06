const express = require('express');
const consolidate = require('consolidate');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const passport = require('./passport');

const User = require('./models/user');
const Todos = require('./models/todos');

const mongoUrl = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
const app = express();
const PORT = process.env.APP_PORT || 8000;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useFindAndModify: true });

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize);
app.use(passport.session);

app.use('/tasks', passport.checkAuthenticated);

app.post('/update-todo', async (req, res) => {
  const { id, done } = req.body;

  try {
    await Todos.findByIdAndUpdate(id, { done });
    res.status(200).end();
  } catch (err) {
    res.status(400).end();
    console.error(err);
  };
});

app.post('/add-todo', async (req, res) => {
  const { text, done } = req.body;

  const todo = new Todos({
    text,
    done,
  });

  todo.save()
    .then(() => {
      res.status(200).end();
    })
    .catch(err => {
      res.status(400).end();
      console.error(err);
    });
});

app.delete('/delete/:id', async (req, res) => {
  try {
    await Todos.findByIdAndDelete(req.params.id);
    res.status(200).end();
  } catch (err) {
    res.status(400).end();
    console.error(err);
  };
});

app.get('/tasks', async (_, res) => {
  const todos = await Todos.find();
  res.render('index', { todos });
});

app.get('/error', (_, res) => {
  res.render('error');
});

app.get('/register', async (req, res) => {
  if (req.user) {
    return res.redirect('/tasks');
  }

  res.render('register');
});

app.post('/register', async (req, res) => {
  const user = new User(req.body);
  await user.save();

  res.redirect('/tasks');
});

app.get('/auth', (req, res) => {
  if (req.user) {
    return res.redirect('/tasks');
  }
  res.render('auth', { error: !!req.query.error });
});
app.post('/auth', passport.authHandler);

app.get('/logout', (req, res) => {
  req.logout();

  res.redirect('/auth');
});

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
