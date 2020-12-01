const db = require('quick.db');
const {getMember} = require('../structures/functions.js');
module.exports.run = async (_client, message, args) => {
  const warnSystem = new db.table('warnSystem');
  const warnMembers = new db.table('warnMembers');
    if (!args[0]) return message.channel.send("You haven't said anything. Put a member or `set`");
    //warn <member> <reason> o warn set <role/kick/ban> <número de warns o false> <roles (sólo modo roles)>
    if(!warnSystem.has(`${message.guild.id}`)) warnSystem.set(`${message.guild.id}`, { role: false, kick: false, ban: false  });
    if (args[0] === "set") {
      switch(args[1]) {
        case 'role': {
        //warn set roles <warns o false> <roles>
        if (!args[2]) return message.channel.send('First put the number of warnings to put the role, and then mention the role, write its ID or write its name. Set "false" to not use roles in this system.');
        if (args[2] === "false") {
          warnSystem.set(`${message.guild.id}`, { role: false });
          message.channel.send("Okay, I'll not put a role.");
        } else {
          let warnings = parseInt(args[2]);
          let roleObj = message.mentions.roles.first() ||
            message.guild.roles.cache.get(args[3]) ||
            message.guild.roles.cache.find(r => r.name === args.slice(3).join(" "));
          if (!isNaN(warnings)) {
            if (roleObj) {
              warnSystem.set(`${message.guild.id}`, { role: true, roletime: warnings, roleid: roleObj.id });
              message.channel.send(`Now I am going to put the role ${roleObj.name} to the members that have ${warnings} warning(s)`);
            } else {
              return message.channel.send("That role isn't valid.");
            }
          } else {
            return message.channel.send("That isn't a valid number of warnings");
          }
        }
        }
        break;
        case 'kick': {
        //warn set kick <warns o false>
        if (!args[2]) return message.channel.send('Put the number of warnings necessary to kick the member.');
        if (args[2] === "false") {
          warnSystem.set(`${message.guild.id}`, { kick: false });
          message.channel.send("I'll not kick anyone.");
        } else {
          let warnings = parseInt(args[3]);
          if (!isNaN(warnings)) {
            warnSystem.set(`${message.guild.id}`, { kick: true, kicktime: warnings });
            message.channel.send(`Now I'll kick members who have ${warnings} warnings.`);
          } else {
            return message.channel.send("That isn't a valid number of warnings");
          }
        }
        }
        break;
        case 'ban': {
        //warn set ban <warns o false>
        if (!args[2]) return message.channel.send('Put the number of warnings necessary to ban the member.')
        if (args[2] === "false") {
          warnSystem.set(`${message.guild.id}`, { ban: false });
          message.channel.send("I'll not kick anyone.");
        } else {
          let warnings = parseInt(args[2]);
          if (!isNaN(warnings)) {
            warnSystem.set(`${message.guild.id}`, { ban: true, bantime: warnings });
            message.channel.send(`Now I'll ban members who have ${warnings} warnings.`);
          } else {
            return message.channel.send("That isn't a valid number of warnings");
          }
        }
      }
      break;
        default: {
          message.channel.send("Usage: `warn set <role, kick, ban> <number or false> <role id (only role option)>`");
        }
      }
    } else {
      //Aqui viene lo importante, warn <member> <reason>.
      let member = getMember(message, args.slice(0, 1), false);
      if (!member) return message.channel.send("Invalid member!");
      let { warnings } = warnMembers.get(`${message.guild.id}.${member.user.id}`);
      let newWarnings = warnings + 1;
      warnMembers.add(`${message.guild.id}.${member.user.id}`, { warnings: newWarnings })
      if (args[2]) {
        member.send(`"You've been warned on ${message.guild.name} with reason: ${args.slice(2).join(" ")}. You have ${newWarnings} warning(s).`)
        .catch(() => {});
        //El único error que sepa yo salga de aquí es que si el usuario tenga DMs desactivados.
        message.channel.send(`I've warned ${member.user.tag} with reason: ${args.slice(2).join(" ")}. They now have ${newWarnings} warnings.`);
      } else {
        member.send(`You've been warned on ${message.guild.name}. You have ${newWarnings} warning(s).`)
        .catch(() => {});
        message.channel.send(`I've warned ${member.user.tag}. They now have ${newWarnings} warnings.`);
      }
      let { role, roletime, roleid, kick, kicktime, ban, bantime } = warnSystem.get(`${message.guild.id}`);
          if (role) {
            if (roletime <= newWarnings) {
              member.roles.add(roleid, "Too many warnings");
            }
          }
          if (kick) {
            if (kicktime == newWarnings) {
              member.kick("Too many warnings");
            }
          }
          if (ban) {
            if (bantime == newWarnings) {
              member.ban({ reason: "Too many warnings" });
            }
          }
    }
};
module.exports.help = {
	name: 'warn',
	description: 'Sanciona a un miembro mal portado :/',
};
module.exports.requirements = {
	userPerms: ['BAN_MEMBERS'],
	clientPerms: [],
	ownerOnly: false,
};