const express = require('express');
const router = express.Router();
router.get('/error404', function(req, res) {
	res.render('error404.ejs', {
		textLogin: (req.isAuthenticated() ? `${req.user.username}` : 'Login'),
		client: req.bot,
		user: req.user,
		login: (req.isAuthenticated() ? 'si' : 'no'),
		invite: `https://discordapp.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=0&scope=bot`,
	});
});

module.exports = router;