const db = require('quick.db');
const cooldownniveles = new Map();
module.exports = {
  auth: (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    } else return res.redirect('/signin');
},
  getRank: async (users, message)  => {
    const userlist = [];
    for(const key in users) {
        const usuario = message.guild.members.cache.has(key) ? message.guild.members.cache.get(key).user.tag : message.client.users.fetch(key).tag;
        userlist.push([usuario, users[key].lvl, users[key].xp]);
    }
    userlist.sort((user1, user2) => {
        return user2[1] - user1[1] || user2[2] - user1[2];
    });
    return userlist;
},
  getMember: (message, args = String, autor = true) => {
    let search = args.join(' ');
    let result;
    if (!search) {
        result = autor === true ? message.member : null;
    } else {
        search = search.toLowerCase();
        result = message.mentions.members.first() || 
        message.guild.members.resolve(search) ||
        message.guild.members.cache.find(e => e.user.username.toLowerCase().includes(search) ||
        e.user.tag.toLowerCase().includes(search) ||
        e.displayName.toLowerCase().includes(search)) || 
        message.member 
  }
  return result;
},
  missingPerms: (client, member, perms = Array) => {
    const missingPerms = member.permissions.missing(perms)
        .map(str => `\`${str.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)/g, char => char.toUpperCase())}\``);

    return missingPerms.length > 1
        ? client.lang.missingPerms.replace(/{missingPerms0}/gi, missingPerms.slice(0, -1).join(', ')).replace(/{missingPerms1}/gi, missingPerms.slice(-1)[0])
        : missingPerms[0];

},
  generateKey: (length = 20, wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$') => { 
    const crypto = require('crypto')
    return Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => wishlist[x % wishlist.length])
    .join(''); 
},
regExp: (client, message) => {
  const warns = new db.table('warns');
  const guilds = new db.table('guilds')
  if(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discord\.com\/invite)\/.+[a-z]/gim.test(message.content)) {
      const embed = new client.Discord.MessageEmbed()
      .setAuthor(client.lang.events.message.ant.warned.replace(/{author.tag}/gi, message.author.tag), message.author.displayAvatarURL({ dynamic:true }))
      .setDescription(`${client.lang.events.message.ant.reason} ${client.lang.events.message.ant.warn}`);
      if(message.deletable) message.delete().catch(e => console.error(e.message));
      warns.add(`${message.guild.id}.${message.author.id}`, { warns: 1 });
      message.channel.send(embed);
        const count = warns.get(`${message.guild.id}.${message.author.id}`);
        const channelLog = guilds.get(`${message.guild.id}.channels.logs`);
        const embed2 = new client.Discord.MessageEmbed()
            .setColor('RED')
            .setDescription('**Warn**')
            .addField('「:boy:」' + client.lang.events.message.ant.author, message.author.tag)
            .addField('「:speech_balloon:」' + client.lang.events.message.ant.reason, client.lang.events.message.ant.warn)
            .addField('「:closed_book:」' + client.lang.events.message.ant.warns, count.warnings)
            .addField('「:fleur_de_lis:️」' + client.lang.events.message.ant.moderator, 'Bot');
        const canal = client.channels.cache.get(channelLog);
        if(canal) return canal.send(embed2);
    }
},

niveles: async (message) => {
  const levels = new db.table('levels');
    if(cooldownniveles.has(message.guild.id + message.author.id)) {
        const time = cooldownniveles.get(message.guild.id + message.author.id);
        if(Date.now() < time) return;
    }
    let niveles = levels.get(`${message.guild.id}.${message.author.id}`);
    if(!niveles) {
      levels.set(`${message.guild.id}.${message.author.id}`, { xp: 0, lvl: 1 });
        niveles = levels.get(`${message.guild.id}.${message.author.id}`);
    }
    const randomxp = Math.ceil(Math.random() * 10);
    const lvlup = niveles.lvl * 80;
    if(message.author.bot) return;
    cooldownniveles.set(message.guild.id + message.author.id, Date.now() + 5000);
    if((niveles.xp + randomxp) >= lvlup) {
      levels.set(`${message.guild.id}.${message.author.id}`, { xp: 0, lvl: parseInt(niveles.lvl + 1) });
      return message.channel.send(`Felicidades ${message.author.tag}, Subiste al nivel ${parseInt(niveles.lvl + 1)}!`);
    } else {
      levels.add(`${message.guild.id}.${message.author.id}`, { xp: randomxp });
      return;
    }
}
}