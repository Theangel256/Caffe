import { EmbedBuilder, PermissionsBitField } from 'discord.js';
import { getOrCreateDB, getMember } from '../utils/functions.js';
import keySystem from '../utils/models/keys.js';
import levelSystem from '../utils/models/levels.js';
import usersSystem from '../utils/models/users.js';
import warnsSystem from '../utils/models/warns.js';

export async function run(client, message, args) {
  const keysDB = await getOrCreateDB(keySystem, { guildID: message.guild.id });
  const levels = await getOrCreateDB(levelSystem, { guildID: message.guild.id, userID: message.author.id });
  const warns = await getOrCreateDB(warnsSystem, { guildID: message.guild.id, userID: message.author.id });
  const users = await getOrCreateDB(usersSystem, { userID: message.author.id });

// Cargar idioma
  const langCode = users.language || 'en';
  const lang = await import(`../utils/languages/profile.${langCode}.js`).then(m => m.default);

  // === COMANDO: profile set ===
  if (args[0]?.toLowerCase() === 'set') {
    const embed = new EmbedBuilder()
      .setAuthor(lang.set.embed.author.replace(/{user.username}/gi, message.author.username), message.author.displayAvatarURL({ format: 'jpg', dynamic: true }))
      .setColor(message.guild.members.me.displayHexColor)
      .setDescription(lang.set.embed.desc.replace(/{prefix}/, client.prefix));

    if (!args[1]) return message.channel.send({ embeds: [embed] });

    if (args[1].toLowerCase() === 'desc') {
      if (!args[2]) return message.channel.send(lang.desc.noArgs);
      users.personalText = args.slice(2).join(' ');
      await users.save();
      return message.channel.send(lang.desc.success.replace(/{args}/gi, args.slice(2).join(' ')));
    }

    if (args[1].toLowerCase() === 'lang') {
      if (!args[2]) return message.channel.send(lang.lang.noArgs);
      if (!['es', 'en'].includes(args[2].toLowerCase())) return message.channel.send(lang.lang.helper);
      users.language = args[2].toLowerCase();
      await users.save();
      const newLang = await import(`../utils/languages/profile.${users.language}.js`).then(m => m.default);
      return message.channel.send(newLang.lang.success.replace(/{args}/gi, args[2]));
    }

    return message.channel.send(lang.wrongChoice);
  }


  const member = getMember(message, args, true);
  if(member.user.bot) return message.channel.send(lang.bot);

  const { money, marryId, personalText, reputation } = users;
  const { xp, lvl } = levels
  const populated = await users.populate('partner');
  const embed = new EmbedBuilder()
    .setAuthor(
      lang.profile.replace(/{user.username}/gi, member.user.username),
      member.user.displayAvatarURL({ format: 'jpg', dynamic: true })
    )
    .setThumbnail(member.user.displayAvatarURL({ format: 'jpg', dynamic: true }))
    .setDescription(
      personalText || lang.profileDesc
    )
    .addFields(
      { name: lang.currencies, value: money.toLocaleString(), inline: true },
      { name: lang.lvl, value: `${lvl} (XP: ${xp})`, inline: true },
      { name: lang.rep, value: reputation.toLocaleString(), inline: true },
      { name: lang.maritalStatus, value: users.isMarried ? lang.married.replace(/{partner.username}/gi, populated.partner?.username) : lang.notMarried, inline: true },
      { name: lang.maritalStatus, value: `<@${marryId || lang.notMarried}>`, inline: true },
      { name: lang.trophies, value: trophyData?.trophies?.join(', ') || lang.trophiesOf, inline: false }
    )
    .setColor(member.displayHexColor)
    .setTimestamp()
    .setFooter({ text: lang.beta });

  return message.channel.send({ embeds: [embed] });
};
export const help = {
  name: "profile",
  description: "Muestra tu logros a los demas!",
};
export const requirements = {
  userPerms: [],
  clientPerms: [PermissionsBitField.Flags.EmbedLinks],
  ownerOnly: false,
};
