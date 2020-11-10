	const express = require('express');
	const app = express(),
		Discord = require('discord.js'),
		client = new Discord.Client({
			disableMentions: '@everyone',
			fetchAllMembers: true,
			disableEvents: ['TYPING_START'],
		}),
		session = require('express-session'),
		passport = require('passport'),
		bodyparser = require('body-parser'),
		{ join } = require('path'),
		{ Strategy } = require('passport-discord');
	client.config = require('./config.js');
	client.functions = require('./structures/functions.js')
	client.database = require('./structures/Managers/DatabaseManager');
	client.commands = new Discord.Collection();
	client.aliases = new Discord.Collection();
	client.limits = new Map();
	client.queue = new Map();
	client.snipes = new Map();
	client.Discord = Discord;
	require('./structures/command').run(client);
	require('./structures/event').run(client);
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
		.set('port', 3000)
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
		}).listen(3000);
	client.login(process.env.token)
		.then(() => console.log(`Estoy listo, soy ${client.user.tag}`))
		.catch((err) => console.error('Error al iniciar sesión: ' + err));
process.on('unhandledRejection', (reason, promise) => {
	console.log('Unhandled Rejection at:', promise, 'reason:', reason);
	// Application specific logging, throwing an error, or other logic here
  });