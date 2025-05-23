const express = require("express");
const router = express.Router();
const { auth, getOrCreateDB } = require("../../utils/functions");
const guildSystem = require("../../utils/models/guilds");
const { ChannelType, PermissionFlagsBits } = require("discord.js");

router
  .get("/", auth, async (req, res) => {
    const guilds = req.user.guilds.filter((p) => (p.permissions & 8) === 8);
    const userAvatarURL = req.isAuthenticated()
      ? (await req.bot.users.fetch(req.user.id)).displayAvatarURL({ extension: "png", })
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
    const guild = req.bot.guilds.cache.get(idserver) || await req.bot.guilds.fetch(idserver).catch(() => null);
    const DsInv = `oauth2/authorize?client_id=${req.bot.user.id}&scope=bot&permissions=8&response_type=code&guild_id=${idserver}`
    if (!guild)
      return res.redirect('https://discord.com/' + DsInv);
    const userPermission = (await guild.members.fetch(req.user.id)).permissions.has(PermissionFlagsBits.Administrator); 
    if (!userPermission) return res.redirect("/error404");
      const db = await getOrCreateDB(guildSystem, { guildID: idserver });
      if (!db) return console.error("Dashboard.js Error: I have an error while trying to access to the database, please try again later.");
      const fetchedMembers = await guild.members.fetch();
      const statuses = {
        online: 0,
        idle: 0,
        dnd: 0,
        offline: 0,
      };
      fetchedMembers.forEach(member => {
        const status = member.presence?.status;
        if (status && statuses[status] !== undefined) {
          statuses[status]++;
        }
});
    res.render("guilds", {
      title: "Caffe - Dashboard",
      login: req.isAuthenticated() ? true : false,
      textLogin: req.isAuthenticated() ? req.user.username : "Login",
      user: req.user,
      guild,
      ChannelType,
      PermissionFlagsBits,
      guildSystem,
      db,
      statusCounts: statuses,
      bans: guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)
        ? await guild.bans.fetch().then((x) => x.size)
        : false,
      bot: req.bot,
    });
  })
  .post("/:id/prefix", auth, async (req, res) => {
    const idserver = req.params.id;
    const newPrefix = req.body.newPrefix;
  
    if (newPrefix && newPrefix.length !== 0) {
      await guildSystem.updateOne({ guildID: idserver }, { $set: { prefix: newPrefix } });
    }
    res.redirect(`/dashboard/${idserver}`);
  })
  .post("/:id/lang", auth, async (req, res) => {
    const idserver = req.params.id;
    const lang = req.body.language;
    if (lang && lang !== "no_select") {
      await guildSystem.updateOne({ guildID: idserver },{ $set: { language: lang } });
      res.redirect(`/dashboard/${idserver}`);
    } else {
      res.redirect(`/dashboard/${idserver}`); // o maneja el error según tu lógica
    }
  })
  .post("/:id/welcome", auth, async (req, res) => {
    const idserver = req.params.id;
    const id_channel = req.body.channel_ID;
    await getOrCreateDB(guildSystem, { guildID: idserver });
  
    if (!id_channel || id_channel === "no_select") {
      await guildSystem.updateOne({ guildID: idserver }, { $unset: { channelWelcome: "" } });
      res.redirect(`/dashboard/${idserver}`);
    } else {
      await guildSystem.updateOne({ guildID: idserver }, { $set: { channelWelcome: id_channel } });
      res.redirect(`/dashboard/${idserver}`);
    }
  })
  .post("/:id/goodbye", auth, async (req, res) => {
    const idserver = req.params.id;
    const id_channel = req.body.channelID;
    await getOrCreateDB(guildSystem, { guildID: idserver });
  
    if (!id_channel || id_channel === "no_select") {
      await guildSystem.updateOne({ guildID: idserver }, { $unset: { channelGoodbye: "" } });
      res.redirect(`/dashboard/${idserver}`);
    } else {
      await guildSystem.updateOne({ guildID: idserver }, { $set: { channelGoodbye: id_channel } });
      res.redirect(`/dashboard/${idserver}`);
    }
  })
  .post("/:id/logs", auth, async (req, res) => {
    const idserver = req.params.id;
    const logs_ID = req.body.logs_ID;
    await getOrCreateDB(guildSystem, { guildID: idserver });
  
    if (!logs_ID || logs_ID === "no_select") {
      await guildSystem.updateOne({ guildID: idserver }, { $unset: { channelLogs: "" } });
      res.redirect(`/dashboard/${idserver}`);
    } else {
      await guildSystem.updateOne({ guildID: idserver }, { $set: { channelLogs: logs_ID } });
      res.redirect(`/dashboard/${idserver}`);
    }
  })
  .post("/:id/rolauto", auth, async (req, res) => {
    const idserver = req.params.id;
    const id_role = req.body.rol_ID;
    await getOrCreateDB(guildSystem, { guildID: idserver });
  
    if (!id_role || id_role === "no_select") {
      await guildSystem.updateOne({ guildID: idserver }, { $unset: { rolauto: "" } });
      res.redirect(`/dashboard/${idserver}`);
    } else {
      await guildSystem.updateOne({ guildID: idserver }, { $set: { rolauto: id_role } });
      res.redirect(`/dashboard/${idserver}`);
    }
  });
module.exports = router;
