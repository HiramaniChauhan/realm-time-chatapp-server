// require('dotenv').config();

// const express = require('express');
// const path = require('path');
// const cors = require('cors');
// const app = express();
// const PORT = process.env.PORT || 4000;

// app.use(cors());
// app.use(express.static(path.join(__dirname, '..', 'cnprojectclient', 'public')));

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'cnprojectclient', 'public', 'index.html'));
// });


// // app.get('/health', (req, res) => {
// //     res.send('Server is healthy');
// // });

// const server = app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

// const io = require('socket.io')(server, {
//     transports: ['websocket', 'polling']
// });

// let socketsConnected = new Set();

// io.on('connection', onConnected);

// function onConnected(socket) {
//     socketsConnected.add(socket.id);
//     io.emit('client-total', socketsConnected.size);

//     socket.on('disconnect', (reason) => {
//         console.log(`Socket disconnected: ${socket.id}, reason: ${reason}`);
//         socketsConnected.delete(socket.id);
//         io.emit('client-total', socketsConnected.size);
//     });

//     socket.on('message', (data) => {
//         console.log(data);
//         socket.broadcast.emit('chat-message', data);
//     });

//     socket.on('feedback', (data) => {
//         socket.broadcast.emit('feedback', data);
//     });
// }



require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

// Use CORS middleware
app.use(cors());

// Serve static files from the 'public' folder inside the 'cnprojectclient' folder
app.use(express.static(path.join(__dirname, '..', 'cnprojectclient', 'public')));

// Serve the index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'cnprojectclient', 'public', 'index.html'));
});

// Uncomment to enable health check endpoint
// app.get('/health', (req, res) => {
//     res.send('Server is healthy');
// });

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Setup Socket.IO for real-time communication
const io = require('socket.io')(server, {
    transports: ['websocket', 'polling'] // Ensure stable connections
});

let socketsConnected = new Set();

// Handle new client connection
io.on('connection', onConnected);

function onConnected(socket) {
    // Add the socket ID to the connected set
    socketsConnected.add(socket.id);

    // Emit the total number of clients connected
    io.emit('client-total', socketsConnected.size);

    // Handle socket disconnection
    socket.on('disconnect', (reason) => {
        console.log(`Socket disconnected: ${socket.id}, reason: ${reason}`);
        socketsConnected.delete(socket.id);

        // Emit the updated client count
        io.emit('client-total', socketsConnected.size);
    });

    // Handle incoming 'message' event from the client
    socket.on('message', (data) => {
        console.log(data);
        socket.broadcast.emit('chat-message', data);  // Broadcast to all except the sender
    });

    // Handle incoming 'feedback' event from the client
    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data);  // Broadcast feedback to others
    });
}
