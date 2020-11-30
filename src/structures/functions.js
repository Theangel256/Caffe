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
regExp: async (client, message) => {
    if(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discord\.com\/invite)\/.+[a-z]/gim.test(message.content)) {
        const embed = new client.Discord.MessageEmbed()
            .setAuthor(client.lang.events.message.ant.warned.replace(/{author.tag}/gi, message.author.tag), message.author.displayAvatarURL({ dynamic:true }))
            .setDescription(`${client.lang.events.message.ant.reason} ${client.lang.events.message.ant.warn}`);
        if(message.deletable) await message.delete().catch(e => console.error(e.message));
        let document = await MessageModel2.findOne({
            guildID: message.guild.id,
            userID: message.author.id
          }).catch(err => console.log(err));
          if (!document) {
            try {
              let dbMsg = await new MessageModel2({ guildID: message.guild.id, userID: message.author.id, warnings: 0 });
              var dbMsgModel2 = await dbMsg.save();
            } catch (err) {
              console.log(err);
            }
          } else {
            dbMsgModel2 = document;
          }
          if (dbMsgModel2) {
            try {
              let { warnings } = dbMsgModel2;
              let newWarnings = warnings + 1;
               await dbMsgModel2.updateOne({ warnings: newWarnings });
            } catch (error) {
              console.log(error);
            }
          } else {
            return message.channel.send("Something happened");
        }
        message.channel.send(embed);
        const count = await getData({guildID: message.guild.id, userID: message.author.id }, 'warnMembers');
        const opciones = await getData({guildID: message.guild.id }, 'guild');
        const embed2 = new client.Discord.MessageEmbed()
            .setColor('RED')
            .setDescription('**Warn**')
            .addField('「:boy:」' + client.lang.events.message.ant.author, message.author.tag)
            .addField('「:speech_balloon:」' + client.lang.events.message.ant.reason, client.lang.events.message.ant.warn)
            .addField('「:closed_book:」' + client.lang.events.message.ant.warns, count.warnings)
            .addField('「:fleur_de_lis:️」' + client.lang.events.message.ant.moderator, 'Bot');
        const canal = client.channels.cache.get(opciones.channelLogs);
        if(canal) return await canal.send(embed2);
    }
},
 levels: async (message) => {
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
}