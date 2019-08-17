const http = require('http');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const format = require('date-fns/format');
const socketIO = require('socket.io');
require(path.resolve(__dirname, 'config', 'db_config'));

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const {Task, User} = require('./models');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const SECRET = 'The doors areopen for those how are bold enough to knock';

app.post('/register', async (req, res) => {
  const candidate = await User.findOne({
    email: req.body.email,
  });
  if ( !candidate ) {
    const user = new User(req.body);
    const savedUser = await user.save();
    return res.json({
      result: 'success',
    });
  }
  res.json({
    result: 'failure',
  });
});

app.post('/auth', async (req, res) => {
  const {username, password} = req.body;
  const user = await User.findOne({email: username});
  if ( !user ) {
    return res.json({
      result: 'failure',
      message: 'This user doesn\'t exist ',
    });
  }
  const isPasswordValid = await user.comparePassword(password);
  if ( !isPasswordValid ) {
    return res.json({
      result: 'failure',
      message: 'Incorrect password',
    });
  }
  const identity = {
    id: user._id,
    email: user.email,
  };
  const token = jwt.sign(identity, SECRET);
  res.json({
    result: 'success',
    token,
    firstName: user.firstName,
    lastName: user.lastName,
  });
});

io.on('connection', (socket) => {
  // check authentication
  const ifAuthenticated = (receivedToken) => {
    if ( receivedToken ) {
      const [type, token] = receivedToken.split(' ');
      jwt.verify(token, SECRET, (err, payload) => {
        if ( err ) {
          socket.emit('authentication', {result: 'false'});
        } else {
          console.log(`user ${ payload.email } is now connected!`);
          socket.emit('authentication', 'success');
        }
      });
    } else {
      socket.emit('authentication', {result: 'false'});
    }
  };
  const token = socket.handshake.query.token;
  ifAuthenticated(token);

  // задачник
  socket.on('getAllTasks', async () => {
    const tasks = await Task.find().lean();
    tasks.forEach((elem) => {
      const newDate = format(elem.update, 'YYYY-MM-DD HH:mm');
      Object.assign(elem, {
        update: newDate,
      });
    });
    if ( tasks ) {
      socket.broadcast.emit('getAllTasks', tasks);
      socket.emit('getAllTasks', tasks);
    }
  });

  socket.on('addTask', async (data) => {
    const task = new Task(data);
    const savedTask = await task.save();
    if ( savedTask ) {
      socket.broadcast.emit('anyChangeTaskOnSuccess', {result: 'success'});
      socket.emit('anyChangeTaskOnSuccess', {result: 'success'});
    }
  });

  socket.on('removeTask', async (id) => {
    const task = await Task.findByIdAndDelete(id);
    if ( task ) {
      socket.broadcast.emit('anyChangeTaskOnSuccess', {result: 'success'});
      socket.emit('anyChangeTaskOnSuccess', {result: 'success'});
    }
  });

  socket.on('updateTask', async (data) => {
    const task = await Task.findOneAndUpdate(
        {_id: data.id},
        {status: data.status},
    );
    if ( task ) {
      socket.broadcast.emit('anyChangeTaskOnSuccess', {result: 'success'});
      socket.emit('anyChangeTaskOnSuccess', {result: 'success'});
    }
  });
});

server.listen(3000, () => console.log('Server has been started on localhost'));
