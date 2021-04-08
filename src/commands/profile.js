/*
const db = require('quick.db')
const {getMember} = require('../structures/functions.js');
module.exports.run = async (client, message, args) => {
  const levels = new db.table('levels');
  const profile = new db.table('profile');
  const economy = new db.table('economy');
  const trofeos = new db.table('trophies');
  const marry = new db.table('marrys');
  let langcode = profile.has(`${message.author.id}.language`) ? await profile.fetch(`${message.author.id}.language`) : 'en';
  let lang = require(`../structures/languages/profile.${langcode}.js`);
  if(args[0]) {
	if (args[0].toLowerCase() === 'set') {
		const embed2 = new client.Discord.MessageEmbed()
		.setAuthor(lang.set.embed.author.replace(/{user.username}/gi, message.author.username), message.author.displayAvatarURL({format:'jpg', dynamic:true}))
		.setColor(message.guild.me.displayHexColor)
		.setDescription(lang.set.embed.desc.replace(/{prefix}/, client.prefix));
		if (!args[1]) return message.channel.send(embed2);
	if(args[1].toLowerCase() === 'desc') {
		if(!args[2]) return message.channel.send(lang.desc.noArgs);
		profile.set(`${message.author.id}`, { personalText: args.slice(2).join(' ')});
		return message.channel.send(lang.desc.success.replace(/{args}/gi, args.slice(2).join(' ')));
	}else if(args[1].toLowerCase() === 'lang') {
		if(!args[2]) return message.channel.send(lang.lang.noArgs);
		if(!['es', 'en'].includes(args[2].toLowerCase())) return message.channel.send(lang.lang.helper);
		profile.set(`${message.author.id}.language`, args.slice(2).join(' '));
		lang = require(`../structures/languages/profile.${langcode}.js`);
		return message.channel.send(lang.lang.success.replace(/{args}/gi, args.slice(2).join(' ')));
	}else{
		return message.channel.send(lang.wrongChoice);
	}
  }
}
  const member = getMember(message, args, true);
  if(member.user.bot) return message.channel.send(lang.bot);
  if(!levels.has(`${message.guild.id}.${message.author.id}`)) levels.set(`${message.guild.id}.${message.author.id}`, { xp: 0, lvl: 0 });
  if(!economy.has(`${member.user.id}.money`)) await economy.set(`${member.user.id}.money`, 200);
  if(!economy.has(`${member.user.id}.rep`)) await economy.set(`${member.user.id}.rep`,  0);
  const dinero = await economy.fetch(`${member.user.id}.money`);
  const reputation = await economy.fetch(`${member.user.id}.rep`);
  const { xp, lvl } = await levels.fetch(`${message.guild.id}.${member.user.id}`);
  const embed = new client.Discord.MessageEmbed()
  .setAuthor(lang.profile.replace(/{user.username}/gi, member.user.username), member.user.displayAvatarURL({ format: 'jpg', dynamic: true }))
  .setThumbnail(member.user.displayAvatarURL({ format: 'jpg', dynamic: true }))
  .setDescription(profile.has(`${member.user.id}.personalText`) ? await profile.fetch(`${member.user.id}.personalText`) : lang.profileDesc)
  .addField(lang.currencies, dinero.toLocaleString())
  .addField(lang.lvl, `${lvl} (XP: ${xp})`, true)
  .addField(lang.rep, reputation.toLocaleString(), true)
  .addField(lang.married, marry.has(`${member.user.id}.tag`) ? await marry.fetch(`${member.user.id}.tag`) : lang.marriedOf)
  .addField(lang.trophies, trofeos.has(member.user.id) ? await trofeos.fetch(member.user.id) : lang.trophiesOf)
  .setColor(member.displayHexColor)
  .setTimestamp()
  .setFooter(lang.beta);
  return message.channel.send(embed);
};
*/
module.exports.help = {
	name: 'profile',
	description: 'Muestra tu logros a los demas!',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: ['EMBED_LINKS'],
	ownerOnly: false,
};