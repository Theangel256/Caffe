const {getMember} = require('../structures/functions.js');
module.exports.run = (client, message, args) => {
	const dinero = new client.database('economia'),
		member = getMember(message, args, false);

	if (!member) return message.channel.send('Debe mencionar a un usuario.');

	const cantidad = parseInt(args.slice(1).join(' '));

	if (!cantidad) return message.channel.send('Debe ingresar una cantidad.');

	if(isNaN(cantidad)) return message.channel.send('Debe ingresar un número');

	const iva = cantidad / 100 * 6,
		total = cantidad - iva,
		all = dinero.get(`${message.author.id}.dinero`);

	if(cantidad >= 100) {
		if(all < cantidad) return message.channel.send('No tienes dinero suficiente ocupas: $**100**');
		if(!dinero.has(`${member.user.id}.dinero`)) dinero.set(`${member.user.id}.dinero`, 200);
		dinero.add(`${member.user.id}.dinero`, total);
		dinero.subtract(`${message.author.id}.dinero`, cantidad);
		message.channel.send(`Has transferido $${cantidad.toLocaleString()} *(${total.toLocaleString()} despues de 6% de impuestos)* a **${member.user.username}** correctamente.`);
	}
	else {
		message.channel.send('lo minimo para poder transferir es $**100**');
	}
};
module.exports.help = {
	name: 'transfer',
	aliases: ['pay'],
	description: 'transfiere parte de tu dinero a un amigo!',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: [],
	ownerOnly: false,
};