const server = require('express');
const path = require('path');
const app = server();
const format = require('date-fns/format');
require(path.resolve(__dirname, '..', 'config', 'mongo_db_config'));

app.use(server.json());
app.use('/', server.static(path.resolve(__dirname, '..', 'public')));

const Task = require('../models/task_mongo');


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

app.listen(3000, () => console.log('Listen on port 3000...'));
