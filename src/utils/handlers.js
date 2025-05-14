const { readdirSync } = require('fs');
const { join } = require('path');
const cmdPath = join(__dirname, '..', 'commands');
module.exports.run = (client) => {
    for (const command of readdirSync(cmdPath).filter((x) => x.endsWith('.js'))) {
        const prop = require(`${cmdPath}/${command}`);
        client.commands.set(prop.help.name, prop);
        if (prop.help.aliases) {
            for (const alias of prop.help.aliases) {
                client.aliases.set(alias, prop);
            }
        }
    }
    const eventPath = join(__dirname, '..', 'events');
    const eventFiles = readdirSync(eventPath);
    for (const event of eventFiles) {
        const prop = require(`${eventPath}/${event}`);
        const eventName = event.split('.').shift();
        client.on(eventName, prop.bind(null, client));
    }
}