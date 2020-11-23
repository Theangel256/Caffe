const database = require('./DatabaseManager');
const level_db = new database('niveles');
const cooldownniveles = new Map();
module.exports = async function niveles(message) {
    if(cooldownniveles.has(message.guild.id + message.author.id)) {
        const time = cooldownniveles.get(message.guild.id + message.author.id);
        if(Date.now() < time) return;
    }
    let niveles = await level_db.get(`${message.guild.id}.${message.author.id}`);
    if(!niveles) {
        level_db.set(`${message.guild.id}.${message.author.id}`, { xp: 0, lvl: 1 });
        niveles = await level_db.get(`${message.guild.id}.${message.author.id}`);
    }
    const randomxp = Math.ceil(Math.random() * 10);
    const lvlup = niveles.lvl * 80;
    if(message.author.bot) return;
    cooldownniveles.set(message.guild.id + message.author.id, Date.now() + 5000);
    if((niveles.xp + randomxp) >= lvlup) {
        level_db.set(`${message.guild.id}.${message.author.id}`, { xp: 0, lvl: parseInt(niveles.lvl + 1) });
        return message.channel.send(`Felicidades ${message.author.tag}, Subiste al nivel ${parseInt(niveles.lvl + 1)}!`);
    } else {
        level_db.add(`${message.guild.id}.${message.author.id}.xp`, randomxp);
        return;
    }
}