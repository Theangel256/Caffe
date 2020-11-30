const SystemLvl = require('../models/systemLvl');
const cooldownniveles = new Map();
const set = require('./set')
module.exports = async function (message) {
    if(cooldownniveles.has(message.guild.id + message.author.id)) {
        const time = cooldownniveles.get(message.guild.id + message.author.id);
        if(Date.now() < time) return;
    }
    let niveles = await SystemLvl.findOne({ guildID: message.guild.id, userID: message.author.id});
    if(!niveles) niveles = await set(SystemLvl, { xp: 0, lvl: 1, guildID: message.guild.id}) 
    const randomxp = Math.ceil(Math.random() * 10);
    const lvlup = niveles.lvl * 80;
    cooldownniveles.set(message.guild.id + message.author.id, Date.now() + 5000);
    if((niveles.xp + randomxp) >= lvlup) {
        await SystemLvl.updateOne({ guildID: message.guild.id, userID: message.author.id}, {$set: { xp: 0, lvl: parseInt(niveles.lvl + 1)}}) 
        return message.channel.send(`Felicidades ${message.author.tag}, Subiste al nivel ${parseInt(niveles.lvl + 1)}!`);
    } else {
        await SystemLvl.updateOne({ guildID: message.guild.id, userID: message.author.id}, {$inc: { xp: randomxp}});
        return;
    }
}