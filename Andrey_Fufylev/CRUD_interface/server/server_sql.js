const server_sql = require('express');
const path = require('path');
const app = server_sql();
const Task = require(path.resolve(__dirname, '..', 'models', 'task_sql'));

app.use(server_sql.json());

app.use('/', server_sql.static(path.resolve(__dirname, '..', 'public')));

app.get('/tasks', async (req, res) => {
  const tasks = await Task.getAll();
  res.send(tasks);
});

app.delete('/tasks/remove', async (req, res) => {
  const tasks = await Task.delete(req.body.id);
  res.send(tasks);
});

app.post('/tasks/add', async (req, res) => {
  const {title, description} = req.body;
  const tasks = await Task.add(title, description, status = 'Not started');
  res.send(tasks);
});

app.put('/tasks/update', async (req, res) => {
  const tasks = await Task.update(req.body);
  res.send(tasks);
});

app.listen(3000, () => console.log('Listen on port 3000...'));
