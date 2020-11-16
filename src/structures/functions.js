/*const database = require('./DatabaseManager');
const level_db = new database('niveles');
const cooldownmute = new database('cooldownmute');
const opciones = new database('opciones');
const cooldownniveles = new Map();
module.exports = {
	RegExpFunc: async (client, message) => {
		const warns = new client.database('warns');
		if(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discord\.com\/invite)\/.+[a-z]/gim.test(message.content)) {
			if(message.member.permissions.has(['ADMINISTRATOR'])) return;
			const embed = new client.Discord.MessageEmbed()
				.setAuthor(client.lang.events.message.ant.warned.replace(/{author.tag}/gi, message.author.tag), message.author.displayAvatarURL({ dynamic:true }))
				.setDescription(`${client.lang.events.message.ant.reason} ${client.lang.events.message.ant.warn}`);
			if(message.deletable) await message.delete().catch(e => console.error(e.message));
			await message.channel.send(embed);
			if(!warns.has(`${message.guild.id}.${message.author.id}.warns`)) {
				await warns.set(`${message.guild.id}.${message.author.id}.warns`, 0);
			}
			await warns.add(`${message.guild.id}.${message.author.id}.warns`, 1);
			if(!warns.has(`${message.guild.id}.${message.author.id}.reason`)) {
				await warns.set(`${message.guild.id}.${message.author.id}.reason`, [client.lang.events.message.ant.warn]);
			}
			else {
				await warns.push(`${message.guild.id}.${message.author.id}.reason`, [client.lang.events.message.ant.warn]);
			}
			const count = await warns.get(`${message.guild.id}.${message.author.id}.warns`);
			const channelLog = await opciones.get(`${message.guild.id}.channels.logs`);
			const embed2 = new client.Discord.MessageEmbed()
				.setColor('RED')
				.setDescription('**Warn**')
				.addField('「:boy:」' + client.lang.events.message.ant.author, message.author.tag)
				.addField('「:speech_balloon:」' + client.lang.events.message.ant.reason, client.lang.events.message.ant.warn)
				.addField('「:closed_book:」' + client.lang.events.message.ant.warns, count)
				.addField('「:fleur_de_lis:️」' + client.lang.events.message.ant.moderator, 'Bot');
			const canal = client.channels.resolve(channelLog);
			if(canal) return await canal.send(embed2);
		}
	},
	auth: async (req, res, next) => {
		if(req.isAuthenticated()) {
			return next();
		} else return res.redirect('/api/login');
	},
	nivelesFunc: async (message) => {
		if(cooldownniveles.has(message.guild.id + message.author.id)) {
			const time = cooldownniveles.get(message.guild.id + message.author.id);
			if(Date.now() < time) return;
		}
		let niveles = await level_db.get(`${message.guild.id}.${message.author.id}`);
		if(!niveles) {
			level_db.set(`${message.guild.id}.${message.author.id}`, { xp: 0, lvl: 1 });
			niveles = await level_db.get(`${message.guild.id}.${message.author.id}`);
		}
		const randomxp = Math.ceil(Math.random() * 10);
		const lvlup = niveles.lvl * 80;
		if(message.author.bot) return;
		cooldownniveles.set(message.guild.id + message.author.id, Date.now() + 5000);
		if((niveles.xp + randomxp) >= lvlup) {
			level_db.set(`${message.guild.id}.${message.author.id}`, { xp: 0, lvl: parseInt(niveles.lvl + 1) });
			return message.channel.send(`Felicidades ${message.author.tag}, Subiste al nivel ${parseInt(niveles.lvl + 1)}!`);
		}
		else {
			level_db.add(`${message.guild.id}.${message.author.id}.xp`, randomxp);
			return;
		}
	},
	getRank: (users, message) => {
		const userlist = [];
		for(const key in users) {
			const usuario = message.guild.members.cache.has(key) ? message.guild.members.cache.get(key).user.tag : message.client.users.fetch(key).tag;
			userlist.push([usuario, users[key].lvl, users[key].xp]);
		}
		userlist.sort((user1, user2) => {
			return user2[1] - user1[1] || user2[2] - user1[2];
		});
		return userlist;
	},
	iteracion_mute: async (client) => {
		const guilds = cooldownmute.all();
		for(const guild_id in guilds) {
			const servidor = client.guilds.cache.get(guild_id);
			if(!servidor) {
				cooldownmute.delete(guild_id);
				continue;
			}

			const muted_role = servidor.roles.cache.find(r => r.name == 'Muted');
			for(const user_id in guilds[guild_id]) {
				const member = servidor.members.cache.get(user_id);
				if(!member) {
						cooldownmute.delete(`${guild_id}.${user_id}`);
					continue;
				}
				if(Date.now() >= guilds[guild_id][user_id]) {
					if(muted_role && member.roles.cache.has(muted_role)) {
						member.roles.remove(muted_role.id).catch(err => console.log(err.message));
						console.log("asd")
					}
				cooldownmute.delete(`${guild_id}.${user_id}`);
				}
			}
		}
	},
	missingPerms: (client, member, perms) => {
		const missingPerms = member.permissions.missing(perms)
			.map(str => `\`${str.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)/g, char => char.toUpperCase())}\``);

		return missingPerms.length > 1
			? client.lang.missingPerms.replace(/{missingPerms0}/gi, missingPerms.slice(0, -1).join(', ')).replace(/{missingPerms1}/gi, missingPerms.slice(-1)[0])
			: missingPerms[0];

	},
	getMember: (message, args, autor = true) => {
		let search = args.join(' '),
			result;
		if (!search) {
			result = autor === true ? message.member : null;
		} else {
			search = search.toLowerCase();
			result = message.mentions.members.first() || 
			message.guild.members.resolve(search) ||
			message.guild.members.cache.find(e => e.user.username.toLowerCase().includes(search) ||
			e.user.tag.toLowerCase().includes(search) ||
			e.displayName.toLowerCase().includes(search)) || 
			message.member
	}
	return result;
},
	generateKey: (length = 20, wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$') => { 
		const crypto = require('crypto')
		return Array.from(crypto.randomFillSync(new Uint32Array(length)))
		.map((x) => wishlist[x % wishlist.length])
		.join(''); 
	} 
};
*/