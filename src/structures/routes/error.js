const express = require('express');
const router = express.Router();
router.get('/', async (req, res) => {
	res.render('404.ejs', {
		title: "ERROR! 404",
		textLogin: (req.isAuthenticated() ? `${req.user.username}` : 'Login'),
		signin: (req.isAuthenticated() ? true : false),
		userAvatarURL: (await req.bot.users.fetch(req.user.id)).displayAvatarURL({ format: 'jpg' }),
		clientAvatarURL: req.bot.user.displayAvatarURL({format: "jpg"}),
		invite: `https://discordapp.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=0&scope=bot`,
	});
});

module.exports = router;