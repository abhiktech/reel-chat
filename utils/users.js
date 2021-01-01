const User = require('../models/User');
const Room = require('../models/Room');

// Join user to chat

userJoin = (id, username, room) => {
    
    return new Promise(async (resolve, reject) => {
        
        // Looking for the room document in the Rooms collection

        const r = await Room.findOne({room: room});

        // If the room does not exist
        if(!r) {

            // Creating a new room document

            let arr = new Array();
            arr.push({id, username});

            let new_room = new Room({
                room: room,
                users: arr
            });

            await new_room.save();
        } else {

            //  Updating the existing room document
            
            r.users.push({id, username});
            await r.save();
        }

        resolve();
       
    });
};

// Remove user from Rooms collection and resolve with the user information

removeAndGetUser = (id) => {

    return new Promise(async (resolve, reject) => {

        const all_users = await Room.find({});

        let found = false, i = -1, j = 0;

        // Looking for an element with the corresponding socket id

        while(!found && i < all_users.length) {

            ++i;

            for(j = 0; j < all_users[i].users.length; ++j) {
                
                if(all_users[i].users[j].id == id) {
                    found = true;
                    break;
                }
            }

        }

        let ret = {"username": all_users[i].users[j].username, "room": all_users[i].room};
        
        let new_arr = all_users[i].users;
        new_arr.splice(j, 1);

        // Updating the room by 
        await Room.findOneAndUpdate({room: ret.room}, {users: new_arr});
        
        resolve(ret);

    });

};

// Retrieving all users from a room 

getUsersByRoom = (room) => {

    return new Promise(async (resolve, reject) => {
        
        let r = await Room.findOne({room: room});

        let usernames = [];

        for(let i = 0; i < r.users.length; ++i) {
            usernames.push(r.users[i].username);
        }

        resolve(usernames);

    });
};

module.exports = {
    userJoin,
    removeAndGetUser,
    getUsersByRoom
};