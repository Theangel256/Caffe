const express = require('express');
const router = express.Router();
const passport = require('passport');
const { execSync } = require("child_process");
router.get('/', (req, res) => {
	res.render('index', {
		title: "Caffe - The Discord Bot",
		textLogin: (req.isAuthenticated() ? req.user.username : 'Login'),
		reqlogin: (req.isAuthenticated() ? true : false) ? '/dashboard' : '/signin',
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
// eslint-disable-next-line no-unused-vars
.post('/github', (req, res) => {
		console.log(req.headers);
		if(req.method === "POST") {
			if(req.headers["x-github-event"] === "push") {
				try {
					console.log(execSync("cd /home/Caffe && git pull && pm2 restart default").toString());
				} catch (e) {
					console.error(e);
				}
			}
		}
		res.sendStatus(204)
})
module.exports = router;