module.exports.run = async (client, message) => {
    const license = client.functions.generateKey();
    const premium = new client.database('premium')
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