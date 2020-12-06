const db = require('quick.db');
const {generateKey} = require('../structures/functions');
module.exports.run = async (client, message) => {
    const license = generateKey();
    const premium = new db.table('premium');
        premium.set(`${message.guild.id}.license`, license)
        premium.set(`${message.guild.id}.enable`,false)
    message.channel.send("Generada! (La licencia es de 30 dias)\nNo se contaran los dias mientras no la actives, revisa tu md")
    message.author.send(license)
}
module.exports.help = {
	name: 'generatekey',
	description: '',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: [],
	ownerOnly: true,
};