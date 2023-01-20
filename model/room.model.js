import { Schema, model } from 'mongoose';
// ======================================================================== IMPORTING MODULES AND PACKAGES


// MONGOOSE MESSAGE MODEL
// ===================================== START
const roomSchema = new Schema({     // =========== CREATING SCHEMA FOR MESSAGING ROOM 
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    friend: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    messages: [{
        type: String,
        required: true,
    }],
    socket: {
        type: String,
        required: true,
        unique: true,
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
}, {
    timestamps: true,
});
// ===================================== STOP


export const Room = model('Room', roomSchema);  // ========== EXPORTING MODEL