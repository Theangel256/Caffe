module.exports = async function get(model, ctx) {
    if(ctx.guild) {
      
      let data = await model.findOne({ guildID: ctx.guild.id });
      
      if(data) return data;
      
      data = new model({ guildID: ctx.guild.id });
      
      await data.save();
      
      return data;
      
    } else {
      
      return { guildID: ctx.guild.id }
    
    }
  }