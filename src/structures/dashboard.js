const express = require('express');
const session = require('express-session');
const bodyparser = require('body-parser');
const passport = require('passport');
const { join } = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
module.exports.run = (client) => {
	// Initializations
	const app = express();
	require('./passport')
	// Settings
	app.set('port', process.env.PORT || 3000);
	app.set('views', join(__dirname, '/views'));
	app.engine('.hbs', exphbs({
		defaultLayout: 'main',
		layoutsDir: join(app.get('views'), 'layouts'),
		partialsDir: join(app.get('views'), 'partials'),
		extname: '.hbs'
	}));
	app.set('view engine', '.hbs');
	// Middelwares
	app.use(bodyparser.json());
	app.use(bodyparser.urlencoded({ extended: true }));
	app.use(methodOverride('_method'));
	app.use(session({
		secret: 'caffe',
		resave: false,
		saveUninitialized: false
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	// Global Variables
	app.use(function(req, res, next) {
		res.bot = client;
		next();
	});
	// Routes
	app.use(require('./routes/index'));
	app.use(require('./routes/dashboard'));
	app.use(require('./routes/premium'));
	app.use(require('./routes/error'));
	app.get('*', function(req, res) {
			res.redirect('/error404');
		})
	// Static Files
	app.use(express.static(join(__dirname, '/public')));
	// Server Listing
	app.listen(app.get('port'), () => { 
		console.log("Server on PORT", app.get('port'))
	});
}