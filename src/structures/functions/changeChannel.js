module.exports = async function changeChannel(model, ctx, channelID) {
    let data = await model.findOne({ guildID: ctx.guild.id });
    
    if(data){
      data.updateOne({
        $set: {      
          channel: channelID
        }
      }, (err) => err ? console.error(err) : null);
    
    } else {
      
      data = new model({
        guildID: ctx.guild.id,
        channel: channelID
      });
      
      await data.save();
    }
  }