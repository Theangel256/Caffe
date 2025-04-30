const moment = require("moment");
require("moment-duration-format");
const { levels, missingPerms, regExp } = require("../functions");
const guilds = require("../models/guilds");
const { PermissionsBitField, Client, EmbedBuilder } = require("discord.js");
module.exports = async (client, message) => {
  if (message.channel.type === "dm") return;
  if (!message.guild) return;
  if (message.author.bot) return;
  const msgDocument = await guilds
    .findOne({
      guildID: message.guild.id,
    })
    .catch((err) => console.log(err));
  if (!msgDocument) {
    try {
      const dbMsg = await new guilds({
        guildID: message.guild.id,
        prefix: process.env.prefix,
        language: "en",
        role: false,
        kick: false,
        ban: false,
      });
      var dbMsgModel = await dbMsg.save();
    } catch (err) {
      console.log(err);
    }
  } else {
    dbMsgModel = msgDocument;
  }
  const { prefix, language } = dbMsgModel;
  client.prefix = prefix;
  client.lang = require(`../languages/${language}.js`);
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
        iconURL: client.user.displayAvatarURL({ format: "jpg", dynamic: true })
      })
      .setTimestamp()
      .setColor(0x00ffff);
    message.channel
      .send({ embeds: [embed] })
  }
  regExp(client, message);

  if (!message.content.startsWith(client.prefix)) return levels(message);
  
  const args = message.content.slice(client.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command) || client.aliases.get(command);

  if (!cmd) return;
  if (!message.guild.me.permissions.has("SEND_MESSAGES")) return;

  if (cmd.requirements.ownerOnly && !process.env.owners.includes(message.author.id))
    return message.reply(client.lang.only_developers);

  if (cmd.requirements.userPerms && !message.member.permissions.has(cmd.requirements.userPerms))
    return message.reply(client.lang.userPerms.replace(/{function}/gi, missingPerms(client, message.member, cmd.requirements.userPerms)));

  if (cmd.requirements.clientPerms &&
    !message.guild.me.permissions.has(cmd.requirements.clientPerms)
  )
    return message.reply(client.lang.clientPerms.replace(/{function}/gi, missingPerms(client, message.guild.me, cmd.requirements.clientPerms)));

  if (cmd.limits) {
    const current = client.limits.get(`${command}-${message.author.id}`);

    if (!current) {
      client.limits.set(`${command}-${message.author.id}`, 1);
    } else {
      const duracion = moment
        .duration(cmd.limits.cooldown)
        .format(" D [d], H [hrs], m [m], s [s]");
      if (current >= cmd.limits.rateLimit)
        return message.channel.send(
          client.lang.wait.replace(/{duration}/gi, duracion)
        );
      client.limits.set(`${command}-${message.author.id}`, current + 1);
    }
    setTimeout(() => {
      client.limits.delete(`${command}-${message.author.id}`);
    }, cmd.limits.cooldown);
  }

  cmd.run(client, message, args);
};
