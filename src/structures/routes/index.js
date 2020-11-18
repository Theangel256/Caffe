const express = require('express');
const router = express.Router();
const passport = require('passport');
const { execSync } = require("child_process");
router.get('/', async (req, res) => {
	res.render('index.ejs', {
		title: "Caffe - The Discord Bot",
		login : (req.isAuthenticated() ? 'si' : 'no'),
		textLogin: (req.isAuthenticated() ? req.user.username : 'Login'),
		user: req.user,
		client: req.bot,
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