import { getMember, getOrCreateDB } from "../utils/functions.js";
import users from "../utils/models/users.js";
export async function run(client, message, args) {
	const lang = client.lang.commands.marry;
	const member = getMember(message, args, false);
	const usersDB = await getOrCreateDB(users, { userID: message.author.id });
	if (!usersDB) return message.channel.send(client.lang.dbError);
	let { marryId, marryTag } = usersDB;
	if (marryId) return message.channel.send(lang.already_married.replace(/{esposaTag}/gi, marryTag));
	console.log("RESULT:", member?.user?.tag, "AUTHOR:", message.author.tag);

	if(!member) return message.channel.send(client.lang.no_user);
	if(member.user.bot) return message.channel.send(lang.bot);
	if(member.user.id === message.author.id) return message.channel.send(lang.yourself);

	const memberDB = await getOrCreateDB(users, { userID: member.user.id });
	if (!memberDB) return message.channel.send(client.lang.dbError);
	if (memberDB.marryId) return message.channel.send(lang.another_married);
	message.channel.send(lang.request.replace(/{user.username}/gi, member.user.username).replace(/{author.username}/gi, message.author.username));
	const filter = m => m.author.id === member.user.id && (m.content && (m.content.toLowerCase().startsWith('yes') || m.content.toLowerCase().startsWith('no')));
	message.channel.awaitMessages(filter, { max: 1, time: 120000, errors: ['time'] }).then(async collected => {
		if (collected.first().content.toLowerCase() === 'yes') {
			try {
				usersDB.marryId = member.user.id;
				usersDB.marryTag = member.user.tag;
				memberDB.marryId = message.author.id;
				memberDB.marryTag = message.author.tag;
				await Promise.all([
      			usersDB.save(),
      			memberDB.save()
			]);
			message.channel.send(lang.sucess.replace(/{user.username}/gi, member.user.username).replace(/{author.username}/gi, message.author.username));
		} catch (error) {
			console.error("Error al guardar el matrimonio:", error);
			message.channel.send(lang.errorSaving);
		}
	} else if (collected.first().content.toLowerCase() === 'no') {
		return message.channel.send(lang.unsucess.replace(/{user.username}/gi, member.user.username).replace(/{author.username}/gi, message.author.username));
	}
	}).catch(() => message.channel.send(client.lang.commands.marry.expired.replace(/{user.username}/gi, member.user.username)));
};
export const help = {
  name: "marry",
  description: "Podras casarte con un miembro con este comando",
};
export const requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: false,
};
export const limits = {
  rateLimit: 3,
  cooldown: 120000,
};
