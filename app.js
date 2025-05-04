
const express = require('express');
const path = require('path');
const cors = require('cors');  // To handle CORS if frontend is on a different domain
const app = express();
const PORT = process.env.PORT || 4000; // Railway assigns the port automatically

// Use CORS middleware to handle cross-origin requests (if needed)
app.use(cors());

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Setup Socket.IO with custom transport options
const io = require('socket.io')(server, {
    transports: ['websocket', 'polling']  // Ensure stable connections
});

let socketsConnected = new Set();

io.on('connection', onConnected);

function onConnected(socket) {
    // Add the socket ID to the connected set
    socketsConnected.add(socket.id);

    // Emit the total number of clients connected
    io.emit('client-total', socketsConnected.size);

    // Handle socket disconnection
    socket.on('disconnect', () => {
        console.log('Socket disconnected', socket.id);
        socketsConnected.delete(socket.id);

        // Emit the updated client count
        io.emit('client-total', socketsConnected.size);
    });

    // Handle 'message' event from the client
    socket.on('message', (data) => {
        console.log(data);
        socket.broadcast.emit('chat-message', data);  // Broadcast to all except the sender
    });

    // Handle 'feedback' event from the client
    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data);  // Broadcast feedback to others
    });
}
