const warns = require("../structures/models/warns");
module.exports = async (client) => {
  setInterval(async function () {
    const allData = await warns.find();
    allData.map(async (a) => {
      if (a.time < Date.now()) {
        const member = client.guilds.resolve(a.guildID).member(a.userID);
        member.roles.remove(a.rolID);
        await warns.deleteOne({ userID: a.userID });
      }
    });
  }, 15000);
  const statues = [
    `$help | ${(await client.shard.fetchClientValues("users.cache.size"))
      .reduce((acc, guildCount) => acc + guildCount, 0)
      .toLocaleString()} users!`,
    "Theangel256 Studios V" + require("../../package.json").version,
    "caffe-bot.herokuapp.com/discord",
    "caffe-bot.herokuapp.com/add",
  ];
  setInterval(function () {
    const status = statues[Math.ceil(Math.random() * (statues.length - 1))];
    client.user.setPresence({ activity: { name: status }, status: "online" });
  }, 20000);
};
