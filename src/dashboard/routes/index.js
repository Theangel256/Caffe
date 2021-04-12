const express = require('express');
const router = express.Router();
const passport = require('passport');
// const { execSync } = require("child_process");
router.get('/', async (req, res) => {
	const userAvatarURL = (req.isAuthenticated() ? (await req.bot.users.fetch(req.user.id)).displayAvatarURL({ dynamic: true }) : null);
	const botAvatarURL = req.bot.user.displayAvatarURL({ format: 'png', dynamic: true });
	res.render('index.ejs', {
		user: req.user,
		bot: req.bot,
		title: 'Caffe - The Discord Bot',
		login : (req.isAuthenticated() ? 'si' : 'no'),
		textLogin: (req.isAuthenticated() ? req.user.username : 'Login'),
		userAvatarURL,
		botAvatarURL,
	});
})
	.get('/signin', passport.authenticate('discord', { failureRedirect: '/' }), (req, res) => {
		res.redirect('/dashboard');
	})
	.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	})
	.get('/discord', (req, res) => {
		res.redirect('https://discord.gg/65Bf73867r');
	})
	.get('/add', (req, res) => {
		res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.bot.user.id}&scope=bot&permissions=8&response_type=code`);
	});
/*
.post('/github', (req, res) => {
		if(req.method === "POST") {
			if(req.headers["x-github-event"] === "push") {
				try {
					console.log("Actualizacion Encontrada.. Reiniciando");
					res.sendStatus(204)
					console.log(execSync("cd /home/Caffe && git pull && pm2 restart default").toString());
				} catch (e) {
					console.error(e);
				}
			}
		}
});
*/
module.exports = router;