const express = require('express');
const router = express.Router();
const passport = require('passport');
const { execSync } = require("child_process");
router.get('/', async (req, res) => {
	res.render('index', {
		title: "Caffe - The Discord Bot",
		textLogin: (req.isAuthenticated() ? req.user.username : 'Login'),
		signin: (req.isAuthenticated() ? true : false),
		reqlogin: (req.isAuthenticated() ? true : false) ? '/dashboard' : '/signin',
		clientAvatarURL: req.bot.user.displayAvatarURL({format: "jpg"}),
		client: req.bot,
		userAvatarURL: (req.isAuthenticated() ? true : false) ? (await req.bot.users.fetch(req.user.id)).displayAvatarURL({ format: 'jpg' }) : null,
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
		if(req.method === "POST") {
			if(req.headers["x-github-event"] === "push") {
				res.sendStatus(204)
				try {
					console.log("Actualizacion Encontrada")
					console.log(execSync("cd /home/pruebas/Caffe && git pull && pm2 restart default").toString());
				} catch (e) {
					console.error(e);
				}
			}
		}
})
module.exports = router;