const guildSystem = require("../structures/models/guilds");
const warnMembers = require("../structures/models/warns");
const { getMember } = require("../structures/functions.js");
module.exports.run = async (client, message, args) => {
	if (!args[0]) return message.channel.send("You haven't said anything. Put a member or `set`");
	// warn <member> <reason> o warn set <role/kick/ban> <número de warns o false> <roles (sólo modo roles)>
	const msgDocument = await guildSystem.findOne({
		guildID: message.guild.id,
	}).catch(err => console.log(err));
	if (!msgDocument) {
		try {
			const dbMsg = await new guildSystem({ guildID: message.guild.id, prefix: process.env.prefix, language: "en", role: false, roletime: 0, kick: false, kicktime: 0, ban: false, bantime: 0 });
			var guilds = await dbMsg.save();
		} catch (err) { console.log(err); }
	} else {
		guilds = msgDocument;
	}
	if (args[0].toLowerCase() === "set") {
		try{
			switch(args[1]) {
			case "role": {
			// warn set roles <warns o false> <roles>
				if (!args[2]) return message.channel.send("First put the number of warnings to put the role, and then mention the role, write its ID or write its name. Set \"false\" to not use roles in this system.");
				if (args[2] === "false") {
					try {
						await guilds.updateOne({ role: false });
						return message.channel.send("Okay, I'll not put a role.");
					}
					catch (err) {
						console.log(err);
						return message.channel.send("I can't update my database info. Here's a debug: " + err);
					}
				}
				else {
					const warnings = parseInt(args[2]);
					const roleObj = message.mentions.roles.first() ||
            message.guild.roles.cache.get(args[3]) ||
            message.guild.roles.cache.find(r => r.name === args.slice(3).join(" "));
					if (!isNaN(warnings)) {
						if (roleObj) {
							try {
								await guilds.updateOne({
									role: true,
									roletime: warnings,
								});
								await warns.updateONe({
									roleid: roleObj.id,
								});
								return message.channel.send("Now I am going to put the role " + roleObj.name + " to the members that have " +
                 warnings + " warning(s)");
							}
							catch (err) {
								console.log(err);
								return message.channel.send("I can't update my database info. Here's a debug: " + err);
							}
						}
						else {
							return message.channel.send("That role isn't valid.");
						}
					}
					else {
						return message.channel.send("That isn't a valid number of warnings");
					}
				}
			}
				break;
			case "kick": {
			// warn set kick <warns o false>
				if (!args[2]) return message.channel.send("Put the number of warnings necessary to kick the member.");
				if (args[2] === "false") {
					try {
						await guilds.updateOne({ kick: false });
						return message.channel.send("I'll not kick anyone.");
					}
					catch (err) {
						console.log(err);
						return message.channel.send("I can't update my database info. Here's a debug: " + err);
					}
				}
				else {
					const warnings = parseInt(args[3]);
					if (!isNaN(warnings)) {
						try {
							await guilds.updateOne({
								kick: true,
								kicktime: warnings,
							});
							return message.channel.send("Now I'll kick members who have " + warnings + " warnings.");
						}
						catch (err) {
							console.log(err);
							return message.channel.send("I can't update my database info. Here's a debug: " + err);
						}
					}
					else {
						return message.channel.send("That isn't a valid number of warnings");
					}
				}
			}
				break;
			case "ban": {
			// warn set ban <warns o false>
				if (!args[2]) return message.channel.send("Put the number of warnings necessary to ban the member.");
				if (args[2] === "false") {
					try {
						await guilds.updateOne({ ban: false });
						return message.channel.send("I'll not kick anyone.");
					}
					catch (err) {
						console.log(err);
						return message.channel.send("I can't update my database info. Here's a debug: " + err);
					}
				}
				else {
					const warnings = parseInt(args[2]);
					if (!isNaN(warnings)) {
						try {
							await guilds.updateOne({
								ban: true,
								bantime: warnings,
							});
							return message.channel.send("Now I'll ban members who have " + warnings + " warnings.");
						}
						catch (err) {
							console.log(err);
							return message.channel.send("I can't update my database info. Here's a debug: " + err);
						}
					}
					else {
						return message.channel.send("That isn't a valid number of warnings");
					}
				}
			}
			break;
			default: {
				return message.channel.send("Usage: `warn set <role, kick, ban> <number or false> <role id (only role option)>`");
			}
			}
		} catch (e) { console.error(e); }
	}
	else {
		// Aqui viene lo importante, warn <member> <reason>.
		var member = getMember(message, args.slice(0, 1), false);
		if (!member) return message.channel.send("Invalid member!");
		const document = await warnMembers.findOne({
			guildID: message.guild.id,
			userID: member.user.id,
		}).catch(err => console.log(err));
		if (!document) {
			try {
				const dbMsg = await new warnMembers({ guildID: message.guild.id, userID: member.user.id, warnings: 0 });
				var warns = await dbMsg.save();
			}
			catch (err) {
				console.log(err);
			}
		}
		else {
			warns = document;
		}
	}
	if (warns) {
		try {
			const { warnings } = warns;
			const newWarnings = warnings + 1;
			await warns.updateOne({ warnings: newWarnings });
			if (args[2]) {
				member.send(`"You've been warned on ${message.guild.name} with reason: ${args.slice(2).join(" ")}. You have ${newWarnings} warning(s).`)
					.catch(() => { null; });
				// El único error que sepa yo salga de aquí es que si el usuario tenga DMs desactivados.
				message.channel.send(`I've warned ${member.user.tag} with reason: ${args.slice(2).join(" ")}. They now have ${newWarnings} warnings.`);
			}
			else {
				member.send(`You've been warned on ${message.guild.name}. You have ${newWarnings} warning(s).`)
					.catch(() => { null; });
				message.channel.send(`I've warned ${member.user.tag}. They now have ${newWarnings} warnings.`);
			}
			const {
				role,
				roletime,
				roleid,
				kick,
				kicktime,
				ban,
				bantime,
			} = guilds;
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
		catch (error) {
			console.log(error);
		}
	} else {
		return message.channel.send("Something happened");
	}
};
module.exports.help = {
	name: "warn",
	description: "Sanciona a un miembro mal portado :/",
};
module.exports.requirements = {
	userPerms: ["BAN_MEMBERS"],
	clientPerms: [],
	ownerOnly: false,
};