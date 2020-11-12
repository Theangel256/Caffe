const express = require('express'),
	config = require('../../config.js'),
	router = express.Router();
router.get('/', function(req, res) {
	res.render('premium.ejs', {
		textLogin: (req.isAuthenticated() ? `${req.user.username}` : 'Login'),
		client: req.bot,
		user: req.user,
		login: (req.isAuthenticated() ? 'si' : 'no'),
		invite: `https://discordapp.com/oauth2/authorize?client_id=${config.CLIENT_ID}&permissions=0&scope=bot`,
	});
});

module.exports = router;