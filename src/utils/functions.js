const cooldownniveles = new Map();
import levelSystem from "./models/levels.js";
import warnMembers from "./models/warns.js";
import guildSystem from "./models/guilds.js";
import { EmbedBuilder } from 'discord.js';
export async function getOrCreateDB(model, query, defaults = {}) {
  try {
    const doc = await model.findOneAndUpdate(
      query,
      { $setOnInsert: { ...defaults, ...query } },
      { new: true, upsert: true }
    );
    console.log(`[DB] Buscar: ${model.modelName} para ${query.guildID || query.userID}`);
    return doc;
  } catch (err) {
    console.error(`Error en getOrCreate con modelo ${model.modelName}:`, err);
    throw err;
  }
};
export async function getRank(users, message) {
    const list = [];
    for (const id of users) {
      const user = message.guild.members.cache.has(id.userID)
        ? message.guild.members.cache.get(id.userID).user.tag
        : await message.client.users.fetch(id.userID).tag;
      list.push([user, id.lvl, id.xp]);
    }
    list.sort((user1, user2) => {
      return user2[1] - user1[1] || user2[2] - user1[2];
    });
    return list;
  }
export function getMember(message, args, autor = true, argIndex = 0) {
    const members = message.guild.members.cache;
  
    let searchRaw = Array.isArray(args)
      ? args.slice(argIndex).join(" ").toLowerCase().trim()
      : String(args).toLowerCase().trim();
  
    if (!searchRaw && autor) return message.member;
    if (!searchRaw) return null;
  
    const result =
      message.mentions?.members?.first?.() ||                  // Mención directa
      members.get(searchRaw) ||                                // ID directo
      members.find(member => (
        member.user.username.toLowerCase().includes(searchRaw) ||
        member.user.tag.toLowerCase().includes(searchRaw) ||
        member.displayName.toLowerCase().includes(searchRaw)
      ));
  
    return result || (autor ? message.member : null);
  }
export function missingPerms(client, member, perms = Array, lang) {
    if (!member || !member.permissions || typeof member.permissions.missing !== 'function') {
      console.error("¡'member' inválido o sin permisos definidos!", member);
      return "Permissions not allowed";
    }

    const missingPerms = member.permissions.missing(perms).map((str) =>
        `\`${str
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b(\w)/g, (char) => char.toUpperCase())}\``);

    return missingPerms.length > 1
      ? lang.missingPerms
          .replace(/{missingPerms0}/gi, missingPerms.slice(0, -1).join(", "))
          .replace(/{missingPerms1}/gi, missingPerms.slice(-1)[0])
      : missingPerms[0];
  }
export function generateKey(length = 30) {
    var lowercase = "abcdefghijklmnopqrstuvwxyz";
    var uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var digits = "0123456789";
    var punctuation = "()[]{}.:,:<>/|'\"?+=-_`~!@#$%^&*";

    var characters = lowercase + uppercase + digits + punctuation;
    var charactersCount = characters.length;
    var password = "";

    for (var i = 0; i < length; i++) {
      var randomPos = Math.floor(Math.random() * charactersCount);
      password += characters.charAt(randomPos);
    }
    return password;
  }
export async function regExp(client, message, lang) {
    if (
      /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discord\.com\/invite)\/.+[a-z]/gim.test(
        message.content
      )
    ) {
      const warnsDB = await getOrCreateDB(warnMembers, { guildID: message.guild.id, userID: message.author.id });
      const guildsDB = await getOrCreateDB(guildSystem, { guildID: message.guild.id }); 
      if (warnsDB) {
        try {
          const {
            channelLogs,
            kick,
            kicktime,
            ban,
            bantime,
            role,
            roletime,
            roleid,
          } = guildsDB;
          const { warnings } = warnsDB;
          const newWarnings = warnings + 1;
          const embed = new EmbedBuilder()
            .setAuthor({ name: lang.events.message.ant.warned.replace(/{author.tag}/gi, message.author.tag), iconURL: message.author.displayAvatarURL({ extension: "webp" })})
            .setDescription(`${lang.events.message.ant.reason} ${lang.events.message.ant.warn}`);
          if (message.deletable) message.delete();
          await warnsDB.updateOne({ warnings: newWarnings });
          message.channel.send({ embeds: [embed] });
          message.author.send(`You've been warned on ${message.guild.name} with reason: ${lang.events.message.ant.warn}. You have ${newWarnings} warning(s).`).catch(() => { null;});
          try {
            if (role && roletime <= newWarnings) {
              await member.roles.add(roleid, "Too many warnings");
            }
          
            if (kick && kicktime === newWarnings) {
              await member.kick("Too many warnings");
            }
          
            if (ban && bantime === newWarnings) {
              await member.ban({ reason: "Too many warnings" });
            }
          } catch (error) {
            console.error("Error al aplicar sanción por advertencias:", error.message);
          }
          const canal = client.channels.cache.get(channelLogs);
            const embed2 = new EmbedBuilder()
            .setColor("RED")
            .setDescription("**Warn**")
            .addFields(
              { name: "「:boy:」" + lang.events.message.ant.author, value: message.author.tag },
              { name: "「:speech_balloon:」" + lang.events.message.ant.reason, value: lang.events.message.ant.warn },
              { name: "「:closed_book:」" + lang.events.message.ant.warns, value: warnings.toString() },
              { name: "「:fleur_de_lis:️」" + lang.events.message.ant.moderator, value: "Bot" });
          if (!canal) return;
          canal.send({ embeds: [embed2] });
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
export async function levels(message) {
    if (cooldownniveles.has(message.guild.id + message.author.id)) {
      const time = cooldownniveles.get(message.guild.id + message.author.id);
      if (Date.now() < time) return;
    }
    const levels = await getOrCreateDB(levelSystem, { guildID: message.guild.id, userID: message.author.id });
    const { xp, lvl } = levels;
    const randomxp = Math.floor(1.0 * Math.sqrt(xp + 1));
    const lvlup = lvl * 80;
    if (xp + randomxp >= lvlup) {
      await levels.updateOne({ lvl: lvl + 1, xp: 0 });
      return message.channel.send(`Felicidades ${message.author.tag}, Subiste al nivel ${parseInt(lvl + 1)}!`);
    }
    await levels.updateOne({ xp: xp + randomxp });
    cooldownniveles.set(message.guild.id + message.author.id, Date.now() + 7000);
    return message;
  }