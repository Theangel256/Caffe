module.exports = async function(model, json = Object) {
    let data = await model.findOne({ guildID: json.guildID });
    
    if(data){
      data.updateOne({
        $set: json
      }, (err) => err ? console.error(err) : null);
    
    } else {
      
      data = new model(json);
      await data.save();
    }
}