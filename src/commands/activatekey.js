const keys = require('../structures/models/keys');
module.exports.run = async (client, message, args) => {
	const msgDocument = await keys.findOne({
		guildID: message.guild.id,
	}).catch(err => console.log(err));
	if (!msgDocument) {
		try {
			const dbMsg = await new keys({ guildID: message.guild.id, enable: false, license: '', time: 0 });
			var dbMsgModel = await dbMsg.save();
		} catch (err) { console.log(err); }
	} else {
		dbMsgModel = msgDocument;
	}
	if(!args[0]) return message.channel.send(`Tienes que otorgarme una licencia para poder validar tu subscripcion\nPuedes obtenerla en: ${process.env.URL}/premium`);
	const { license } = dbMsgModel;
	if(license === args[0]) {
		keys.updateOne({ guildID: message.guild.id, enable: true, time: Date.now() + 2.592e+9 });
		return message.channel.send('Premium Activado para este servidor!');
	}
	else {return message.channel.send('Licencia invalida!');}
};
module.exports.help = {
	name: 'activatekey',
	description: '',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: [],
	ownerOnly: true,
};
