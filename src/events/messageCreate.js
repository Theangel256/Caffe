const moment = require("moment");
require("moment-duration-format");
const { levels, missingPerms, regExp, getOrCreateDB } = require("../utils/functions.js");
const guilds = require("../utils/models/guilds");
const { joinVoiceChannel } = require("@discordjs/voice");
const { PermissionsBitField, EmbedBuilder } = require("discord.js");
module.exports = async (client, message) => {
  if (message.channel.type === "dm") return;
  if (!message.guild) return;
  if (message.author.bot) return;
  const botPerms = message.guild.members.me.permissionsIn(message.channel);
  const guildsDB = await getOrCreateDB(guilds, { guildID: message.guild.id });
  const { prefix, language } = guildsDB;
  client.prefix = prefix;
  client.lang = require(`../utils/languages/${language}.js`);
  client.joinVoiceChannel = function (channel) {
    return joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });
  };
  
  if (message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
    const invite = await client.generateInvite({
      PermissionsBitField: [ 
        PermissionsBitField.Flags.Administrator,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.ReadMessageHistory,
        PermissionsBitField.Flags.EmbedLinks,
        PermissionsBitField.Flags.AttachFiles,
        PermissionsBitField.Flags.AddReactions,
        PermissionsBitField.Flags.UseExternalEmojis,
      ],
      scopes: ["bot", "applications.commands"],
    });
    const embed = new EmbedBuilder()
      .addFields(
        { name: `:gear: | Prefix`, value: `> \`${client.prefix}\`` },
        {  name: `:satellite: | \`${client.prefix}\`Help`, value: client.lang.events.message.isMentioned.field1 },
        {  name: `❔ | ${client.lang.events.message.isMentioned.field2}`, value: `>>> [${client.lang.events.message.isMentioned.invite}](${invite})\n[Discord](${process.env.URL}/discord)\n[Twitter](https://twitter.com/Theangel256)`
      })
      .setFooter({
        text: client.lang.events.message.isMentioned.footer + require("../../package.json").version,
        iconURL: client.user.displayAvatarURL({ extension: "webp"})
      })
      .setTimestamp()
      .setColor(0x00ffff);
    message.channel
      .send({ embeds: [embed] })
  }
  regExp(client, message);  
  if (!message.content.startsWith(client.prefix)) return levels(message);
  console.log(message.content); 
  const args = message.content.slice(client.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command) || client.aliases.get(command);

  if (!cmd) return;
  if (!botPerms.has(PermissionsBitField.Flags.SendMessages)) return;
  
  if (cmd.requirements.ownerOnly && !process.env.owners.includes(message.author.id))
    return message.reply(client.lang.only_developers);

  if (cmd.requirements.userPerms && !message.member.permissions.has(cmd.requirements.userPerms))
    return message.reply(client.lang.userPerms.replace(/{function}/gi, missingPerms(client, message.member, cmd.requirements.userPerms)));

  if (cmd.requirements.clientPerms && !botPerms.has(cmd.requirements.clientPerms))
    return message.reply(client.lang.clientPerms.replace(/{function}/gi, missingPerms(client, message.guild.members.me, cmd.requirements.clientPerms)));

  if (cmd.limits) {
    const key = `${command}-${message.author.id}`;
    const now = Date.now();
    const cooldown = cmd.limits.cooldown;
    const rateLimit = cmd.limits.rateLimit || 1;
  
    const timestamps = client.limits.get(key) || [];
  
    // Elimina usos viejos fuera del cooldown
    const recentUses = timestamps.filter(ts => now - ts < cooldown);
  
    if (recentUses.length >= rateLimit) {
      const nextAvailable = cooldown - (now - recentUses[0]);
      const duracion = moment.duration(nextAvailable).format("D [d], H [hrs], m [m], s [s]");
      return message.channel.send(client.lang.wait.replace(/{duration}/gi, duracion));
    }
  
    // Guardamos el uso actual
    recentUses.push(now);
    client.limits.set(key, recentUses);
  
    // Limpieza automática opcional
    setTimeout(() => {
      const updated = client.limits.get(key)?.filter(ts => Date.now() - ts < cooldown);
      if (!updated || updated.length === 0) {
        client.limits.delete(key);
      } else {
        client.limits.set(key, updated);
      }
    }, cooldown);
  }

  cmd.run(client, message, args);
};
