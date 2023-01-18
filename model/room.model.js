const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    users: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    messages: [{
        socket: {
            type: String,
            required: true,
            unique: true,
        },
        content: {
            type: String,
            required: true,
        },
        sent: {
            type: Boolean,
            default: false,
        },
        received: {
            type: Boolean,
            default: false,
        },
        seen: {
            type: Boolean,
            default: false,
        },
    }]
}, {
    timestamps: true,
});


module.exports = {
    Room: mongoose.model('Room', roomSchema)
}