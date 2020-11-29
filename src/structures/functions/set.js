module.exports = async function(model, json = Object) {
    let data = await model.findOne({ guildID: json.guildID });
    
    if(data){
      data.updateOne({
        $set: json
      }, (err) => err ? console.error(err) : null);
    
    } else {
      if(!data) await model.create(json); // Si no hay datos los creamos pos
      const newData = await model.findOneAndUpdate({ guildID: json.guildID }, json, { new: true }); // El new sirve para que devuelva los datos o algo así era, no recuerdo bien
      return newData;
    }
}