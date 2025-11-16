import pkg from '../../package.json' assert { type: 'json' };
export default async function clientReady(client) {
  const statues = [
    `$help | ${(await client.shard.fetchClientValues("users.cache.size"))
      .reduce((acc, guildCount) => acc + guildCount, 0)
      .toLocaleString()} users!`,
    "Theangel256 Studios V" + pkg.version,
    `https://theangel256.dev`,
    `${process.env.PUBLIC_URL}/discord`.substring(8),
    `${process.env.PUBLIC_URL}/add`.substring(8),
    `${process.env.PUBLIC_URL}/support`.substring(8),
    `Serving ${client.guilds.cache.size.toLocaleString()} servers!`,
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
