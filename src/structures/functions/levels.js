const { getData, updateData } = require('./databaseManager');
const cooldownniveles = new Map();
module.exports = async function (message) {
    if(cooldownniveles.has(message.guild.id + message.author.id)) {
        const time = cooldownniveles.get(message.guild.id + message.author.id);
        if(Date.now() < time) return;
    }
    let niveles = await getData({guildID: message.guild.id, userID: message.author.id}, 'SystemLvl');
    if(!niveles) await updateData({guildID: message.guild.id, userID: message.author.id}, {xp: 0, lvl: 1}, 'SystemLvl');
    const randomxp = Math.ceil(Math.random() * 10);
    const lvlup = niveles.lvl * 80;
    cooldownniveles.set(message.guild.id + message.author.id, Date.now() + 5000);
    if((niveles.xp + randomxp) >= lvlup) {
        await updateData({guildID: message.guild.id, userID: message.author.id}, { xp: 0, lvl: parseInt(niveles.lvl+ 1)}, 'SystemLvl');
        return message.channel.send(`Felicidades ${message.author.tag}, Subiste al nivel ${parseInt(niveles.lvl + 1)}!`);
    } else {
        await updateData({guildID: message.guild.id, userID: message.author.id}, {$inc: { xp: randomxp}}, 'SystemLvl');
        return;
    }
}