import {PermissionsBitField, version} from "discord.js";
import { readdirSync } from "fs";
import { join } from 'path';
import { fileURLToPath } from 'url';
import moment from "moment";
import "moment-duration-format";
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '../..');
const filePath = join(__dirname, "events");
const eventFiles = readdirSync(filePath);
export async function run(client, message) {
  const actividad = moment
      .duration(client.uptime)
      .format(" D [d], H [hrs], m [m], s [s]"),
    servers = (await client.shard.fetchClientValues("guilds.cache.size")).reduce((acc, guildCount) => acc + guildCount, 0),
    lang = client.lang.commands.stats,
    users = (await client.shard.fetchClientValues("users.cache.size")).reduce((acc, guildCount) => acc + guildCount,0),
    canales = (await client.shard.fetchClientValues("channels.cache.size")).reduce((acc, guildCount) => acc + guildCount, 0),
    voz = client.voice.connections.size,
    emojis = (await client.shard.fetchClientValues("emojis.cache.size")).reduce(
      (acc, guildCount) => acc + guildCount,
      0
    ),
    modulos = require("../../package.json"),
    cpu = `${Math.round(process.cpuUsage().user / 1024 / 1024)}%`,
    memory = `${Math.round(
      (process.memoryUsage().heapUsed / 1024 / 1024).toString().slice(0, 6)
    )} MB`,
    invite = await client.generateInvite({ permissions: ["ADMINISTRATOR"] }),
    main = new EmbedBuilder()
      .setAuthor(
        client.user.username,
        client.user.displayAvatarURL({ extension: "webp"})
      )
      .setColor(0x00ffff)
      .setTimestamp()
      .addFields({
        name: "⁉️ " + lang.statistics,
        value: `>>> **Theangel256 Studios** ${lang.owner}
        \n**${servers.toLocaleString()}** ${lang.guilds}
        \n**${users.toLocaleString()}** ${lang.users}
        \n**${canales.toLocaleString()}** ${lang.channels}
        \n**${emojis.toLocaleString()}** Emojis
        \n**${client.commands.size.toLocaleString()}** ${lang.commands}
        \n**${eventFiles.length.toLocaleString()}** ${lang.events}
        \n**${actividad}** ${lang.uptime}
        \n**${Math.round(message.client.ws.ping)}ms** Ping
        \n**${voz}** ${lang.connections.toLocaleString()}
        \n**${modulos.version}** ${lang.version}
        \n**${version}** Discord.JS\n**${client.prefix}** Prefix
        \n**${memory}** ${lang.usage}
        \n**${cpu}** CPU\n**${modulos.engines.node}** Node`,
        inline: true, },
        { name: "❔ LINKS",
        value: `>>> [Invite](${invite})
        \n[Discord](${process.env.PUBLIC_URL}/discord)
        \n[Twitter](https://twitter.com/Theangel256)
        \n[MySpawn](https://www.spigotmc.org/resources/myspawn.64762/)`,
        inline: true })
      .setFooter({
        text: client.lang.events.message.isMentioned.footer + modulos.version,
        iconURL: client.user.displayAvatarURL({ extension: "webp"})
});
  message.channel.send(main);
};
export const help = {
  name: "stats",
  aliases: ["botinfo", "info", "bot", "botstats"],
  description: "ve mi estadisticas para estar al tanto de mi cuidado <3",
};
export const requirements = {
  userPerms: [],
  clientPerms: [PermissionsBitField.Flags.EmbedLinks],
  ownerOnly: false,
};
