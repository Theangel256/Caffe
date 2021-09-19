const express = require("express");
const app = express();
const session = require("cookie-session");
const { join } = require("path");
const methodOverride = require("method-override");
const passport = require("passport");
const RateLimit = require("express-rate-limit");
const { Strategy } = require("passport-discord");
module.exports.run = (client) => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });
  passport.use(
    new Strategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: `${process.env.URL}/signin`,
        scope: ["identify", "guilds"],
      },
      function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
          return done(null, profile);
        });
      }
    )
  );
  const limiter = new RateLimit({
    windowMs: 2 * 60 * 1000,
    max: 100,
    message:
      "Hay demasiadas peticiones desde su IP. Por favor inténtelo más tarde.",
  });
  app
    .use(express.json())
    .use(limiter)
    .use(express.urlencoded({ extended: true }))
    .use(methodOverride("_method"))
    .set("views", join(__dirname, ".", "dashboard/views"))
    .use(express.static(join(__dirname, ".", "dashboard/public")))
    .set("view engine", "ejs")
    .set("port", process.env.PORT || 3000)
    .set("trust proxy", 1)
    .use(
      session({
        keys: ['key1', 'key2'],
        cookie: {
          secure: true,
          maxAge: null,
          domain: process.env.URL.substr(8),
        },
      })
    )
    .use(passport.initialize())
    .use(passport.session())
    .use(function (req, res, next) {
      if (!req.session) {
        return next(new Error("Oh no")); //handle error
      }
      req.bot = client;
      next();
    });
  app.use("/", require("./dashboard/routes/index"));
  app.use("/dashboard", require("./dashboard/routes/dashboard"));
  app.use("/leaderboard", require("./dashboard/routes/leaderboard"));
  app.use("/error404", require("./dashboard/routes/error"));
  app.get("*", function (req, res) {
    res.redirect("/error404");
  });
  app.listen(app.get("port"), () => {
    console.log("PORT", app.get("port"));
  });
};
