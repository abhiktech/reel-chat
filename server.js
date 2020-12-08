const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set 'public' folder as static folder

app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ReelChat Bot';

// Run when a client connects

io.on('connection', (socket) => {
    socket.on('joinRoom', ({username, room}) => {

        // Sending a message to the client that just connected

        socket.emit('message', formatMessage(botName, 'Welcome to ReelChat!'));

        // Broadcast when a user connects
        // Sends the message to all connected users except for the one that just conected

        socket.broadcast.emit('message', formatMessage(botName,'A user has joined the chat.'));

});

    // Note : io.emit() broadcasts to ALL connected clients

    // Listen for chatMessage from a conncted user

    socket.on('chatMessage', (msg) => {
        // Sending the message to all users

        io.emit('message', formatMessage('User', msg));
    });

    // Runs when client disconnects

    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName,'A user has left the chat.'));
    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});