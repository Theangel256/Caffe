const express = require('express');
const router = express.Router();
const passport = require('passport');
router.get('/', (req, res) => {
	res.render('index', {
		title: "Caffe - The Discord Bot",
		login: (req.isAuthenticated() ? true : false),
		textLogin: (req.isAuthenticated() ? req.user.username : 'Login'),
		clientAvatarURL: req.bot.user.displayAvatarURL({format: "jpg"}),
	});
})
.get('/signin', passport.authenticate('discord', { failureRedirect: '/' }), (req, res) => {
		res.redirect('/dashboard');
	})
.get('/logout', async (req, res) => {
		await req.logout();
		res.redirect('/');
	})
module.exports = router;