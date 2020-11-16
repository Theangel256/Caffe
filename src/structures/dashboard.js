const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bodyparser = require('body-parser');
const { join } = require('path');
const { Strategy } = require('passport-discord');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
module.exports.run = (client) => {
	// Initializations
	const app = express();
	require('./database');
    passport.serializeUser((user, done) => done(null, user));
	passport.deserializeUser((obj, done) => done(null, obj));
	const scopes = ['identify', 'guilds'];
	passport.use(new Strategy({
		clientID: client.config.CLIENT_ID,
		clientSecret: client.config.CLIENT_SECRET,
		callbackURL: `${client.config.URL}/signin`,
		scope: scopes,
	}, function(accessToken, refreshToken, profile, done) {
		process.nextTick(function() {
			return done(null, profile);
		});
	}));
	// Settings
	app.set('port', process.env.PORT || 3000);
	app.set('views', join(__dirname, 'views'));
	app.engine('.hbs', exphbs({
		defaultLayout: 'main',
		layoutsDir: join(app.get('views'), 'layouts'),
		partialsDir: join(app.get('views'), 'partials'),
		extname: '.hbs'
	}));
	app.set('view engine', '.hbs');
	// Global Variables

	// Routes
	app.use('/', require('./routes/index'));
	app.use('/dashboard', require('./routes/dashboard'));
	app.use('/premium', require('./routes/premium'));
	app.use('/error404', require('./routes/error404'));
	app.get('*', function(req, res) {
			res.redirect('/error404');
		})
	// Static Files
	app.use(express.static(join(__dirname, '/public')));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(function(req, res, next) {
		req.bot = client;
		next();
	});
		//  Middelwares
		app.use(bodyparser.json());
		app.use(bodyparser.urlencoded({ extended: true }));
		app.use(methodOverride('_method'));
		app.use(session({
			secret: client.config.secret,
			resave: true,
			saveUninitialized: true
		}));
		// Server Listing
		app.listen(app.get('port'), () => { 
			console.log("Server on PORT", app.get('port'))
		});
}