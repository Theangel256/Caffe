const express = require("express");
const session = require("express-session");
const { join } = require("path");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const passport = require("passport");
const { rateLimit } = require("express-rate-limit");
const { Strategy: DiscordStrategy } = require("passport-discord");
require("dotenv").config();

module.exports.run = async (astroApp, client) => {


  app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .set('trust proxy', 1)
    .use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URI, autoRemove: 'interval', autoRemoveInterval: 10, }), //In Minutes.
        cookie: {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días en ms
            sameSite: 'lax',
            path: '/',
            domain: new URL(process.env.PUBLIC_URL).hostname,
        },
      })
    )
    .use(passport.initialize())
    .use(passport.session());

  // Attach Express to Astro
  astroApp.use(app);

  console.log("✅ Express + Passport middleware registered in Astro");
};
