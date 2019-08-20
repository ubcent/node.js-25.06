function connect(socket) {
    socket.on('message', async (data) => {
        socket.broadcast.emit('message', data);
        socket.emit('message', data);
    });
}

module.exports = connect;