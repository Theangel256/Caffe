const cooldownniveles = new Map();
const axios = require('axios');
const levels = require("../structures/models/levels");
const warns = require("../structures/models/warns");
const guildSystem = require('../structures/models/guilds');
module.exports = {
	auth: (req, res, next) => {
		if(req.isAuthenticated()) {
			return next();
		}
		else {return res.redirect('/signin');}
	},
	getRank: async (users, message) => {
		const list = [];
		for(const id in users) {
			const user = message.guild.members.cache.has(id) ? message.guild.members.cache.get(id).user.tag : message.client.users.fetch(id).tag;
			list.push([user, users[id].lvl, users[id].exp]);
		}
		list.sort((user1, user2) => {
			return user2[1] - user1[1] || user2[2] - user1[2];
		});
		return list;
	},
	getMember: (message, args, autor = true) => {
		let search = args.join(' ');
		let result;
		if (!search) {
			result = autor === true ? message.member : null;
		}
		else {
			search = search.toLowerCase();
			result = message.mentions.members.first() ||
        message.guild.members.resolve(search) ||
        message.guild.members.cache.find(e => e.user.username.toLowerCase().includes(search) ||
        e.user.tag.toLowerCase().includes(search) ||
        e.displayName.toLowerCase().includes(search)) ||
        message.member;
		}
		return result;
	},
	missingPerms: (client, member, perms = Array) => {
		const missingPerms = member.permissions.missing(perms)
			.map(str => `\`${str.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)/g, char => char.toUpperCase())}\``);

		return missingPerms.length > 1
			? client.lang.missingPerms.replace(/{missingPerms0}/gi, missingPerms.slice(0, -1).join(', ')).replace(/{missingPerms1}/gi, missingPerms.slice(-1)[0])
			: missingPerms[0];

	},
	generateKey: (length = 30) => {
		var lowercase = "abcdefghijklmnopqrstuvwxyz";
		var uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var digits = "0123456789";
		var punctuation = "()[]{}.:,:<>/|'\"?+=-_`~!@#$%^&* ";

		var characters = lowercase + uppercase + digits + punctuation;
		var charactersCount = characters.length;
		var password = '';

		for (var i = 0; i < length; i++) {
			var randomPos = Math.floor(Math.random() * charactersCount);
			password += characters.charAt(randomPos);
		}
		return password;
	},
	regExp: async (client, message) => {
		if(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discord\.com\/invite)\/.+[a-z]/gim.test(message.content)) {
			const msgDocument = await warns.findOne({
				guildID: message.guild.id,
				userID: message.author.id,
			}).catch(err => console.log(err));
			if (!msgDocument) {
				try {
					const dbMsg2 = await new warns({ guildID: message.guild.id, userID: message.author.id, warnings: 0, rolID: '0', time: 0 });
					var dbMsgModel = await dbMsg2.save();
				}
				catch (err) {
					console.log(err);
				}
			}
			else {
				dbMsgModel = msgDocument;
			}
			const msgDocument2 = await guildSystem.findOne({
				guildID: message.guild.id,
			}).catch(err => console.log(err));
			if (!msgDocument2) {
				try {
					const dbMsg2 = await new guildSystem({ guildID: message.guild.id, prefix: process.env.prefix, language: 'en', channelLogs: '0', channelWelcome: '0', channelGoodbye: '0', role: false, roletime: 0, kick: false, kicktime: 0, ban: false, bantime: 0 });
					var dbMsgModel2 = await dbMsg2.save();
				}
				catch (err) {
					console.log(err);
				}
			}
			else {
				dbMsgModel2 = msgDocument2;
			}
			if (dbMsgModel) {
				try {
					const {
						channelLogs,
						kick,
						kicktime,
						ban,
						bantime,
						role,
						roletime,
					} = dbMsgModel2;

					const { warnings, rolID } = dbMsgModel;
					const newWarnings = warnings + 1;
					const embed = new client.Discord.MessageEmbed()
						.setAuthor(client.lang.events.message.ant.warned.replace(/{author.tag}/gi, message.author.tag), message.author.displayAvatarURL({ dynamic:true }))
						.setDescription(`${client.lang.events.message.ant.reason} ${client.lang.events.message.ant.warn}`);
					if(message.deletable) message.delete().catch(() => { null; });
					await dbMsgModel.updateOne({ warnings: newWarnings });
					message.channel.send(embed);
					const embed2 = new client.Discord.MessageEmbed()
						.setColor('RED')
						.setDescription('**Warn**')
						.addField('「:boy:」' + client.lang.events.message.ant.author, message.author.tag)
						.addField('「:speech_balloon:」' + client.lang.events.message.ant.reason, client.lang.events.message.ant.warn)
						.addField('「:closed_book:」' + client.lang.events.message.ant.warns, warnings)
						.addField('「:fleur_de_lis:️」' + client.lang.events.message.ant.moderator, 'Bot');
					const canal = client.channels.cache.get(channelLogs);
					if(canal) return canal.send(embed2);
					message.author.send(`"You've been warned on ${message.guild.name} with reason: ${client.lang.events.message.ant.warn}. You have ${newWarnings} warning(s).`)
						.catch(() => { null; });
					// El único error es que si el usuario tenga DMs desactivados.
					if (role) {
						if (roletime <= newWarnings) {
							message.member.roles.add(rolID, "Too many warnings");
						}
					}
					if (kick) {
						if (kicktime == newWarnings) {
							message.member.kick("Too many warnings");
						}
					}
					if (ban) {
						if (bantime == newWarnings) {
							message.member.ban({ reason: "Too many warnings" });
						}
					}
				}
				catch (error) {
					console.log(error);
				}
			}
		}
	},

	levels: async (message) => {
		if(cooldownniveles.has(message.guild.id + message.author.id)) {
			const time = cooldownniveles.get(message.guild.id + message.author.id);
			if(Date.now() < time) return;
		}
		const msgDocument = await levels.findOne({
			guildID: message.guild.id,
		}).catch(err => console.log(err));
		if (!msgDocument) {
			try {
				const dbMsg = await new levels({ guildID: message.guild.id, userID: message.author.id, xp: 1, lvl: 0 });
				var dbMsgModel = await dbMsg.save();
			}
			catch (err) {
				console.log(err);
			}
		}
		else {
			dbMsgModel = msgDocument;
		}
		const { lvl, xp } = dbMsgModel;
		const randomxp = Math.floor(0.2 * Math.sqrt(400 + 1));
		const lvlup = lvl * 60;
		if((xp + randomxp) >= lvlup) {
			await dbMsgModel.updateOne({ lvl: lvl + 1, xp: 0 });
			return message.channel.send(`Felicidades ${message.author.tag}, Subiste al nivel ${parseInt(lvl + 1)}!`);
		}
		await dbMsgModel.updateOne({ xp: xp + randomxp });
		cooldownniveles.set(message.guild.id + message.author.id, Date.now() + 10000);
	},
	Landiacraft: (client) => {
		const guild = client.guilds.cache.get('498164647833239563');
		const discTotalCh = client.channels.cache.get('607007646704205855');
		const discOnlineCh = client.channels.cache.get('606251126244900874');
		const minecraftOn = client.channels.cache.get('606534123795906570');
		const minecraftInline = client.channels.cache.get('606317624401592331');
		if(!discOnlineCh && !(guild) && !(discTotalCh) && !(minecraftInline) && !(minecraftOn)) return;
		const canales = guild.channels.cache.filter((x) => [discOnlineCh.id, discTotalCh.id, minecraftInline.id, minecraftOn.id].includes(x.id)).filter((x) => x.permissionsFor(guild.me).has('MANAGE_CHANNELS'));
		if(canales.size < 4) return console.error('Hay uno o mas canales en los que no tengo permisos');
		setInterval(function() {
			discOnlineCh.setName(`Discord Online: ${guild.members.cache.filter(x => x.user.presence.status !== 'offline').size}`);
			discTotalCh.setName(`Discord Total: ${guild.memberCount}`);
			axios.get('https://api.mcsrvstat.us/2/landiacraft.com:25565').then(data => {
				console.log(data);
				data = JSON.parse(data);
				if(!data.ping) return console.log('Error | Servidor fuera de linea o no disponible.');
				if(data.online) {
					minecraftInline.setName(`Minecraft: ${data.players.online}/${data.players.max}`);
					minecraftOn.setName('Minecraft: Encendido');
				}
				else {
					minecraftOn.setName('Minecraft: Apagado');
					minecraftInline.setName('Minecraft: 0');
				}
			}).catch(err => { return console.log(err);});
		}, 10000);
	},
};