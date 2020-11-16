const express = require('express');
const router = express.Router();
const passport = require('passport');
router.get('/', (req, res) => {
	res.render('index', {
		login : (req.isAuthenticated() ? 'si' : 'no'),
		textLogin: (req.isAuthenticated() ? req.user.username : 'Login'),
		user: req.user,
		client: req.bot,
	});
})
.get('/about', (req, res) => {
 res.render('about.hbs')
})
.get('/signin', passport.authenticate('discord', { failureRedirect: '/' }), function(req, res) {
		res.redirect('/dashboard');
	})
.get('/logout', async (req, res) => {
		await req.logout();
		res.redirect('/');
	})
module.exports = router;