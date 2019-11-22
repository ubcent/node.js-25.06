const http = require('http');
const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
mongoose.connection = require('./models/connection');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const Message = require('./models/message');

const users = {};

app.get('/', (req, res) => {
  res.sendFile(
    path.resolve(__dirname, 'public', 'index.html')
  );
});

app.get('/messages', async (req, res) => {
  const messages = await Message.find();

  res.json(messages);
});

app.get('/online', (req, res) => {
  res.json(users);
});

io.on('connection', (socket) => {
  console.log('Someone has connected!');

  socket.on('message', async (data) => {
    const msg = new Message(data);
    const savedMsg = await msg.save();
    if(!users[socket.id]) {
      users[socket.id] = data.author;
      socket.broadcast.emit('online', {
        id: socket.id,
        name: data.author,
      });
    }

    if(data.to) {
      socket.in(data.to).emit('message', savedMsg);
    } else {
      // Отправляем сообщение всем подключенным юзерам
      socket.broadcast.emit('message', savedMsg);
    }

    // Отправляем сообщение себе
    socket.emit('message', savedMsg);
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    socket.broadcast.emit('offline', socket.id);
  });
});

server.listen(8888, () => {
  console.log('Server has been started!');
});