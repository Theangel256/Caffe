module.exports.run = async (client, message, args) => {
	const guilds = new db.table('guilds');,
		Dashboard = `[Dashboard](${process.env.URL}/Dashboard/${message.guild.id})`;

	const embed = new client.Discord.MessageEmbed()
		.setAuthor(message.author.username + ' Debes de utilizarlo de la siguiente manera.', message.author.displayAvatarURL({ dynamic:true }))
		.setColor(message.guild.me.displayHexColor)
		.setDescription(`\`${client.prefix}set <acción> <dato>\`\n\n**Acciones disponibles**:\n~~set prefix~~ ${Dashboard}\n~~set logs~~ ${Dashboard}\n~~set autorole @Rol o remove~~ ${Dashboard}\n~~set welcome channel~~ ${Dashboard }\n\`set welcome banner\`\n~~set goodbye channel~~ ${Dashboard}\n\`set goodbye banner\`\n\`set lang es ó es\``);

	if (!args[0]) return message.channel.send(embed);

	if (args[0].toLowerCase() === 'welcome') {
		if(!args[1]) return message.channel.send('Porfavor introduce argumentos, `/set welcome banner`');
		if (args[1].toLowerCase() === 'banner') {
			if (!args[2]) return message.channel.send('Porfavor introduce argumentos,  `/set welcome banner image.com` y con su respectiva medida (1920x1080)');
			if(!/https?:\/\/.+\.(?:png|jpg|jpeg)/g.test(args[2])) return message.channel.send('esta no es una url, o no tiene el formato permitido `png, jpg, jpeg` ejemplo: `' + client.prefix + 'set welcome banner https://caffebot.glitch.me/api/example.png`');
			opciones.set(`${message.guild.id}.fondo.welcome`, args[2]);
			message.channel.send('Ahora el Banner de la Bienvenida es ' + args[2]);
		}
		else {message.channel.send('Opción incorrecta, `$set welcome banner`');}
	}
	else if (args[0].toLowerCase() === 'goodbye') {
		if(!args[1]) return message.channel.send('Porfavor introduce argumentos, `/set goodbye banner`');
		if (args[1].toLowerCase() === 'banner') {
			if (!args[2]) return message.channel.send('Porfavor introduce argumentos,  `/set goodbye banner image.com` y con su respectiva medida (1920x1080)');
			opciones.set(`${message.guild.id}.fondo.goodbye`, args[2]);
			message.channel.send('Ahora el Banner de la Despedidad es ' + args[2]);
		}
		else {message.channel.send('Opción incorrecta, `$set goodbye banner`');}
	} else {message.channel.send('Opción incorrecta!');}
};
module.exports.help = {
	name: 'set',
	description: 'establece todas las opciones que hay para disfrutar de un servidor configurado!',
};
module.exports.requirements = {
	userPerms: ['MANAGE_GUILD'],
	clientPerms: [],
	ownerOnly: false,
};