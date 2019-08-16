const SECRET = 'The doors are open for those how are bold enough to knock';
const socketIO = require('socket.io');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const format = require('date-fns/format');
const http = require('http');
require(path.resolve(__dirname, 'config', 'db_config'));

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const {Task, User} = require('./models');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/', express.static(path.resolve(__dirname, 'public')));

// Идентификация
const checkToken = async (req, res, next) => {
  if (req.headers.authorization) {
    const [type, token] = req.headers.authorization.split(' ');
    jwt.verify(token, SECRET, (err, payload) => {
      if (err) {
        return res.status(401).json({result: 'Wrong token'});
      }
      req.user = payload;
      next();
    });
  } else {
    res.status(401).json({result: 'No token present'});
  }
};

app.post('/register', async (req, res) => {
  const candidate = await User.findOne({email: req.body.email});
  if (!candidate) {
    const user = new User(req.body);
    const savedUser = await user.save();
    return res.json({result: 'success'});
  }
  res.json({result: 'failure'});
});

app.post('/auth', async (req, res) => {
  const {username, password} = req.body;
  const user = await User.findOne({email: username});
  if (!user) {
    return res.json({result: 'failure', message: 'This user doesn\'t exist '});
  }
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.json({result: 'failure', message: 'Incorrect password'});
  }
  const identity = {
    id: user._id,
    email: user.email,
  };
  const token = jwt.sign(identity, SECRET);
  res.json({result: 'success', token});
});

// задачник
// app.use('/tasks', checkToken);

io.on('connection', (socket) => {
  // console.log('Someone has connected!');

  socket.on('addTask', async (data) => {
    const task = new Task(data);
    const savedTask = await task.save();
    console.log(savedTask);
    // Отправляем сообщение всем подключенным юзерам
    socket.broadcast.emit('addTask', {result: "success"});
    // Отправляем сообщение себе
    socket.emit('addTask', {result: "success"});
  });

  socket.on('online', () => {
    socket.emit('online', socket.id);
  });

  socket.on('disconnect', () => {
    /* delete users[socket.id];
    socket.broadcast.emit('offline', socket.id);*/
  });
});

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find().lean();
  tasks.forEach((elem) => {
    const newDate = format(elem.update, 'YYYY-MM-DD HH:mm');
    Object.assign(elem, {update: newDate});
  });
  res.json(tasks);
});

app.delete('/tasks', async (req, res) => {
  const task = await Task.deleteOne({_id: req.body.id});
  res.json(task);
});

app.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  const savedTask = await task.save();
  res.json(savedTask);
});

app.put('/tasks', async (req, res) => {
  const {id, title, description, status} = req.body;
  const task = await Task.updateOne(
      {_id: id},
      {
        title: title,
        description: description,
        status: status,
        update: new Date(),
      }
  );
  res.json(task);
});

server.listen(3000, () => console.log('Listen on port 3000...'));
