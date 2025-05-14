const express = require('express');
const app = express();
const session = require('express-session');
const { join } = require('path');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const passport = require('passport');
const { rateLimit } = require('express-rate-limit');
const { Strategy } = require('passport-discord');
module.exports.run = (client) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((obj, done) => {
        done(null, obj);
    })
    passport.use(new Strategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: `${process.env.URL}/signin`,
        scope: ['identify','guilds'],
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            return done(null, profile);
        });
    }));
const limiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 300,
    message: "There are too many requests for your IP. Please try again later."
    });
    app
    .use(express.json())
    .use(limiter)
    .use(express.urlencoded({ extended: true }))
    .use(methodOverride('_method'))
    .set('views', join(__dirname, '..', 'web/views'))
    .use(express.static(join(__dirname, '..', 'web/public')))
    .set('view engine', 'ejs')
    .set('port', process.env.PORT || 3000)
    .set('trust proxy', 1)
    .use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días en ms
            sameSite: 'lax',
            path: '/',
            domain: new URL(process.env.URL).hostname,
        },
        store: MongoStore.create({ 
            mongoUrl: process.env.MONGO_URI,
            autoRemove: 'interval',
            autoRemoveInterval: 10, //In Minutes.
        }), 
    }));
    app.use(passport.initialize())
    .use(passport.session())
    .use((err, req, res, next) => {
        console.error("Passport.JS Error: " + err.stack);
        res.status(500).render('error', { message: 'Ocurrió un error interno.' });
      })
    .use(function (req, res, next) {
        if(!req.session) {
            return next(new Error('Oh no')) //handle error
        }
        req.bot = client;
        next();
    })
    .use('/', require('../web/routes/index'))
    .use('/dashboard', require('../web/routes/dashboard'))
    .use('/leaderboard', require('../web/routes/leaderboard'))
    .use('/error404', require('../web/routes/error'))
    .get('*', function (req, res) {
        res.redirect('/error404');
    })
    .listen(app.get('port'), () => console.log('👂 Listening on port ' + app.get('port')));
}