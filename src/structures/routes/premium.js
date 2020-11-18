const express = require('express');
const router = express.Router();
router.get('/', async (req, res) => {
	res.render('premium', {
		title: "Caffe - The Premium Bot!",
		textLogin: (req.isAuthenticated() ? `${req.user.username}` : 'Login'),
		client: req.bot,
		signin: (req.isAuthenticated() ? true : false),
		userAvatarURL: (req.isAuthenticated() ? true : false) ? (await req.bot.users.fetch(req.user.id)).displayAvatarURL({ format: 'jpg' }) : null,
		user: req.user,
		invite: `https://discordapp.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=0&scope=bot`,
	});
});

module.exports = router;