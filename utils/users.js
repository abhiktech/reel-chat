const User = require('../models/User');

// Join user to chat

userJoin = (id, username, room) => {
    
    return new Promise(async (resolve, reject) => {

        const user = await User.findOne({username: username});

        user.room = room;

        user.socketid = id;

        await user.save();

        resolve();
    });
};

// Removes the current user upon disconnection

removeUser = (id) => {

    return new Promise(async (resolve, reject) => {

        const user = await User.findOne({socketid: id});

        user.room = null;

        user.socketid = null;

        await user.save();

        resolve();
    });
};

getUser = (id) => {

    return new Promise(async(resolve, reject) => {

        const user = await User.findOne({socketid: id});

        resolve(user);
    }); 

};

getUsersByRoom = (room) => {

    return new Promise(async (resolve, reject) => {
        
        let usersInRoom = await User.find({room: room});

        let usernames = [];

        for(let i = 0; i < usersInRoom.length; ++i) {
            usernames.push(usersInRoom[i].username);
        }

        resolve(usernames);
    });
};

module.exports = {
    userJoin,
    removeUser,
    getUsersByRoom
};