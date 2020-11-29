const { model: Model, Schema } = require('mongoose');

const model = new Model('warnMembers', new Schema({
    guildID: { type: String, required: true },
    userID: { type: String, required: true },
    warnings: 0,
}));
  
  module.exports = model;