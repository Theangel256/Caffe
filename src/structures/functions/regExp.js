const database = require('../DatabaseManager');
const opciones = new database('opciones');

module.exports = async function regExp(client, message) {
    const warns = new client.database('warns');
    if(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discord\.com\/invite)\/.+[a-z]/gim.test(message.content)) {
        if(message.member.permissions.has(['ADMINISTRATOR'])) return;
        const embed = new client.Discord.MessageEmbed()
            .setAuthor(client.lang.events.message.ant.warned.replace(/{author.tag}/gi, message.author.tag), message.author.displayAvatarURL({ dynamic:true }))
            .setDescription(`${client.lang.events.message.ant.reason} ${client.lang.events.message.ant.warn}`);
        if(message.deletable) await message.delete().catch(e => console.error(e.message));
        await message.channel.send(embed);
        if(!warns.has(`${message.guild.id}.${message.author.id}.warns`)) {
            await warns.set(`${message.guild.id}.${message.author.id}.warns`, 0);
        }
        await warns.add(`${message.guild.id}.${message.author.id}.warns`, 1);
        if(!warns.has(`${message.guild.id}.${message.author.id}.reason`)) {
            await warns.set(`${message.guild.id}.${message.author.id}.reason`, [client.lang.events.message.ant.warn]);
        }
        else {
            await warns.push(`${message.guild.id}.${message.author.id}.reason`, [client.lang.events.message.ant.warn]);
        }
        const count = await warns.get(`${message.guild.id}.${message.author.id}.warns`);
        const channelLog = await opciones.get(`${message.guild.id}.channels.logs`);
        const embed2 = new client.Discord.MessageEmbed()
            .setColor('RED')
            .setDescription('**Warn**')
            .addField('「:boy:」' + client.lang.events.message.ant.author, message.author.tag)
            .addField('「:speech_balloon:」' + client.lang.events.message.ant.reason, client.lang.events.message.ant.warn)
            .addField('「:closed_book:」' + client.lang.events.message.ant.warns, count)
            .addField('「:fleur_de_lis:️」' + client.lang.events.message.ant.moderator, 'Bot');
        const canal = client.channels.resolve(channelLog);
        if(canal) return await canal.send(embed2);
    }
}