const { model: Model, Schema } = require('mongoose');

const model = new Model('systemmute', Schema({
    guildID: { type: String },
    userID: { type: String },
    rolID: { type: String },
    time: { type: Number }
}));

module.exports = model;