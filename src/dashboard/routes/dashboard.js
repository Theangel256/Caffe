const express = require('express');
const router = express.Router();
const { auth } = require('../../structures/functions');

router.get('/', auth, async (req, res) => {
	const guilds = req.user.guilds.filter(p => (p.permissions & 8) === 8);
	const userAvatarURL = (req.isAuthenticated() ? (await req.bot.users.fetch(req.user.id)).displayAvatarURL({ format: 'jpg', dynamic: true }) : null);
	res.render('dashboard.ejs', {
		user: req.user,
		bot: req.bot,
		title: 'Caffe - The Discord Bot',
		login : (req.isAuthenticated() ? 'si' : 'no'),
		textLogin: (req.isAuthenticated() ? req.user.username : 'Login'),
		guilds,
		userAvatarURL,
	});
});
/*
const db = require('quick.db');
const guildsDB = new db.table('guilds');
.get('/:id', auth, async (req, res) => {
		const idserver = req.params.id
		const guild = req.bot.guilds.cache.get(idserver);
		if(!guild) return res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.bot.user.id}`&scope=bot&permissions=8&response_type=code&guild_id=${idserver}`);
		const userPermission = (await guild.members.fetch(req.user.id)).hasPermission('ADMINISTRATOR');
		if(!userPermission) return res.redirect('/error404');
		res.render('guilds.ejs', {
			title: "Caffe - Dashboard Bot",
			login : (req.isAuthenticated() ? 'si' : 'no'),
			textLogin: (req.isAuthenticated() ? req.user.username : 'Login'),
			user: req.user,
			guild,
			guildsDB,
			bans: guild.me.hasPermission('BAN_MEMBERS') ? await guild.fetchBans().then(x => x.size) : false,
			bot: req.bot
		});
	})
	.post('/:id/welcome', auth, (req, res) => {
		const idserver = req.params.id,
			id_channel = req.body.channel_ID;
		if(!id_channel || id_channel === 'no_select') {
			guildsDB.delete(`${idserver}.channels.welcome`)
			res.redirect(`/dashboard/${idserver}`);
		} else {
			guildsDB.set(`${idserver}.channels.welcome`, id_channel)
			res.redirect(`/dashboard/${idserver}`);
		}
	})
	.post('/:id/goodbye', auth, (req, res) => {
		const idserver = req.params.id;
		const id_channel = req.body.channelID;
		if(!id_channel || id_channel === 'no_select') {
			guildsDB.delete(`${idserver}.channels.goodbye`)
			res.redirect(`/dashboard/${idserver}`);
		} else {
			guildsDB.set(`${idserver}.channels.goodbye`, id_channel)
			res.redirect(`/dashboard/${idserver}`);
		}
	})
	.post('/:id/rolauto', auth, async (req, res) => {
		const idserver = req.params.id,
			id_role = req.body.rol_ID;
		if(!id_role || id_role === 'no_select') {
			guildsDB.delete(`${idserver}.role`)
			res.redirect(`/dashboard/${idserver}`);
		} else {
			guildsDB.set(`${idserver}.role`, id_role)
			res.redirect(`/dashboard/${idserver}`);
		}
	})
	.post('/:id/prefix', auth, async (req, res) => {
		const idserver = req.params.id,
			newPrefix = req.body.newPrefix;
		if(!newPrefix || newPrefix.lenght === 0) {
			guildsDB.delete(`${idserver}.prefix`)
			res.redirect(`/dashboard/${idserver}`);
		} else {
			guildsDB.set(`${idserver}.prefix`, newPrefix)
			res.redirect(`/dashboard/${idserver}`);
		}
	}).post('/:id/logs', auth, async (req, res) => {
		const idserver = req.params.id
		const logs_ID = req.body.logs_ID;
		if(!logs_ID || logs_ID === 'no_select') {
			guildsDB.delete(`${idserver}.channels.logs`)
			res.redirect(`/dashboard/${idserver}`);
		} else {
			guildsDB.set(`${idserver}.channels.logs`, logs_ID)
			res.redirect(`/dashboard/${idserver}`);
		}
	})
	.post('/:id/lang', auth, async (req, res) => {
		const idserver = req.params.id
		const language = req.body.language;
		if(!language || language === 'no_select') {
			guildsDB.delete(`${idserver}.language`)
			res.redirect(`/dashboard/${idserver}`);
		} else {
			guildsDB.set(`${idserver}.language`, language)
			res.redirect(`/dashboard/${idserver}`);
		}
	});
	*/
module.exports = router;
