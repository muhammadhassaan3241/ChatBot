import { Schema, model, mongo } from 'mongoose';
// ======================================================================== IMPORTING MODULES AND PACKAGES


// MONGOOSE MESSAGE MODEL
// ===================================== START
const notifcationSchema = new Schema({     // =========== CREATING SCHEMA FOR MESSAGING ROOM 
    roomId: [{
        type: String,
        required: true,
    }],
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    senderData: [{
        type: Schema.Types.Mixed,
    }],
    receiverData: [{
        type: Schema.Types.Mixed,
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
    accept: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// ===================================== STOP


export const Notification = model('Notification', notifcationSchema);  // ========== EXPORTING MODEL