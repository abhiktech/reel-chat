const users = [];

// Join user to chat

userJoin = (id, username, room) => {
    const user = {id, username, room};

    users.push(user);

    return user;
};

// Get current user

getCurrentUser = (id) => {
    for(let i = 0; i < users.length; ++i) {
        if(users[i].id === id) {
            return users[i];
        }
    }
};

// Removes the current user upon disconnection

removeUser = (id) => {
    for(let i = 0; i < users.length; ++i) {
        if(users[i].id === id) {
            const user = users[i];
            users.splice(i, 1);
            return user;
        }
    }
};

module.exports = {
    userJoin,
    getCurrentUser, 
    removeUser
};