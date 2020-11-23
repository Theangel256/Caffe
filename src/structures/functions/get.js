module.exports = async function get(model, guild) {
    if(guild) {
      
      let data = await model.findOne({ guildID: guild.id });
      
      if(data) return data;
      
      data = new model({ guildID: guild.id });
      
      await data.save();
      
      return data;
      
    } else {
      
      return { guildID: guild.id }
    
    }
  }