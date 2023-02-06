import { Schema, model, mongo } from 'mongoose';
// ======================================================================== IMPORTING MODULES AND PACKAGES


// MONGOOSE MESSAGE MODEL
// ===================================== START
const messageSchema = new Schema({     // =========== CREATING SCHEMA FOR MESSAGING ROOM 
    room: [{
        roomId: {
            type: String,
            required: true,
            unique: true,
        },
        users: [{
            type: Schema.Types.Mixed,
            ref: "User"
        }],
    }],
    sender: {
        type: Schema.Types.Mixed,
        ref: "User"
    },
    receiver: {
        type: Schema.Types.Mixed,
        ref: "User"
    },
    message: [{
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        content: {
            type: Schema.Types.Mixed,
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
        createdAt: {
            type: String,
            default: Date.now()
        }
    }],

}, {
    timestamps: true,
});
// ===================================== STOP


export const Message = model('Message', messageSchema);  // ========== EXPORTING MODEL