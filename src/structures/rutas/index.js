const express = require('express'),
	router = express.Router(),
	passport = require('passport');
router.get('/', async function(req, res) {
	res.render('index.ejs', {
		login : (req.isAuthenticated() ? 'si' : 'no'),
		textLogin: (req.isAuthenticated() ? req.user.username : 'Login'),
		user: req.user,
		client: req.bot,
	});
})
.get('/api/login', passport.authenticate('discord', { failureRedirect: '/' }), function(req, res) {
		res.redirect('/dashboard');
	})
	.get('/api/logout', async function(req, res) {
		await req.logout();
		res.redirect('/');
	})
module.exports = router;