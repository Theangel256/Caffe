module.exports.run = (client, message, args) => {
	if(message.deletable) message.delete();
	if(isNaN(args[0]) || parseInt(args[0]) <= 0) {
		return message.channel.send(client.lang.commands.clear.no_args).then(m => {
			if(m.deletable) m.delete({ timeout: 5000 });
		});
	}
	const deleteAmount = parseInt(args[0] >= 100) ? 100 : parseInt(args[0]);
	message.channel.bulkDelete(deleteAmount === 100 ? deleteAmount : deleteAmount + 1, true).then((deleted) => {
		message.channel.send(`he borrado ${deleted.size} mensaje(s)`).then(m => {
			if(m.deletable) m.delete({ timeout: 1500 }).catch(e => console.log(e.message));
		});
	}).catch(e => {
		switch(e.message) {
		case('You can only bulk delete messages that are under 14 days old.'): {
			message.channel.send('**:exclamation: |** Solo puedo borrar mensajes con menos de 2 semanas de antigüedad')
				.then(m => { if(m.deletable) m.delete({ timeout: 5000 });});
			break;
		}
		case('Unknown Message'): {
			message.channel.send('**:exclamation: |** No hay mensajes para borrar')
				.then(m => { if(m.deletable) m.delete({ timeout: 5000 }); });
			break;
		}
		}
		message.channel.send('**:exclamation: |** Ha ocurrido un error desconosido ' + e.message)
			.then(m => { if(m.deletable) m.delete({ timeout: 5000 }); });
	});
};
module.exports.help = {
	name: 'clear',
	aliases: ['purge'],
	description: 'Borra los mensajes de un canal',
};
module.exports.requirements = {
	userPerms: ['MANAGE_MESSAGES'],
	clientPerms: ['MANAGE_MESSAGES'],
	ownerOnly: false,
};