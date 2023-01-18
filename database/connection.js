const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const connectionParameters = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const database = mongoose.connect(process.env.DB, connectionParameters)
    .then(() => {
        console.log('Mongo Connected!');
    }).catch((e) => {
        console.log('Mongo Disconnected', e);
    })

module.exports = database;