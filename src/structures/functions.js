const cooldownniveles = new Map();
const levelSystem = require("../structures/models/levels");
const warnMembers = require("../structures/models/warns");
const guildSystem = require("../structures/models/guilds");
module.exports = {
  auth: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      return res.redirect("/signin");
    }
  },
  getRank: async (users, message) => {
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
  },
  getMember: (message, args, autor = Boolean) => {
    let search = args.join(" ");
    let result;
    if (!search) {
      result = autor === true ? message.member : null;
    } else {
      search = search.toLowerCase();
      result =
        message.mentions.members.first() ||
        message.guild.members.resolve(search) ||
        message.guild.members.cache.find(
          (e) =>
            e.user.username.toLowerCase().includes(search) ||
            e.user.tag.toLowerCase().includes(search) ||
            e.displayName.toLowerCase().includes(search)
        ) ||
        message.member;
    }
    return result;
  },
  missingPerms: (client, member, perms = Array) => {
    const missingPerms = member.permissions.missing(perms).map(
      (str) =>
        `\`${str
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b(\w)/g, (char) => char.toUpperCase())}\``
    );

    return missingPerms.length > 1
      ? client.lang.missingPerms
          .replace(/{missingPerms0}/gi, missingPerms.slice(0, -1).join(", "))
          .replace(/{missingPerms1}/gi, missingPerms.slice(-1)[0])
      : missingPerms[0];
  },
  generateKey: (length = 30) => {
    var lowercase = "abcdefghijklmnopqrstuvwxyz";
    var uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var digits = "0123456789";
    var punctuation = "()[]{}.:,:<>/|'\"?+=-_`~!@#$%^&* ";

    var characters = lowercase + uppercase + digits + punctuation;
    var charactersCount = characters.length;
    var password = "";

    for (var i = 0; i < length; i++) {
      var randomPos = Math.floor(Math.random() * charactersCount);
      password += characters.charAt(randomPos);
    }
    return password;
  },
  regExp: async (client, message) => {
    if (
      /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discord\.com\/invite)\/.+[a-z]/gim.test(
        message.content
      )
    ) {
      const msgDocument = await warnMembers
        .findOne({
          guildID: message.guild.id,
          userID: message.author.id,
        })
        .catch((err) => console.log(err));
      if (!msgDocument) {
        try {
          const dbMsg2 = await new warnMembers({
            guildID: message.guild.id,
            userID: message.author.id,
            warnings: 0,
            time: 0,
          });
          var warns = await dbMsg2.save();
        } catch (err) {
          console.log(err);
        }
      } else {
        warns = msgDocument;
      }
      const guilds = await guildSystem
        .findOne({
          guildID: message.guild.id,
        })
        .catch((err) => console.log(err));
      if (warns) {
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
          } = guilds;
          const { warnings } = warns;
          const newWarnings = warnings + 1;
          const embed = new client.Discord.MessageEmbed()
            .setAuthor(
              client.lang.events.message.ant.warned.replace(
                /{author.tag}/gi,
                message.author.tag
              ),
              message.author.displayAvatarURL({ dynamic: true })
            )
            .setDescription(
              `${client.lang.events.message.ant.reason} ${client.lang.events.message.ant.warn}`
            );
          if (message.deletable) message.delete();
          await warns.updateOne({ warnings: newWarnings });
          message.channel.send(embed);
          message.author
            .send(
              `You've been warned on ${message.guild.name} with reason: ${client.lang.events.message.ant.warn}. You have ${newWarnings} warning(s).`
            )
            .catch(() => {
              null;
            });
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
          const canal = client.channels.cache.get(channelLogs);
          const embed2 = new client.Discord.MessageEmbed()
            .setColor("RED")
            .setDescription("**Warn**")
            .addField(
              "「:boy:」" + client.lang.events.message.ant.author,
              message.author.tag
            )
            .addField(
              "「:speech_balloon:」" + client.lang.events.message.ant.reason,
              client.lang.events.message.ant.warn
            )
            .addField(
              "「:closed_book:」" + client.lang.events.message.ant.warns,
              warnings
            )
            .addField(
              "「:fleur_de_lis:️」" + client.lang.events.message.ant.moderator,
              "Bot"
            );
          if (!canal) return;
          canal.send(embed2);
        } catch (error) {
          console.log(error);
        }
      }
    }
  },
  levels: async (message) => {
    if (cooldownniveles.has(message.guild.id + message.author.id)) {
      const time = cooldownniveles.get(message.guild.id + message.author.id);
      if (Date.now() < time) return;
    }
    const msgDocument = await levelSystem
      .findOne({
        guildID: message.guild.id,
        userID: message.author.id,
      })
      .catch((err) => console.log(err));
    if (!msgDocument) {
      try {
        const dbMsg = await new levelSystem({
          guildID: message.guild.id,
          userID: message.author.id,
          xp: 1,
          lvl: 1,
        });
        var levels = await dbMsg.save();
      } catch (err) {
        console.log(err);
      }
    } else {
      levels = msgDocument;
    }
    const { xp, lvl } = levels;
    const randomxp = Math.floor(1.0 * Math.sqrt(xp + 1));
    const lvlup = lvl * 80;
    if (xp + randomxp >= lvlup) {
      await levels.updateOne({ lvl: lvl + 1, xp: 0 });
      return message.channel.send(
        `Felicidades ${message.author.tag}, Subiste al nivel ${parseInt(
          lvl + 1
        )}!`
      );
    }
    await levels.updateOne({ xp: xp + randomxp });
    cooldownniveles.set(
      message.guild.id + message.author.id,
      Date.now() + 5000
    );
  },
};
