const express = require("express");
const router = express.Router();
router.get("/", async (req, res) => {
  const userAvatarURL = req.isAuthenticated()
    ? (await req.bot.users.fetch(req.user.id)).displayAvatarURL({
        dynamic: true,
      })
    : null;
  res.render("404", {
    bot: req.bot,
    user: req.user,
    title: "ERROR! 404",
    textLogin: req.isAuthenticated() ? `${req.user.username}` : "Login",
    login: req.isAuthenticated() ? true : false,
    userAvatarURL,
  });
});

module.exports = router;
