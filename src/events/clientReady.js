const warns = require("../utils/models/warns");
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
    `${process.env.PUBLIC_URL}/discord"`,
    `${process.env.PUBLIC_URL}/add"`,
  ];
  setInterval(() => {
  const status = statues[Math.floor(Math.random() * statues.length)];
  client.user.setPresence({
    status: "online",
    activities: [
      {
        name: status,
        type: 0, // 0 = Playing, 1 = Streaming, 2 = Listening, etc.
      },
    ],
  });
}, 20000);
};
