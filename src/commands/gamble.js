module.exports.run = async (client, message, args) => {
	const economia = new client.database('economia');
	if(!economia.has(`${message.author.id}.dinero`)) economia.set(`${message.author.id}.dinero`, 200);
	const cantidad = args.join(' '),
		random = Math.ceil(Math.random() * 8),
		all = await economia.get(`${message.author.id}.dinero`);
	if(!cantidad) return message.channel.send(client.lang.commands.gamble.no_quantity);
	if (cantidad.toLowerCase() === 'all' || cantidad.toLowerCase() === 'todo') {
		if(all < 50) return message.channel.send(client.lang.commands.gamble.insufficient_money);
		if (random === 1 || random === 2 || random === 3 || random === 4) {
			const total = parseInt(all * 0.75);
			economia.add(`${message.author.id}.dinero`, total);
			return message.channel.send(client.lang.commands.gamble.success.replace(/{all}/gi, total.toLocaleString()));
		}
		else {
			economia.subtract(`${message.author.id}.dinero`, all);
			return message.channel.send(client.lang.commands.gamble.unsuccess.replace(/{all}/gi, all.toLocaleString()));
		}
	}
	else if(isNaN(cantidad)) {
		return message.channel.send(client.lang.commands.gamble.no_number);
	}
	else if(cantidad < 50) {
		return message.channel.send(client.lang.commands.gamble.minimum);
	}
	else{
		if(all < cantidad) return message.channel.send(client.lang.commands.gamble.bit);
		if (random === 1 || random === 2 || random === 3 || random === 4) {
			const total = parseInt(cantidad * 0.75);
			economia.add(`${message.author.id}.dinero`, total);
			return message.channel.send(client.lang.commands.gamble.success.replace(/{all}/gi, total.toLocaleString()));
		}
		else {
			economia.subtract(`${message.author.id}.dinero`, parseInt(cantidad));
			return message.channel.send(client.lang.commands.gamble.unsuccess.replace(/{all}/gi, parseInt(cantidad.toLocaleString())));
		}
	}
};
module.exports.help = {
	name: 'gamble',
	description: 'Apuesta todo tu dinero, o lo cuanto quieras!',
};
module.exports.requirements = {
	userPerms: [],
	clientPerms: [],
	ownerOnly: false,
};