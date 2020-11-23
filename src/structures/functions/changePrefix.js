const model = require('../models/prefix');

module.exports = async function changePrefix(guildID, prefix) {
    let data = await model.findOne({ guildID: guildID });
    
    if(data){
      data.updateOne({
        $set: {      
          prefix: prefix
        }
      }, (err) => err ? console.error(err) : null);
    
    } else {
      
      data = new model({
        guildID: guildID,
        prefix: prefix
      });
      
      await data.save();
    }
  }