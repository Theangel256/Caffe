import pkg from '../../package.json' assert { type: 'json' };
import guilds from "../utils/models/guilds.js";
import { levels, missingPerms, regExp, getOrCreateDB } from "../utils/functions.js";
import { PermissionsBitField, EmbedBuilder } from "discord.js";
import moment from "moment";
import "moment-duration-format";
import { joinVoiceChannel, VoiceConnectionStatus, entersState } from "@discordjs/voice";
export default async function messageCreate(client, message) {
  if (message.channel.type === "dm") return;
  if (!message.guild) return;
  if (message.author.bot) return;
  const botPerms = message.guild.members.me.permissionsIn(message.channel);
  const guildsDB = await getOrCreateDB(guilds, { guildID: message.guild.id });
  const { prefix, language } = guildsDB;
  client.prefix = prefix;
  const langCode = language || 'en';
  let lang;
  try {
    lang = await import(`../utils/languages/${langCode}.js`)
      .then(m => m.default);
  } catch {
    lang = await import(`../utils/languages/en.js`)
  }
  
  client.joinVoiceChannel = async function (channel) {
  try {
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfDeaf: false,
    });
    await entersState(connection, VoiceConnectionStatus.Ready, 15_000);
    return connection;
  } catch (error) {
    console.error("❌ Error al conectar al canal de voz:\n", error);
    throw error;
  }
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
        {  name: `:satellite: | \`${client.prefix}\`Help`, value: lang.events.message.isMentioned.field1 },
        {  name: `❔ | ${lang.events.message.isMentioned.field2}`, value: `>>> [${lang.events.message.isMentioned.invite}](${invite})\n[Discord](${process.env.PUBLIC_URL}/discord)\n[Twitter](https://twitter.com/Theangel256)`
      })
      .setFooter({
        text: lang.events.message.isMentioned.footer + pkg.version,
        iconURL: client.user.displayAvatarURL({ extension: "webp"})
      })
      .setTimestamp()
      .setColor(0x00ffff);
    message.channel
      .send({ embeds: [embed] })
  }
  regExp(client, message, lang);  
  if (!message.content.startsWith(client.prefix)) return levels(message);
  console.log(message.content); 
  const args = message.content.slice(client.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command) || client.aliases.get(command);

  if (!cmd) return;
  if (!botPerms.has(PermissionsBitField.Flags.SendMessages)) return;
  
  if (cmd.requirements.ownerOnly && !process.env.owners.includes(message.author.id))
    return message.reply(lang.only_developers);

  if (cmd.requirements.userPerms && !message.member.permissions.has(cmd.requirements.userPerms))
    return message.reply(lang.userPerms.replace(/{function}/gi, missingPerms(client, message.member, cmd.requirements.userPerms, lang)));

  if (cmd.requirements.clientPerms && !botPerms.has(cmd.requirements.clientPerms))
    return message.reply(lang.clientPerms.replace(/{function}/gi, missingPerms(client, message.guild.members.me, cmd.requirements.clientPerms, lang)));

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
      return message.channel.send(lang.wait.replace(/{duration}/gi, duracion));
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

  cmd.run(client, message, args, lang);
};
