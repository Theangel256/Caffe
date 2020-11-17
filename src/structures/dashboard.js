const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
const { join } = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
module.exports.run = (client) => {
	require('./passport')
	app.use(express.json())
	.use(express.urlencoded({ extended: true }))
	.use(methodOverride('_method'))
	.engine(".hbs", exphbs({
		defaultLayout: "main",
		layoutsDir: join(app.get("views"), "layouts"),
		partialsDir: join(app.get("views"), "partials"),
		extname: ".hbs",
	}))
	.use(express.static(join(__dirname, "public")))
	.set('view engine', '.hbs')
	.set('views', join(__dirname, 'views'))
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
	app.use(require('./routes/index'));
	app.use(require('./routes/dashboard'));
	app.use(require('./routes/premium'));
	app.use(require('./routes/error'));
	app.get('*', function(req, res) {
			res.redirect('/error404');
		});
	app.listen(app.get('port'), () => { 
		console.log("Server on PORT", app.get('port'))
	});
}