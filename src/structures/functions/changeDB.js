const model = require('../models/opciones');
module.exports = {
  changeLang: async (guildID, lang) => {
    let data = await model.findOne({ guildID });
    
    if(data){
      data.updateOne({
        $set: {      
            language: lang
        }
      }, (err) => err ? console.error(err) : null);
    
    } else {
      
      data = new model({
        guildID,
        language: lang
      });
      
      await data.save();
    }
  },
  changeLogs: async (guildID, channelID) => {
    let data = await model.findOne({ guildID });
    
    if(data){
      data.updateOne({
        $set: {      
          channelLogs: channelID
        }
      }, (err) => err ? console.error(err) : null);
    
    } else {
      
      data = new model({
        guildID,
        channelLogs: channelID
      });
      
      await data.save();
    }
  },
  changePrefix: async (guildID, prefix) => {
    let data = await model.findOne({ guildID });
    
    if(data){
      data.updateOne({
        $set: {      
          prefix: prefix
        }
      }, (err) => err ? console.error(err) : null);
    
    } else {
      
      data = new model({
        guildID,
        prefix: prefix
      });
      
      await data.save();
    }
  },
  changeWelcomeChannel: async (guildID, channelID) => {
    let data = await model.findOne({ guildID });
    
    if(data){
      data.updateOne({
        $set: {      
          channelWelcome: channelID
        }
      }, (err) => err ? console.error(err) : null);
    
    } else {
      
      data = new model({
        guildID,
        channelWelcome: channelID
      });
      
      await data.save();
    }
  },
  changeGoodbyeChannel: async (guildID, channelID) => {
    let data = await model.findOne({guildID});
    if(data) {
      data.updateOne({
        $set: {
          channelGoodbye: channelID
        }
      }, (err) => err ? console.error(err) : null);
    } else {
      data = new model({
        guildID,
        channelGoodbye: channelID
      });
      await data.save();
    }
    }
}