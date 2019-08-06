const path = require('path');

const express = require('express');
const consolidate = require('consolidate');
const mongoose = require('mongoose');

const Task = require('./models/task_homework');
mongoose.connect('mongodb://127.0.0.1:27017/todo', {useNewUrlParser: true});
const app = express();

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.urlencoded({extended: false}));

app.get('/tasks', async (req,res) => {
  const tasks = await Task.find().lean();
  res.render('tasks', tasks.map((task) => ({...task, completed: task.status === 'completed'})))
});


app.listen(8888);