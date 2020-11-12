const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const bodyparser = require('body-parser');
const { join } = require('path');
const { Strategy } = require('passport-discord');
module.exports.run = (client) => {
    passport.serializeUser((user, done) => done(null, user));
	passport.deserializeUser((obj, done) => done(null, obj));
	const scopes = ['identify', 'guilds'];
	passport.use(new Strategy({
		clientID: client.config.CLIENT_ID,
		clientSecret: client.config.CLIENT_SECRET,
		callbackURL: `${client.config.URL}/api/login`,
		scope: scopes,
	}, function(accessToken, refreshToken, profile, done) {
		process.nextTick(function() {
			return done(null, profile);
		});
	}));
	app.use(bodyparser.json())
		.use(bodyparser.urlencoded({ extended: true }))
		.engine('html', require('ejs').renderFile)
		.use(express.static(join(__dirname, '/public')))
		.set('view engine', 'ejs').set('views', join(__dirname, 'views'))
		.set('port', client.config.PORT || 3000)
		.use(session({ secret: 'caffe', resave: false, saveUninitialized: false }))
		.use(passport.initialize())
		.use(passport.session())
		.use(function(req, res, next) {
			req.bot = client;
			next();
		})
		.use('/', require('./structures/rutas/index'))
		.use('/dashboard', require('./structures/rutas/dashboard'))
		.use('/premium', require('./structures/rutas/premium'))
		.use('/error404', require('./structures/rutas/error'))
		.get('*', function(req, res) {
			res.redirect('/error404');
		}).listen(client.config.PORT || 3000);
}