/*
https://www.youtube.com/watch?v=jD7FnbI76Hg&ab_channel=TraversyMedia
Done till 38:47 out of 58:44
*/

const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, removeUser} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set 'public' folder as static folder

app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ReelChat Bot';

// Run when a client connects

io.on('connection', (socket) => {
    socket.on('joinRoom', ({username, room}) => {
        
        const user = userJoin(socket.id, username, room);
        
        // Setting the room

        socket.join(user.room);

        // Sending a message to the client that just connected

        socket.emit('message', formatMessage(botName, `Welcome to ReelChat ${username}!`));

        // Broadcast to the corresponding room when a user connects
        // Sends the message to all connected users except for the one that just conected

        socket.broadcast
        .to(user.room)
        .emit('message', formatMessage(botName,`${username} has joined the chat.`));
    
    });

    // Note : io.emit() broadcasts to ALL connected clients

    // Listen for chatMessage from a conncted user

    socket.on('chatMessage', (msg) => {
        // Obtaining the user instance

        const user = getCurrentUser(socket.id);

        // Sending the message to all users in the room

        io
        .to(user.room)
        .emit('message', formatMessage(user.username, msg));
    });

    // Runs when client disconnects

    socket.on('disconnect', () => {
        
        const user = removeUser(socket.id);

        io
        .to(user.room)
        .emit('message', formatMessage(botName,`${user.username} has left the chat.`));
    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});