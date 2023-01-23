import { Schema, model, mongo } from 'mongoose';
// ======================================================================== IMPORTING MODULES AND PACKAGES


// MONGOOSE MESSAGE MODEL
// ===================================== START
const notifcationSchema = new Schema({     // =========== CREATING SCHEMA FOR MESSAGING ROOM 
    roomId: [{
        type: String,
        required: true,
    }],
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
        ref: "Message"
    }],
    notifications: [{
        type: Schema.Types.Mixed,
    }],
    friendRequest: [{
        type: Schema.Types.Mixed,
    }],
    socket: {
        type: String,
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


export const Notification = model('Room', notifcationSchema);  // ========== EXPORTING MODEL