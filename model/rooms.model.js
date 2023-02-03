import { Schema, model, mongo } from 'mongoose';
// ======================================================================== IMPORTING MODULES AND PACKAGES


// MONGOOSE MESSAGE MODEL
// ===================================== START
const roomSchema = new Schema({     // =========== CREATING SCHEMA FOR MESSAGING ROOM 
    room: {
        type: String,
        unique: true
    },
    user: {
        type: Schema.Types.Mixed,
        ref: "User"
    }
}, {
    timestamps: true,
});
// ===================================== STOP


export const Rooms = model('Rooms', roomSchema);  // ========== EXPORTING MODEL