const path = require('path');

const express = require('express');
const consolidate = require('consolidate');
const mongoose = require('mongoose');

const Task = require('./models/task');

mongoose.connect('mongodb://192.168.99.100:32786/todo', { useNewUrlParser: true, useFindAndModify: true });

const app = express();
app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find().lean();

  res.render('tasks', { tasks: tasks.map((task) => ({...task, completed: task.status === 'completed'})) });
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
  await Task.findByIdAndUpdate(req.body.id, { $set: { status: 'completed' } });
  res.redirect('/tasks');
});

app.post('/tasks/update', async (req, res) => {
  await Task.findByIdAndUpdate(req.body.id, { $set: { title: req.body.title } });
  res.redirect('/tasks');
});

app.get('/tasks/:id/edit', async (req, res) => {
  const task = await Task.findById(req.params.id).lean();

  res.render('task', task);
});

app.listen(8888);