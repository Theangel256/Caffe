import users from "../utils/models/users.js";
import { getMember, getOrCreateDB } from "../utils/functions.js";
export async function run(client, message, args) {
	const economy = await getOrCreateDB(users, { userID: message.author.id });
	const member = getMember(message, args, false);
	if (!member) return message.channel.send('Debe mencionar a un usuario.');
	const cantidad = parseInt(args.slice(1).join(' '));
	if (!cantidad) return message.channel.send('Debe ingresar una cantidad.');
	if(isNaN(cantidad)) return message.channel.send('Debe ingresar un número');
	const iva = cantidad / 100 * 6,
		total = cantidad - iva,
		all = economy.money;
	if(cantidad >= 100) {
		if(all < cantidad) return message.channel.send('No tienes dinero suficiente ocupas un mínimo de: $**100**');
		const memberEconomy = await getorCreateDB(economySystem, { userID: member.user.id });
		memberEconomy.money += total;
		economy.money -= cantidad;
		await memberEconomy.save();
		await economy.save();
		message.channel.send(`Has transferido $${cantidad.toLocaleString()} *(${total.toLocaleString()} despues de 6% de impuestos)* a **${member.user.username}** correctamente.`);
	}
}
export const help = {
  name: "transfer",
  aliases: ["pay"],
  description: "transfiere parte de tu dinero a un amigo!",
};
export const requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: false,
};
