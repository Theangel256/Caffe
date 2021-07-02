const { readdirSync } = require("fs");
const { join } = require("path");
const cmdPath = join(__dirname, "..", "commands");
module.exports.run = (client) => {
  for (const cmd of readdirSync(cmdPath).filter((x) => x.endsWith(".js"))) {
    const prop = require(`${cmdPath}/${cmd}`);
    client.commands.set(prop.help.name, prop);

    if (prop.help.aliases) {
      for (const alias of prop.help.aliases) {
        client.aliases.set(alias, prop);
      }
    }
  }
  const eventPath = join(__dirname, "..", "events");
  const eventFiles = readdirSync(eventPath);
  for (const eventFile of eventFiles) {
    const event = require(`${eventPath}/${eventFile}`);
    const eventName = eventFile.split(".").shift();
    client.on(eventName, event.bind(null, client));
  }
  console.log(
    `Loaded ${eventFiles.length + client.commands.size} files in total`
  );
};
