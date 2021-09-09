// Welcome to Reel Chat

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
const {userJoin, removeAndGetUser, getUsersByRoom} = require('./utils/users');
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
    socket.on('joinRoom', async ({username, room}) => {
        
        // Adding socketid and room to the user collection.
        
        await userJoin(socket.id, username, room);
        
        // Setting the room

        socket.join(room);

        // Sending a message to the client that just connected

        socket.emit('message', formatMessage(botName, `Welcome to room ${room} ${username}!`));

        // Broadcast to the corresponding room when a user connects
        // Sends the message to all connected users except for the one that just conected
        
        socket.broadcast
        .to(room)
        .emit('message', formatMessage(botName,`${username} has joined the chat.`));

        // Adding a new user to the view of users in room

        socket.broadcast
        .to(room)
        .emit('addUser', username);

        const usersInRoom = await getUsersByRoom(room);

        // For the new users, displaying all the active users

        socket.emit('displayUsers', usersInRoom);
        
    });

    // Note : io.emit() broadcasts to ALL connected clients

    // Listen for chatMessage from a conncted user

    socket.on('chatMessage', (msg, username, room) => {

        // Sending the message to all users in the room

        io
        .to(room)
        .emit('message', formatMessage(username, msg));

    });

    // Runs when client disconnects

    socket.on('disconnect', async () => {
        
        // Removing the user from 
        const user = await removeAndGetUser(socket.id);

        io
        .to(user.room)
        .emit('message', formatMessage(botName,`${user.username} has left the chat.`));

        const usersInRoom = await getUsersByRoom(user.room);

        // Updating the view of users in room

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