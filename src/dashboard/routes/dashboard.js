const express = require('express');
const router = express.Router();
const { auth } = require('../../structures/functions');
const guildSystem = require('../../structures/models/guilds');

router.get('/', auth, async (req, res) => {
	const guilds = req.user.guilds.filter(p => (p.permissions & 8) === 8);
	const userAvatarURL = (req.isAuthenticated() ? (await req.bot.users.fetch(req.user.id)).displayAvatarURL({ format: 'jpg', dynamic: true }) : null);
	res.render('dashboard.ejs', {
		user: req.user,
		bot: req.bot,
		title: 'Caffe - The Discord Bot',
		login : (req.isAuthenticated() ? true : false),
		textLogin: (req.isAuthenticated() ? req.user.username : 'Login'),
		guilds,
		userAvatarURL,
	});
})
	.get('/:id', auth, async (req, res) => {
		const idserver = req.params.id;
		const guild = req.bot.guilds.cache.get(idserver);
		if(!guild) return res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.bot.user.id}&scope=bot&permissions=8&response_type=code&guild_id=${idserver}`);
		const userPermission = (await guild.members.fetch(req.user.id)).hasPermission('ADMINISTRATOR');
		if(!userPermission) return res.redirect('/error404');
		const msgDocument = await guildSystem.findOne({
			guildID: idserver,
		}).catch(err => console.log(err));
		if (!msgDocument) {
			try {
				const dbMsg = await new guildSystem({ guildID: idserver, prefix: process.env.prefix, language: 'en', role: false, kick: false, ban: false });
				var db = await dbMsg.save();
			}
			catch (err) {
				console.log(err);
			}
		}
		else {
			db = msgDocument;
		}
		res.render('guilds.ejs', {
			title: 'Caffe - Dashboard Bot',
			login : (req.isAuthenticated() ? true : false),
			textLogin: (req.isAuthenticated() ? req.user.username : 'Login'),
			user: req.user,
			guild,
			guildSystem,
			db,
			bans: guild.me.hasPermission('BAN_MEMBERS') ? await guild.fetchBans().then(x => x.size) : false,
			bot: req.bot,
		});
	})
	.post('/:id/welcome', auth, async (req, res) => {
		const msgDocument = await guildSystem.findOne({
			guildID: idserver,
		}).catch(err => console.log(err));
		const { channelWelcome } = msgDocument;
		const idserver = req.params.id,
			id_channel = req.body.channel_ID;
		if(!id_channel || id_channel === 'no_select') {
			guildSystem.deleteOne(channelWelcome);
			res.redirect(`/dashboard/${idserver}`);
		}
		else {
			guildSystem.updateOne({ channelWelcome: id_channel });
			res.redirect(`/dashboard/${idserver}`);
		}
	})
	.post('/:id/goodbye', auth, async (req, res) => {
		const msgDocument = await guildSystem.findOne({
			guildID: idserver,
		}).catch(err => console.log(err));
		const { channelGoodbye } = msgDocument;
		const idserver = req.params.id;
		const id_channel = req.body.channelID;
		if(!id_channel || id_channel === 'no_select') {
			guildSystem.deleteOne(channelGoodbye);
			res.redirect(`/dashboard/${idserver}`);
		}
		else {
			guildSystem.updateOne({ channelGoodbye: id_channel });
			res.redirect(`/dashboard/${idserver}`);
		}
	})
	.post('/:id/rolauto', auth, async (req, res) => {
		const msgDocument = await guildSystem.findOne({
			guildID: idserver,
		}).catch(err => console.log(err));
		const { roleid } = msgDocument;
		const idserver = req.params.id,
			id_role = req.body.rol_ID;
		if(!id_role || id_role === 'no_select') {
			guildSystem.deleteOne(roleid);
			res.redirect(`/dashboard/${idserver}`);
		}
		else {
			guildSystem.updateOne({ roleid: id_role });
			res.redirect(`/dashboard/${idserver}`);
		}
	})
	.post('/:id/prefix', auth, async (req, res) => {
		const idserver = req.params.id,
			newPrefix = req.body.newPrefix;
		if(!newPrefix || newPrefix.lenght === 0) {
			guildSystem.updateOne({ prefix: '$' });
			res.redirect(`/dashboard/${idserver}`);
		}
		else {
			guildSystem.updateOne({ prefix: newPrefix });
			res.redirect(`/dashboard/${idserver}`);
		}
	}).post('/:id/logs', auth, async (req, res) => {
		const msgDocument = await guildSystem.findOne({
			guildID: idserver,
		}).catch(err => console.log(err));
		const { channelLogs } = msgDocument;
		const idserver = req.params.id;
		const logs_ID = req.body.logs_ID;
		if(!logs_ID || logs_ID === 'no_select') {
			guildSystem.deleteOne(channelLogs);
			res.redirect(`/dashboard/${idserver}`);
		}
		else {
			guildSystem.updateOne({ channelLogs: logs_ID });
			res.redirect(`/dashboard/${idserver}`);
		}
	})
	.post('/:id/lang', auth, async (req, res) => {
		const idserver = req.params.id;
		const msgDocument = await guildSystem.findOne({
			guildID: idserver,
		}).catch(err => console.log(err));
		const { language } = msgDocument;
		const lang = req.body.language;
		if(!lang || lang === 'no_select') {
			guildSystem.deleteOne(lang);
			res.redirect(`/dashboard/${idserver}`);
		}
		else {
			guildSystem.updateOne({ language: language });
			res.redirect(`/dashboard/${idserver}`);
		}
	});
module.exports = router;
