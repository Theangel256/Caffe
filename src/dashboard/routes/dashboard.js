const express = require("express");
const router = express.Router();
const { auth } = require("../../functions");
const guildSystem = require("../../models/guilds");

router
  .get("/", auth, async (req, res) => {
    const guilds = req.user.guilds.filter((p) => (p.permissions & 8) === 8);
    const userAvatarURL = req.isAuthenticated()
      ? (await req.bot.users.fetch(req.user.id)).displayAvatarURL({
          dynamic: true,
        })
      : null;
    res.render("dashboard", {
      bot: req.bot,
      user: req.user,
      title: "Caffe - The Discord Bot",
      login: req.isAuthenticated() ? true : false,
      textLogin: req.isAuthenticated() ? req.user.username : "Login",
      guilds,
      userAvatarURL,
    });
  })
  .get("/:id", auth, async (req, res) => {
    const idserver = req.params.id;
    const guild = req.bot.guilds.cache.get(idserver);
    if (!guild)
      return res.redirect(
        `https://discord.com/oauth2/authorize?client_id=${req.bot.user.id}&scope=bot&permissions=8&response_type=code&guild_id=${idserver}`
      );
    const userPermission = (
      await guild.members.fetch(req.user.id)
    ).permissions.has("ADMINISTRATOR");
    if (!userPermission) return res.redirect("/error404");
    const msgDocument = await guildSystem
      .findOne({
        guildID: idserver,
      })
      .catch((err) => console.log(err));
    if (!msgDocument) {
      try {
        const dbMsg = await new guildSystem({
          guildID: idserver,
          prefix: process.env.prefix,
          language: "en",
          role: false,
          kick: false,
          ban: false,
        });
        var db = await dbMsg.save();
      } catch (err) {
        console.log(err);
      }
    } else {
      db = msgDocument;
    }
    res.render("guilds", {
      title: "Caffe - Dashboard",
      login: req.isAuthenticated() ? true : false,
      textLogin: req.isAuthenticated() ? req.user.username : "Login",
      user: req.user,
      guild,
      guildSystem,
      db,
      bans: guild.me.permissions.has("BAN_MEMBERS")
        ? await guild.bans.fetch().then((x) => x.size)
        : false,
      bot: req.bot,
    });
  })
  .post("/:id/prefix", auth, async (req, res) => {
    const idserver = req.params.id,
      newPrefix = req.body.newPrefix;
    if (newPrefix || newPrefix.lenght !== 0) {
      await guildSystem.updateOne({ prefix: newPrefix });
      res.redirect(`/dashboard/${idserver}`);
    }
  })
  .post("/:id/lang", auth, async (req, res) => {
    const idserver = req.params.id;
    const lang = req.body.language;
    if (lang || lang !== "no_select") {
      await guildSystem.updateOne({ language: lang });
      res.redirect(`/dashboard/${idserver}`);
    }
  })
  .post("/:id/welcome", auth, async (req, res) => {
    const idserver = req.params.id;
    const id_channel = req.body.channel_ID;
    const msgDocument = await guildSystem
      .findOne({
        guildID: idserver,
      })
      .catch((err) => console.log(err));
    const { channelWelcome } = msgDocument;
    if (!id_channel || id_channel === "no_select") {
      await guildSystem.deleteOne({ channelWelcome: channelWelcome });
      res.redirect(`/dashboard/${idserver}`);
    } else {
      await guildSystem.updateOne({ channelWelcome: id_channel });
      res.redirect(`/dashboard/${idserver}`);
    }
  })
  .post("/:id/goodbye", auth, async (req, res) => {
    const idserver = req.params.id;
    const id_channel = req.body.channelID;
    const msgDocument = await guildSystem
      .findOne({
        guildID: idserver,
      })
      .catch((err) => console.log(err));
    const { channelGoodbye } = msgDocument;
    if (!id_channel || id_channel === "no_select") {
      await guildSystem.deleteOne({ channelGoodbye: channelGoodbye });
      res.redirect(`/dashboard/${idserver}`);
    } else {
      await guildSystem.updateOne({ channelGoodbye: id_channel });
      res.redirect(`/dashboard/${idserver}`);
    }
  })
  .post("/:id/logs", auth, async (req, res) => {
    const idserver = req.params.id;
    const logs_ID = req.body.logs_ID;
    const msgDocument = await guildSystem
      .findOne({
        guildID: idserver,
      })
      .catch((err) => console.log(err));
    const { channelLogs } = msgDocument;
    if (!logs_ID || logs_ID === "no_select") {
      await guildSystem.deleteOne({ channelLogs: channelLogs });
      res.redirect(`/dashboard/${idserver}`);
    } else {
      await guildSystem.updateOne({ channelLogs: logs_ID });
      res.redirect(`/dashboard/${idserver}`);
    }
  })
  .post("/:id/rolauto", auth, async (req, res) => {
    const idserver = req.params.id;
    const id_role = req.body.rol_ID;
    const msgDocument = await guildSystem
      .findOne({
        guildID: idserver,
      })
      .catch((err) => console.log(err));
    const { rolauto } = msgDocument;
    if (!id_role || id_role === "no_select") {
      await guildSystem.deleteOne({ rolauto: rolauto });
      res.redirect(`/dashboard/${idserver}`);
    } else {
      await guildSystem.updateOne({ rolauto: id_role });
      res.redirect(`/dashboard/${idserver}`);
    }
  });
module.exports = router;
