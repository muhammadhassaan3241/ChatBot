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
        socket: {
            type: String,
            required: true,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        receiver: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        message: [{
            type: Schema.Types.Mixed,
            required: true,
        }],
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
// ===================================== STOP


export const Message = model('Message', messageSchema);  // ========== EXPORTING MODEL