const express = require('express'),
	router = express.Router(),
	database = require('../Managers/DatabaseManager'),
	opciones = new database('opciones'),
	config = require('../../config.js'),
	lvl = new database('niveles'),
	{ auth } = require('../functions.js');
router.get('/', auth, async function(req, res) {
	const guilds = req.user.guilds.filter(p => (p.permissions & 8) === 8);

	res.render('dashboard.ejs', {
		login : (req.isAuthenticated() ? 'si' : 'no'),
		textLogin: (req.isAuthenticated() ? req.user.username : 'Login'),
		guilds,
		user: req.user,
		client: req.bot,
	});
})
	.get('/:id', auth, async function(req, res) {
		const idserver = req.params.id,
			guild = req.bot.guilds.cache.get(idserver);
		if(!guild) {return res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${config.CLIENT_ID}&permissions=8&scope=bot&response_type=code&guild_id=${idserver}`);}
		const userPermission = guild.members.cache.get(req.user.id).hasPermission('ADMINISTRATOR');
		if(!userPermission) return res.redirect('/error404');
		if(!lvl.has(guild.id)) lvl.set(guild.id, {});

		res.render('server.ejs', {
			login : (req.isAuthenticated() ? 'si' : 'no'),
			textLogin: (req.isAuthenticated() ? req.user.username : 'Login'),
			user: req.user,
			guild,
			opciones: new req.bot.database('opciones'),
			prefix: opciones.has(`${guild.id}.prefix`) ? await opciones.get(`${guild.id}.prefix`) : config.prefix,
			bans: guild.me.hasPermission('BAN_MEMBERS') ? await guild.fetchBans().then(x => x.size) : false,
			client: req.bot,
			usuarios: getRank(await lvl.get(idserver), guild),
		});
	})
	.post('/:id/welcome', auth, async (req, res) => {
		const idserver = req.params.id,
			id_channel = req.body.channel_ID;
		if(!id_channel || id_channel === 'no_select') {
			await opciones.delete(`${idserver}.channels.welcome`);
			await res.redirect(`/dashboard/${idserver}`);
		}
		else {
			await opciones.set(`${idserver}.channels.welcome`, id_channel);
			await res.redirect(`/dashboard/${idserver}`);
		}
	})
	.post('/:id/goodbye', auth, async (req, res) => {
		const idserver = req.params.id,
			id_channel = req.body.channelID;
		if(!id_channel || id_channel === 'no_select') {
			await opciones.delete(`${idserver}.channels.goodbye`);
			await res.redirect(`/dashboard/${idserver}`);
		}
		else {
			await opciones.set(`${idserver}.channels.goodbye`, id_channel);
			await res.redirect(`/dashboard/${idserver}`);
		}
	})
	.post('/:id/rolauto', auth, async (req, res) => {
		const idserver = req.params.id,
			id_role = req.body.rol_ID;
		if(!id_role || id_role === 'no_select') {
			await opciones.delete(`${idserver}.role`);
			await res.redirect(`/dashboard/${idserver}`);
		}
		else {
			await opciones.set(`${idserver}.role`, id_role);
			return await res.redirect(`/dashboard/${idserver}`);
		}
	})
	.post('/:id/prefix', auth, async (req, res) => {
		const idserver = req.params.id,
			newPrefix = req.body.newPrefix;
		if(!newPrefix || newPrefix.lenght === 0) {
			await opciones.delete(`${idserver}.prefix`);
			await res.redirect(`/dashboard/${idserver}`);
		}
		else {
			await opciones.set(`${idserver}.prefix`, newPrefix);
			await res.redirect(`/dashboard/${idserver}`);
		}
	}).post('/:id/logs', auth, async (req, res) => {
		const idserver = req.params.id,
			logs_ID = req.body.logs_ID;
		if(!logs_ID || logs_ID === 'no_select') {
			await opciones.delete(`${idserver}.channels.logs`);
			await res.redirect(`/dashboard/${idserver}`);
		}
		else {
			await opciones.set(`${idserver}.channels.logs`, logs_ID);
			await res.redirect(`/dashboard/${idserver}`);
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