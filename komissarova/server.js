const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', express.static(path.resolve(__dirname, 'public_8')));

const User = require('./models/user');
const Task = require('./models/task');

const SECRET = 'warum denn ja eigentlich nicht';

app.post('/register', async (req, res) => {
  const user = await User.register(req.body);
  if (user) {
    res.json({result: 'success'});
  }
});

app.post('/auth', async (req, res) => {
  const {username, password} = req.body;
  if (username && password) {
    const user = await User.auth(username);
    if (user.length > 0) {
      if (bcrypt.compareSync(password, user[0].user_password)) { 
        const identity = { 
          id: user[0].user_id,
          email: user[0].user_email,
        };
        const token = jwt.sign(identity, SECRET); 
        res.json({result: 'success', token}); 
      } else {
        res.json({result: 'Incorrect Username and/or Password!'});
      }
    } else {
      res.json({result: 'Incorrect Username'});
    }
  } else {
    res.json({result: 'Please enter Username and Password!'});
  }
});

io.on('connection', (socket) => {
  const ifAuthenticated = (receivedToken) => {
    if (receivedToken) {
      const [type, token] = receivedToken.split(' ');
      jwt.verify(token, SECRET, (err, payload) => {
        if (err) {
          socket.emit('authentication', {result: 'false'});
        } else {
          console.log(`user ${payload.email} is now connected!`);
          socket.emit('authentication', 'success');
        }
      });
    } else {
      socket.emit('authentication', {result: 'false'});
    }
  };
  const token = socket.handshake.query.token; 
  ifAuthenticated(token); 
  
  socket.on('getAll', async () => {
    const tasks = await Task.getAll();
    socket.emit('getAll', tasks);
  });
  
  socket.on('addTask', async (newTask) => {
    const task = await Task.add(newTask);
    if (task) {
      socket.broadcast.emit('taskActionOnSuccess', {result: 'success'});
      socket.emit('taskActionOnSuccess', {result: 'success'});
    }
  });
  
  socket.on('removeTask', async (id) => {
    const task = await Task.remove(id);
    if (task) {
      socket.broadcast.emit('taskActionOnSuccess', {result: 'success'});
      socket.emit('taskActionOnSuccess', {result: 'success'});
    }
  });
  
  socket.on('updateTask', async (data) => {
    const task = await Task.update(data);
    if (task) {
      socket.broadcast.emit('taskActionOnSuccess', {result: 'success'});
      socket.emit('taskActionOnSuccess', {result: 'success'});
    }
  });
});

server.listen(8888, () => {
  console.log('Server has been started');
});
