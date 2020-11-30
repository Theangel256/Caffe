const MessageModel2 = require("../models/warnMembers");
const { getData } = require('../functions/databaseManager');

module.exports = async function regExp(client, message) {
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
        const channelLog = await getData({guildID: message.guild.id }, 'guild').channelLog;
        console.log(channelLog)
        const embed2 = new client.Discord.MessageEmbed()
            .setColor('RED')
            .setDescription('**Warn**')
            .addField('「:boy:」' + client.lang.events.message.ant.author, message.author.tag)
            .addField('「:speech_balloon:」' + client.lang.events.message.ant.reason, client.lang.events.message.ant.warn)
            .addField('「:closed_book:」' + client.lang.events.message.ant.warns, count)
            .addField('「:fleur_de_lis:️」' + client.lang.events.message.ant.moderator, 'Bot');
        const canal = client.channels.cache.get(channelLog);
        if(canal) return await canal.send(embed2);
    }
}