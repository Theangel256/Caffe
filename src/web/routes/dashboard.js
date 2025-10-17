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
module.exports = router;
