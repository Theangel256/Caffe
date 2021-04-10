const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../data.sqlite');
const cooldownniveles = new Map();
const axios = require('axios');
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
	generateKey: (length = 20, wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$') => {
		const crypto = require('crypto');
		return Array.from(crypto.randomFillSync(new Uint32Array(length)))
			.map((x) => wishlist[x % wishlist.length])
			.join('');
	},
	regExp: (client, message) => {
		const warns = new db.table('warns');
		const guilds = new db.table('guilds');
		if(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discord\.com\/invite)\/.+[a-z]/gim.test(message.content)) {
			const embed = new client.Discord.MessageEmbed()
				.setAuthor(client.lang.events.message.ant.warned.replace(/{author.tag}/gi, message.author.tag), message.author.displayAvatarURL({ dynamic:true }))
				.setDescription(`${client.lang.events.message.ant.reason} ${client.lang.events.message.ant.warn}`);
			if(message.deletable) message.delete().catch(e => console.error(e.message));
			warns.add(`${message.guild.id}.${message.author.id}.warnings`, 1);
			message.channel.send(embed);
			const count = warns.fetch(`${message.guild.id}.${message.author.id}`);
			const channelLog = guilds.fetch(`${message.guild.id}.channels.logs`);
			const embed2 = new client.Discord.MessageEmbed()
				.setColor('RED')
				.setDescription('**Warn**')
				.addField('「:boy:」' + client.lang.events.message.ant.author, message.author.tag)
				.addField('「:speech_balloon:」' + client.lang.events.message.ant.reason, client.lang.events.message.ant.warn)
				.addField('「:closed_book:」' + client.lang.events.message.ant.warns, count.warnings)
				.addField('「:fleur_de_lis:️」' + client.lang.events.message.ant.moderator, 'Bot');
			const canal = client.channels.cache.get(channelLog);
			if(canal) return canal.send(embed2);
		}
	},

	levels: async (message) => {
		if(cooldownniveles.has(message.guild.id + message.author.id)) {
			const time = cooldownniveles.get(message.guild.id + message.author.id);
			if(Date.now() < time) return;
		}

		db.get(`SELECT * FROM levelSystem WHERE idguild = ${message.guild.id}`, (err, filas) => {
			if (err) return console.error(err.message);
			if(!filas) {
				db.run(`INSERT INTO levelSystem(idguild, idusuario, lvl, exp) VALUES(${message.guild.id}, ${message.author.id} 0, 1)`, function(err) {
					if (err) return console.error(err.message);
				});
			}
			else{
				const randomxp = Math.floor(0.2 * Math.sqrt(400 + 1));
				const lvlup = filas.lvl * 60;
				if((filas.exp + randomxp) >= lvlup) {
					const update = `UPDATE levelSystem SET exp = 0, lvl = ${parseInt(filas.lvl + 1)} WHERE idusuario = ${message.author.id}`;
					db.run(update, function(err) {
						if (err) return console.error('function levels\n' + err.message);
						return message.channel.send(`Felicidades ${message.author.tag}, Subiste al nivel ${parseInt(filas.lvl + 1)}!`);
					});
				}
				const update = `UPDATE levelSystem SET exp = ${parseInt(filas.exp + randomxp)} WHERE idusuario = ${message.author.id}`;
				db.run(update, function(err) {
					if (err) return console.error('function levels\n' + err.message);
				});

			}
		});
		cooldownniveles.set(message.guild.id + message.author.id, Date.now() + 5000);
	},
	muteSystem: (client) => {
		const MuteDB = new db.table('systemMute');
		const guilds = MuteDB.all();
		for(const guild_id in guilds) {
			const servidor = client.guilds.cache.get(guild_id);
			if(!servidor) {
				MuteDB.delete(guild_id);
				continue;
			}
			for(const user_id in guilds[guild_id]) {
				const member = servidor.members.cache.get(user_id);
				if(!member) {
					MuteDB.delete(`${guild_id}.${user_id}`);
					continue;
				}
				const muted_role = servidor.roles.cache.get(guilds[guild_id][user_id].rolID);
				if(Date.now() >= guilds[guild_id][user_id]) {
					if(muted_role && member.roles.cache.has(muted_role)) {
						member.roles.remove(muted_role.id).catch(err => console.log(err.message));
						console.log('asd');
					}
					MuteDB.delete(`${guild_id}.${user_id}`);
				}
			}
		}
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