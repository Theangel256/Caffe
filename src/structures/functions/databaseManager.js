module.exports = {
 getData: async ({ ...find }, model) => {
    const { readdir } = require("fs").promises;
    const db_files = await readdir(require("path").join(__dirname, "../models/"));

    const available_models = db_files.map(elem => elem.endsWith("js") ? elem.slice(0, -3) : elem);

    if (!available_models.includes(model)) return console.error('[GET_DATA] Model no encontrado!')

    let db = require('../models/' + model + '.js');
    let getModel = (await db.findOne(find));

    if (!getModel) {

        await db.create(find);

        return (await db.findOne(find)) || {};
    }
    else return getModel || {};

},
updateData: async ({ ...find }, { ...newValue }, model) => {
    const { readdir } = require("fs").promises;
    const db_files = await readdir(require("path").join(__dirname, "../models/"));
     const available_models = db_files.map(elem => elem.endsWith("js") ? elem.slice(0, -3) : elem);
      
     if (!available_models.includes(model)) return console.error('[UPDATE_DATA] Model no encontrado!')

    let db = require('../models/' + model + '.js');

    let getModel = (await db.findOne(find));

    if (!getModel) {

        await db.create(find)
        //DATO: findOneAndUpdate() te devuelve el dato despues de establecerlo si pones {new :true} en el tercer parametro
        return await db.findOneAndUpdate(find, newValue, { new: true });
    }
    else {
        return await db.findOneAndUpdate(find, newValue, { new: true });
    }
}


/*

updateData({id: message.guild.id}, {canal_de_logs: message.mentions.channels.first().id}, 'modelo de logs')


retorna: {
_id: "No se que poner aca",
id: "645463565813284865",
canal_de_logs: "541473170105040931"
}

getData():

getData({id: message.guild.id}, 'modelo de logs');

 {
_id: "No se que poner aca",
id: "645463565813284865",
canal_de_logs: "541473170105040931"
}

*/
}