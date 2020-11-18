require('dotenv').config()
const Discord = require('discord.js');
const client = new Discord.Client();
const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const { join } = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
	client.functions = require('./structures/functions.js');
	client.database = require('./structures/DatabaseManager');
	client.commands = new Discord.Collection();
	client.aliases = new Discord.Collection();
	client.limits = new Map();
	client.queue = new Map();
	client.snipes = new Map();
	client.Discord = Discord;
	require('./structures/command').run(client);
	require('./structures/event').run(client);
	require('./structures/passport')
	app.use(express.json())
	.use(express.urlencoded({ extended: true }))
	.use(methodOverride('_method'))
	.set('views', join(__dirname, 'views'))
	.engine(".hbs", exphbs({
		defaultLayout: "main",
		layoutsDir: join(app.get("views"), "layouts"),
		partialsDir: join(app.get("views"), "partials"),
		extname: ".hbs",
	}))
	.use(express.static(join(__dirname, "public")))
	.set('view engine', '.hbs')
	.set('port', process.env.PORT || 3000)
	.use(session({
		secret: 'caffe',
		resave: false,
		saveUninitialized: false
	}))
	.use(passport.initialize())
	.use(passport.session())
	.use(function(req, res, next) {
		req.bot = client;
		next();
	});
	app.use("/", require('./structures/routes/index'));
	app.use("/dashboard", require('./structures/routes/dashboard'));
	app.use("/premium", require('./structures/routes/premium'));
	app.use("/error404", require('./structures/routes/error'));
	app.get('*', function(req, res) {
			res.redirect('/error404');
		});
	app.listen(app.get('port'), () => { 
		console.log("Server on PORT", app.get('port'))
	});
	client.login(process.env.TOKEN).then(() => console.log(`Estoy listo, soy ${client.user.tag}`))
	.catch((err) => console.error('Error al iniciar sesión: ' + err));
	process.on("unhandledRejection", (r) => {
		console.dir(r);
	});