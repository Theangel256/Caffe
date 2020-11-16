const mongoose = require('mongoose');
const { MONGODB_HOST, MONGODB_DATABASE } = process.env;

const MONGODB_URI = `mongodb://${MONGODB_HOST ? MONGODB_HOST : "localhost"}/${MONGODB_DATABASE ? MONGODB_DATABASE : "database"}`;

mongoose.connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then((db) => console.log("Mongodb is connected to", db.connection.host)).catch(err => console.log(err.message));