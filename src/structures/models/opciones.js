const { model: Model, Schema } = require('mongoose');

const model = new Model('opciones', new Schema({
  guildID: {
    type: String,
    unique: true
  },
  prefix: {
    type: String,
    default: process.env.prefix
  },
  channelLogs: {
    type: String,
    default: undefined
  },
  channelWelcome: {
    type: String,
    default: undefined
  },
  language: {
    type: String,
    default: "en"
  },  
  channelGoodbye: {
    type: String,
    default: undefined
  }
}));

module.exports = model;