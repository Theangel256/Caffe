const warnSystem = require("../structures/models/warnSystem");
const MessageModel2 = require("../structures/models/warnMembers");
const getMember = require('../structures/functions/getMember');
module.exports.run = async (client, message, args) => {
    if (!args[0])
      return message.channel.send("You haven't said anything. Put a member or `set`");

    //warn <member> <reason> o warn set <role/kick/ban> <número de warns o false> <roles (sólo modo roles)>
    let msgDocument = await warnSystem.findOne({
      guildID: message.guild.id
    }).catch(err => console.log(err));
    if (!msgDocument) {
      try {
        let dbMsg = await new warnSystem({ guildID: message.guild.id, role: false, roletime: 0, roleid: '0', kick: false, kicktime: 0, ban: false, bantime: 0 });
        var dbMsgModel = await dbMsg.save();
      } catch (err) {
        console.log(err);
      }
    } else {
      dbMsgModel = msgDocument;
    }
    if (args[0] === "set") {
      if (args[1] === "role") {

        //warn set roles <warns o false> <roles>
        if (!args[2]) return message.channel.send('First put the number of warnings to put the role, and then mention the role, write its ID or write its name. Set "false" to not use roles in this system.')
        if (args[2] === "false") {
          try {
            await dbMsgModel.updateOne({ role: false });
            message.channel.send("Okay, I'll not put a role.");
          } catch (err) {
            console.log(err);
            return message.channel.send("I can't update my database info. Here's a debug: " + err);
          }
        } else {
          let warnings = parseInt(args[2]);
          let roleObj = message.mentions.roles.first() ||
            message.guild.roles.cache.get(args[3]) ||
            message.guild.roles.cache.find(r => r.name === args.slice(3).join(" "));
          if (!isNaN(warnings)) {
            if (roleObj) {
              try {
                 await dbMsgModel.updateOne({
                  role: true,
                  roletime: warnings,
                  roleid: roleObj.id
                });
                message.channel.send("Now I am going to put the role " + roleObj.name + " to the members that have " +
                    warnings + " warning(s)");
              } catch (err) {
                console.log(err);
                return message.channel.send("I can't update my database info. Here's a debug: " + err);
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
      } else if (args[1] === "kick") {
        //warn set kick <warns o false>
        if (!args[2]) return message.channel.send('Put the number of warnings necessary to kick the member.')
        if (args[2] === "false") {
          try {
             await dbMsgModel.updateOne({ kick: false });
            message.channel.send("I'll not kick anyone.");
          } catch (err) {
            console.log(err);
            return message.channel.send("I can't update my database info. Here's a debug: " + err);
          }
        } else {
          let warnings = parseInt(args[3]);
          if (!isNaN(warnings)) {
            try {
               await dbMsgModel.updateOne({
                kick: true,
                kicktime: warnings
              });
              message.channel.send("Now I'll kick members who have " + warnings + " warnings.");
            } catch (err) {
              console.log(err);
              return message.channel.send("I can't update my database info. Here's a debug: " + err);
            }
          } else {
            return message.channel.send("That isn't a valid number of warnings");
          }
        }
      } else if (args[1] === "ban") {
        //warn set ban <warns o false>
        if (!args[2]) return message.channel.send('Put the number of warnings necessary to ban the member.')
        if (args[2] === "false") {
          try {
             await dbMsgModel.updateOne({ ban: false });
            message.channel.send("I'll not kick anyone.");
          } catch (err) {
            console.log(err);
            return message.channel.send("I can't update my database info. Here's a debug: " + err);
          }
        } else {
          let warnings = parseInt(args[2]);
          if (!isNaN(warnings)) {
            try {
               await dbMsgModel.updateOne({
                ban: true,
                bantime: warnings
              });
              message.channel.send("Now I'll ban members who have " + warnings + " warnings.");
            } catch (err) {
              console.log(err);
              return message.channel.send("I can't update my database info. Here's a debug: " + err);
            }
          } else {
            return message.channel.send("That isn't a valid number of warnings");
          }
        }
      } else {
        message.channel.send("Usage: `warn set <role, kick, ban> <number or false> <role id (only role option)>`");
      }
    } else {

      //Aqui viene lo importante, warn <member> <reason>.
      let member = getMember(message, args.slice(0, 1), false);
      if (!member) return message.channel.send("Invalid member!");
      let document = await MessageModel2.findOne({
        guildID: message.guild.id,
        userID: member.user.id
      }).catch(err => console.log(err));
      if (!document) {
        try {
          let dbMsg = await new MessageModel2({ guildID: message.guild.id, userID: member.user.id, warnings: 0 });
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
          let {
            role,
            roletime,
            roleid,
            kick,
            kicktime,
            ban,
            bantime
          } = dbMsgModel;
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
        } catch (error) {
          console.log(error);
        }
      } else {
        return message.channel.send("Something happened");
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