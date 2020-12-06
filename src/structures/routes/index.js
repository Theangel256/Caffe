const express = require('express');
const router = express.Router();
const passport = require('passport');
const { execSync } = require("child_process");
router.get('/', async (req, res) => {
	const userAvatarURL = (req.isAuthenticated() ? (await req.bot.users.fetch(req.user.id)).displayAvatarURL({ format: 'png', dynamic: true}) : null) 
	res.render('index.ejs', {
		user: req.user,
		bot: req.bot,
		title: "Caffe - The Discord Bot",
		login : (req.isAuthenticated() ? 'si' : 'no'),
		textLogin: (req.isAuthenticated() ? req.user.username : 'Login'),
		userAvatarURL
	});
})
.get('/signin', passport.authenticate('discord', { failureRedirect: '/' }), (req, res) => {
		res.redirect('/dashboard');
	})
.get('/logout', async (req, res) => {
		await req.logout();
		res.redirect('/');
	})
.post('/github', (req, res) => {
		if(req.method === "POST") {
			if(req.headers["x-github-event"] === "push") {
				res.sendStatus(204)
				try {
					console.log("Actualizacion Encontrada.. Reiniciando")
					console.log(execSync("cd /home/Caffe && git pull && pm2 restart src/index.js").toString());
				} catch (e) {
					console.error(e);
				}
			}
		}
});
module.exports = router;