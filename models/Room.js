const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    room: {
        type: String,
        required: true
    },
    users: [{
        id: String,
        username: String
    }]
});

module.exports = mongoose.model('Room', RoomSchema);