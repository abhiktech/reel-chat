const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, removeUser, getUsersByRoom} = require('./utils/users');
const connectDB = require('./config/db');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Load config file

dotenv.config({path: './config/config.env'});

// Set template engine directory

app.set('views', './views');
app.set('view engine', 'ejs');

// Set 'public' folder as static folder

app.use(express.static(path.join(__dirname, 'public')));

// Setting a session
// Allows storage of session info in MongoDB
const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: store
}));

const botName = 'ReelChat Bot';


// See if you can move the Socket.io implementation to another file!!!
// Run when a client connects

io.on('connection', (socket) => {
    socket.on('joinRoom', ({username, room}) => {
        
        const user = userJoin(socket.id, username, room);
        
        // Setting the room

        socket.join(user.room);

        // Sending a message to the client that just connected

        socket.emit('message', formatMessage(botName, `Welcome to room ${room} ${username}!`));

        // Broadcast to the corresponding room when a user connects
        // Sends the message to all connected users except for the one that just conected
        
        socket.broadcast
        .to(user.room)
        .emit('message', formatMessage(botName,`${username} has joined the chat.`));

        // Updating the view of users in room

        const usersInRoom = getUsersByRoom(user.room);
        
        io
        .to(user.room)
        .emit('displayUsers', usersInRoom);
        
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

        // Updating the view of users in room

        const usersInRoom = getUsersByRoom(user.room);

        io
        .to(user.room)
        .emit('displayUsers', usersInRoom);
    });

});

// Establishing a database connection

connectDB();

// Setting routes

// Authntication route
app.use('/auth', require('./routes/auth'));
// Homepage route
app.use('/home', require('./routes/home'));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});