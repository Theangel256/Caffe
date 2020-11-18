const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
	res.render('404', {
		title: "ERROR!",
		textLogin: (req.isAuthenticated() ? `${req.user.username}` : 'Login'),
		clientAvatarURL: req.bot.user.displayAvatarURL({format: "jpg"}),
		invite: `https://discordapp.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=0&scope=bot`,
	});
});

module.exports = router;