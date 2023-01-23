import { Schema, model, mongo } from 'mongoose';
// ======================================================================== IMPORTING MODULES AND PACKAGES


// MONGOOSE MESSAGE MODEL
// ===================================== START
const messageSchema = new Schema({     // =========== CREATING SCHEMA FOR MESSAGING ROOM 
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
        required: true,
    }],
    socket: {
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
}, {
    timestamps: true,
});
// ===================================== STOP


export const Message = model('Message', messageSchema);  // ========== EXPORTING MODEL