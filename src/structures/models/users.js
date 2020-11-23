const { model: Model, Schema } = require('mongoose');

const model = new Model('members', new Schema({
  guildID: {
    type: String,
    unique: true
  },
  userID: {
    type: String,
    lvl: 0,
    xp: 1,
    money: 200,
    daily: undefined,
    marryTag: null,
    marryId: null
  }
}));

module.exports = model;