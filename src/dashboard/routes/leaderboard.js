const express = require('express');
const router = express.Router();
const db = require('quick.db');
const levels = new db.table('levels');
router.get('/:id', async (req, res) => {
	const idserver = req.params.id
	const guild = req.bot.guilds.cache.get(idserver);
	if(!guild) return res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=8&scope=bot&response_type=code&guild_id=${idserver}`);
	const userAvatarURL = (req.isAuthenticated() ? (await req.bot.users.fetch(req.user.id)).displayAvatarURL({ format: 'png', dynamic: true}) : null) 
	res.render('leaderboard.ejs', {
		bot: req.bot,
		user: req.user,
		title: "Caffe - The Discord Bot!",
		textLogin: (req.isAuthenticated() ? `${req.user.username}` : 'Login'),
		login: (req.isAuthenticated() ? 'si' : 'no'),
		userAvatarURL,
		guild,
		usuarios: getRank(levels.fetch(idserver)),
	});
});
function getRank(users) {
	const userlist = [];
	for(const key in users) {
		userlist.push([key, users[key].lvl, users[key].xp]);
	}

	userlist.sort((user1, user2) => {

		return user2[1] - user1[1] || user2[2] - user1[2];
	});
	return userlist;
}

module.exports = router;