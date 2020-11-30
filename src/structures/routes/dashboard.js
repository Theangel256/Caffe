const express = require('express');
const router = express.Router();
const { auth } = require('../functions');
const db = require('quick.db')
const guilds = new db.table('guilds');
const lvl = new db.table('levels')
router.get('/', auth, async (req, res) => {
	const guilds = req.user.guilds.filter(p => (p.permissions & 8) === 8);
	const userAvatarURL = (req.isAuthenticated() ? (await req.bot.users.fetch(req.user.id)).displayAvatarURL({ format: 'png', dynamic: true}) : null) 
	res.render('dashboard.ejs', {
		user: req.user,
		bot: req.bot,
		title: "Caffe - The Discord Bot",
		login : (req.isAuthenticated() ? 'si' : 'no'),
		textLogin: (req.isAuthenticated() ? req.user.username : 'Login'),
		guilds,
		userAvatarURL
	});
})
.get('/:id', auth, async (req, res) => {
		const idserver = req.params.id,
			guild = req.bot.guilds.cache.get(idserver);
		if(!guild) return res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=8&scope=bot&response_type=code&guild_id=${idserver}`);
		const userPermission = (await guild.members.fetch(req.user.id)).hasPermission('ADMINISTRATOR');
		if(!userPermission) return res.redirect('/error404');
		res.render('guilds.ejs', {
			title: "Caffe - Dashboard Bot",
			login : (req.isAuthenticated() ? 'si' : 'no'),
			textLogin: (req.isAuthenticated() ? req.user.username : 'Login'),
			user: req.user,
			guild,
			guilds,
			bans: guild.me.hasPermission('BAN_MEMBERS') ? await guild.fetchBans().then(x => x.size) : false,
			bot: req.bot,
			usuarios: getRank(lvl.get(idserver), guild),
		});
	})
	.post('/:id/welcome', auth, (req, res) => {
		const idserver = req.params.id,
			id_channel = req.body.channel_ID;
		if(!id_channel || id_channel === 'no_select') {
			guilds.delete(`${idserver}.channels.welcome`)
			res.redirect(`/dashboard/${idserver}`);
		} else {
			guilds.set(`${idserver}.channels.welcome`, id_channel)
			res.redirect(`/dashboard/${idserver}`);
		}
	})
	.post('/:id/goodbye', auth, (req, res) => {
		const idserver = req.params.id;
		const id_channel = req.body.channelID;
		if(!id_channel || id_channel === 'no_select') {
			guilds.delete(`${idserver}.channels.goodbye`)
			res.redirect(`/dashboard/${idserver}`);
		} else {
			guilds.set(`${idserver}.channels.goodbye`, id_channel)
			res.redirect(`/dashboard/${idserver}`);
		}
	})
	.post('/:id/rolauto', auth, async (req, res) => {
		const idserver = req.params.id,
			id_role = req.body.rol_ID;
		if(!id_role || id_role === 'no_select') {
			guilds.delete(`${idserver}.role`)
			res.redirect(`/dashboard/${idserver}`);
		} else {
			guilds.set(`${idserver}.role`, id_role)
			res.redirect(`/dashboard/${idserver}`);
		}
	})
	.post('/:id/prefix', auth, async (req, res) => {
		const idserver = req.params.id,
			newPrefix = req.body.newPrefix;
		if(!newPrefix || newPrefix.lenght === 0) {
			guilds.delete(`${idserver}.prefix`)
			res.redirect(`/dashboard/${idserver}`);
		} else {
			guilds.set(`${idserver}.prefix`, newPrefix)
			res.redirect(`/dashboard/${idserver}`);
		}
	}).post('/:id/logs', auth, async (req, res) => {
		const idserver = req.params.id
		const logs_ID = req.body.logs_ID;
		if(!logs_ID || logs_ID === 'no_select') {
			guilds.delete(`${idserver}.channels.logs`)
			res.redirect(`/dashboard/${idserver}`);
		} else {
			guilds.set(`${idserver}.channels.logs`, logs_ID)
			res.redirect(`/dashboard/${idserver}`);
		}
	})
	.post('/:id/lang', auth, async (req, res) => {
		const idserver = req.params.id
		const language = req.body.language;
		if(!language || language === 'no_select') {
			guilds.delete(`${idserver}.language`)
			res.redirect(`/dashboard/${idserver}`);
		} else {
			guilds.set(`${idserver}.language`, language)
			res.redirect(`/dashboard/${idserver}`);
		}
	});
	function getRank(users, datoServer) {
		const userlist = [];
		for(const key in users) {
			const usuario = datoServer.members.cache.has(key) ? datoServer.members.cache.get(key).user.username : `Salió (${key})`;
			userlist.push([usuario, users[key].lvl, users[key].xp]);
		}
	
		userlist.sort((user1, user2) => {
	
			return user2[1] - user1[1] || user2[2] - user1[2];
		});
		return userlist;
	}
module.exports = router;
