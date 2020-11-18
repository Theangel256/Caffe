const express = require('express');
const router = express.Router();
const passport = require('passport');
const http = require("http");
const { execSync } = require("child_process");
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
.get('/github', (req, res) => {
	http.createServer((req, res) => {
	
		console.log(req.headers);
		if(req.method === "POST") {
			if(req.headers.get["x-github-event"] === "push") {
				try {
					console.log(execSync("cd /home/Caffe && git pull && pm2 restart default").toString());
				} catch (e) {
					console.error(e);
				}
			}
		}
		res.sendStatus(204)
		res.end();
})
})
module.exports = router;