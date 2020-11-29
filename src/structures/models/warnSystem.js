const { model: Model, Schema } = require('mongoose');

const model = new Model('warnSystem', new Schema({
    guildID: { type: String, required: true },
    role: { type: Boolean, required: true },
    roletime: { type: Number, default: 0 },
    roleid: { type: String, default: '0' },
    kick: { type: Boolean, required: true },
    kicktime: { type: Number, default: 0 },
    ban: { type: Boolean, required: true },
    bantime: { type: Number, default: 0 }
}));
  
  module.exports = model;