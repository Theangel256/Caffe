const express = require('express');
const router = express.Router();
router.get('/', async (req, res) => {
	const userAvatarURL = (req.isAuthenticated() ? (await req.bot.users.fetch(req.user.id)).displayAvatarURL({ format: 'png', dynamic: true}) : null) 
	res.render('premium.ejs', {
		bot: req.bot,
		user: req.user,
		title: "Caffe - The Premium Bot!",
		textLogin: (req.isAuthenticated() ? `${req.user.username}` : 'Login'),
		login: (req.isAuthenticated() ? 'si' : 'no'),
		userAvatarURL
	});
});
module.exports = router;