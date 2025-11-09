import guildSystem from "../utils/models/guilds.js";
import warnMembers from "../utils/models/warns.js";
import { getMember, getOrCreateDB } from "../utils/functions.js";
import { PermissionsBitField } from "discord.js";
export async function run(client, message, args) {
  if (!args[0]) return message.channel.send("You haven't said anything. Put a member or `set`");
  const guilds = await getOrCreateDB(guildSystem, { guildID: message.guild.id }); 
  if (args[0].toLowerCase() === "set") {
    try {
      switch (args[1]) {
        case "role":
          {
            if (!args[2])
              return message.channel.send(
                'First put the number of warnings to put the role, and then mention the role, write its ID or write its name. Set "false" to not use roles in this system.'
              );
            if (args[2] === "false") {
              try {
                await guilds.updateOne({ role: false });
                return message.channel.send("Okay, I'll not put a role.");
              } catch (err) {
                console.log(err);
                return message.channel.send(
                  "I can't update my database info. Here's a debug: " + err
                );
              }
            } else {
              const warnings = parseInt(args[2]);
              const roleObj =
                message.mentions.roles.first() ||
                message.guild.roles.cache.get(args[3]) ||
                message.guild.roles.cache.find(
                  (r) => r.name === args.slice(3).join(" ")
                );
              if (!isNaN(warnings)) {
                if (roleObj) {
                  try {
                    await guilds.updateOne({
                      role: true,
                      roletime: warnings,
                      roleid: roleObj.id,
                    });
                    return message.channel.send(
                      "Now I am going to put the role " +
                        roleObj.name +
                        " to the members that have " +
                        warnings +
                        " warning(s)"
                    );
                  } catch (err) {
                    console.log(err);
                    return message.channel.send(
                      "I can't update my database info. Here's a debug: " + err
                    );
                  }
                } else {
                  return message.channel.send("That role isn't valid.");
                }
              } else {
                return message.channel.send(
                  "That isn't a valid number of warnings"
                );
              }
            }
          }
          break;
        case "kick":
          {
            if (!args[2])
              return message.channel.send(
                "Put the number of warnings necessary to kick the member."
              );
            if (args[2] === "false") {
              try {
                await guilds.updateOne({ kick: false });
                return message.channel.send("I'll not kick anyone.");
              } catch (err) {
                console.log(err);
                return message.channel.send(
                  "I can't update my database info. Here's a debug: " + err
                );
              }
            } else {
              const warnings = parseInt(args[2]);
              if (!isNaN(warnings)) {
                try {
                  await guilds.updateOne({ kick: true, kicktime: warnings });
                  return message.channel.send(
                    "Now I'll kick members who have " + warnings + " warnings."
                  );
                } catch (err) {
                  console.log(err);
                  return message.channel.send(
                    "I can't update my database info. Here's a debug: " + err
                  );
                }
              } else {
                return message.channel.send(
                  "That isn't a valid number of warnings"
                );
              }
            }
          }
          break;
        case "ban":
          {
            if (!args[2])
              return message.channel.send(
                "Put the number of warnings necessary to ban the member."
              );
            if (args[2] === "false") {
              try {
                await guilds.updateOne({ ban: false });
                return message.channel.send("I'll not kick anyone.");
              } catch (err) {
                console.log(err);
                return message.channel.send(
                  "I can't update my database info. Here's a debug: " + err
                );
              }
            } else {
              const warnings = parseInt(args[2]);
              if (!isNaN(warnings)) {
                try {
                  await guilds.updateOne({
                    ban: true,
                    bantime: warnings,
                  });
                  return message.channel.send(
                    "Now I'll ban members who have " + warnings + " warnings."
                  );
                } catch (err) {
                  console.log(err);
                  return message.channel.send(
                    "I can't update my database info. Here's a debug: " + err
                  );
                }
              } else {
                return message.channel.send(
                  "That isn't a valid number of warnings"
                );
              }
            }
          }
          break;
        default: {
          return message.channel.send(
            "Usage: `warn set <role, kick, ban> <number or false> <role id (only role option)>`"
          );
        }
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    const target = getMember(message, args.slice(0, 1), false);
    if (!target) return message.reply('Menciona a alguien.');
    const reason = args.slice(1).join(' ') || 'Sin razón';
    const duration = 10 * 60 * 1000; // 10 minutos
    const muteRole = message.guild.roles.cache.find(r => r.name === 'Muted') || await message.guild.roles.create({
      name: 'Muted',
      reason: 'Rol de mute automático'
    });
    let warn = await getOrCreateDB(warnMembers, { guildID: message.guild.id, userID: target.id });
    warn.warnings += 1;
    warn.reasons.push(reason);
    warn.muteUntil = new Date(Date.now() + duration);
    warn.muteRoleID = muteRole.id;
    
    await warn.save(); // ← Aquí se dispara el post('save')
    await target.roles.add(muteRole).catch(() => {});
    const embed = new EmbedBuilder()
    .setTitle('Usuario Advertido')
    .setDescription(`${target} ha sido muteado por ${duration / 60000} minutos.`)
    .addFields(
      { name: 'Razón', value: reason },
      { name: 'Advertencias', value: warn.warnings.toString() }
    )
    .setColor('#ff0000');
    
    message.channel.send({ embeds: [embed] });
    /*
    // Aqui viene lo importante, warn <member> <reason>.
    var member = getMember(message, args.slice(0, 1), false);
    if (!member) return message.channel.send("Invalid member!");
    const warns = await getOrCreateDB(warnMembers, { guildID: message.guild.id, userID: message.author.id });
    if (!warns) return message.channel.send(lang.dbError);
    const { warnings, reasons } = warns;
    const newWarnings = warnings + 1;
    const reason = args.slice(1).join(" ") || "Sin razón especificada";
    try {
      await warns.updateOne({
        warnings: newWarnings,
        reasons: [...reasons, reason],
      });
      const dmMessage = warns.reasons.length > 0
      ? `You've been warned on ${message.guild.name} with reason: ${warns.reasons[warns.reasons.length - 1]}. You have ${newWarnings} warning(s).`
      : `You've been warned on ${message.guild.name}. You have ${newWarnings} warning(s).`;
  
      const publicMessage = warns.reasons.length > 0
      ? `I've warned ${member.user.tag} with reason: ${warns.reasons[warns.reasons.length - 1]}. They now have ${newWarnings} warnings.`
      : `I've warned ${member.user.tag}. They now have ${newWarnings} warnings.`;

      try { await member.send(dmMessage); } catch (err) { console.warn(`No se pudo enviar DM a ${member.user.tag}: ${err.message}`);}
      message.channel.send(publicMessage); 
      const { role, roletime, roleid, kick, kicktime, ban, bantime } = guilds;
      if (role) {
        if (roletime <= newWarnings)
          member.roles
            .add(roleid, "Too many warnings")
            .catch(new Error("Missing Permissions"));
      }
      if (kick) {
        if (kicktime == newWarnings)
          member
            .kick("Too many warnings")
            .catch(new Error("Missing Permissions"));
      }
      if (ban) {
        if (bantime == newWarnings)
          member
            .ban({ reason: "Too many warnings" })
            .catch(new Error("Missing Permissions"));
      }
    } catch (err) {
      console.error(err);
      return message.channel.send(lang.dbError);
    }
    */
  }
};
export const help = {
  name: "warn",
  description: "Sanciona a un miembro mal portado :/",
};
export const requirements = {
  userPerms: [PermissionsBitField.Flags.BanMembers],
  clientPerms: [],
  ownerOnly: false,
};
