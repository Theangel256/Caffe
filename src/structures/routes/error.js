const express = require('express');
const router = express.Router();
router.get('/', async (req, res) => {
	res.render('404.ejs', {
		title: "ERROR! 404",
		textLogin: (req.isAuthenticated() ? `${req.user.username}` : 'Login'),
		login: (req.isAuthenticated() ? true : false),
		bot: req.bot,
		invite: `https://discordapp.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=0&scope=bot`,
	});
});

module.exports = router;