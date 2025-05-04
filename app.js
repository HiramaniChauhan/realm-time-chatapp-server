require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
    res.send('Server is healthy');
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const io = require('socket.io')(server, {
    transports: ['websocket', 'polling']
});

let socketsConnected = new Set();

io.on('connection', onConnected);

function onConnected(socket) {
    socketsConnected.add(socket.id);
    io.emit('client-total', socketsConnected.size);

    socket.on('disconnect', (reason) => {
        console.log(`Socket disconnected: ${socket.id}, reason: ${reason}`);
        socketsConnected.delete(socket.id);
        io.emit('client-total', socketsConnected.size);
    });

    socket.on('message', (data) => {
        console.log(data);
        socket.broadcast.emit('chat-message', data);
    });

    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data);
    });
}
