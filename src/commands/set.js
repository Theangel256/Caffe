/*
const db = require('quick.db');
module.exports.run = async (client, message, args) => {
	const guilds = new db.table('guilds');
	const Dashboard = `[Dashboard](${process.env.URL}/Dashboard/${message.guild.id})`;

	const embed = new EmbedBuilder()
		.setAuthor(message.author.username + ' Debes de utilizarlo de la siguiente manera.', message.author.displayAvatarURL({ dynamic:true }))
		.setColor(message.guild.me.displayHexColor)
		.setDescription(`\`${client.prefix}set <acción> <dato>\`

		**Acciones disponibles**:
		~~set prefix~~ ${Dashboard}
		~~set logs~~ ${Dashboard}
		~~set autorole @Rol o remove~~ ${Dashboard}
		~~set welcome channel~~ ${Dashboard }
		\`set welcome banner\`
		~~set goodbye channel~~ ${Dashboard}
		\`set goodbye banner\`
		~~set lang~~ ${Dashboard}`);
	if (!args[0]) return message.channel.send({ embeds: [embed] });
	switch (args[0].toLowerCase()) {
		case 'welcome': {
			if(!args[1]) return message.channel.send('Porfavor introduce argumentos, `/set welcome banner`');
			if (args[1].toLowerCase() === 'banner') {
				if (!args[2]) return message.channel.send('Porfavor introduce argumentos,  `/set welcome banner image.com` y con su respectiva medida (1920x1080)');
				if(!/https?:\/\/.+\.(?:png|jpg|jpeg)/g.test(args[2])) return message.channel.send('esta no es una url, o no tiene el formato permitido `png, jpg, jpeg` ejemplo: `' + client.prefix + 'set welcome banner https://api.theangel256.com/img/example.png`');
				guilds.set(`${message.guild.id}`, { fondo: { welcome: args[2] } });
				message.channel.send('Ahora el Banner de la Bienvenida es ' + args[2]);
			}
			else message.channel.send('Opción incorrecta, `/set welcome banner`');
	}
	break;
	case 'goodbye': {
		if(!args[1]) return message.channel.send('Porfavor introduce argumentos, `$set goodbye banner`');
		if (args[1].toLowerCase() === 'banner') {
			if (!args[2]) return message.channel.send('Porfavor introduce argumentos,  `$set goodbye banner https://api.theangel256.com/img/example.png` y con su respectiva medida (1920x1080)');
			guilds.set(`${message.guild.id}`, { fondo: { goodbye: args[2] } });
			message.channel.send('Ahora el Banner de la Despedidad es ' + args[2]);
		} else message.channel.send('Opción incorrecta, `$set goodbye banner`');
	}
	break;
	default: {
		message.channel.send('Opción incorrecta!');
	}
}
};
*/
module.exports.help = {
  name: "set",
  description:
    "establece todas las opciones que hay para disfrutar de un servidor configurado!",
};
module.exports.requirements = {
  userPerms: ["MANAGE_GUILD"],
  clientPerms: [],
  ownerOnly: false,
};
