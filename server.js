const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const Auth = require('./middleware/auth')
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
        
        // TODO : Change this so that instead of re-rendering, you just append
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

        // TODO : Change this so that instead of re-rendering, you just append

        io
        .to(user.room)
        .emit('displayUsers', usersInRoom);
    });

});

// Establishing a database connection

connectDB();

// Set 'public' folder as static folder

app.use(express.static(path.join(__dirname, 'public')));

// Setting routes

// Index route
app.get('/', Auth.ensureGuest, (req, res) => {
    res.render('index');
});

// Authntication route
app.use('/auth', require('./routes/auth'));

// Homepage route
app.use('/home', require('./routes/home'));

// Chat page route
app.use('/chat', Auth.ensureAuth, require('./routes/chat'));

// If none of the routes are hit
app.use('/', Auth.ensureGuest, Auth.ensureAuth);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});