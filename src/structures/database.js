const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:/database', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(console.log("DB is connected")).catch(err => console.log(err));