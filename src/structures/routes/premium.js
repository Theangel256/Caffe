const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
	res.render('premium', {
		title: "Caffe - The Premium Bot!",
		textLogin: (req.isAuthenticated() ? `${req.user.username}` : 'Login'),
		client: req.bot,
		user: req.user,
		invite: `https://discordapp.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=0&scope=bot`,
	});
});

module.exports = router;