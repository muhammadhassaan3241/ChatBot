import mongoose from 'mongoose';
mongoose.set('strictQuery', false);
import dotenv from 'dotenv';
dotenv.config()
// ======================================================================== IMPORTING MODULES AND PACKAGES


// CONNECTION PARAMETERS
const connectionParameters = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

// DB CONNECTION
// ========================================================== START
const database = mongoose.connect(process.env.DB, connectionParameters)
    .then(() => {
        console.log('Mongo Connected!');
    }).catch((e) => {
        console.log('Mongo Disconnected', e);
    })
// ========================================================== STOP

export default database; // ============= EXPORTING MODULE