const express = require('express');
const router = express.Router();
const levels = require("../../structures/models/levels");
router.get('/:id', async (req, res) => {
	const idserver = req.params.id;
	const guild = req.bot.guilds.cache.get(idserver);
	if(!guild) return res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${req.bot.user.id}&permissions=8&scope=bot&response_type=code&guild_id=${idserver}`);
	const userAvatarURL = (req.isAuthenticated() ? (await req.bot.users.fetch(req.user.id)).displayAvatarURL({ format: 'png', dynamic: true }) : null);
	res.render('leaderboard.ejs', {
		bot: req.bot,
		user: req.user,
		title: "Caffe - The Discord Bot!",
		textLogin: (req.isAuthenticated() ? `${req.user.username}` : 'Login'),
		login: (req.isAuthenticated() ? 'si' : 'no'),
		userAvatarURL,
		guild,
		usuarios: getRank(await levels.find()),
	});
});
function getRank(users) {
	const userlist = [];
	for(const key of users) {
		userlist.push([key.userID, key.lvl, key.xp]);
	}

	userlist.sort((user1, user2) => {
		return user2[1] - user1[1] || user2[2] - user1[2];
	});
	return userlist;
}

module.exports = router;