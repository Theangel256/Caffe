const model = require('../models/lang');
module.exports = async function changeLang(guildID, lang) {
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
  }