import economySystem from "../utils/models/users.js";
import { getMember, getOrCreateDB } from "../utils/functions.js";
export async function run(client, message, args) {
  const lang = client.lang.commands.balance;
  const member = getMember(message, args, true);
  const economy = await getOrCreateDB(economySystem, { userID: member.user.id });
  if (!economy) return message.channel.send(client.lang.dbError);
  message.channel.send(
    message.author.id === member.user.id
      ? lang.no_user.replace(/{money}/gi, economy.money.toLocaleString())
      : lang.user.replace(/{user.username}/gi, member.user.username).replace(/{money}/gi, economy.money.toLocaleString())
  );
};

export const help = {
  name: "balance",
  aliases: ["bal", "money"],
  description: "Muestra el dinero que tienes en el bot",
};
export const requirements = {
  userPerms: [],
  clientPerms: [],
  ownerOnly: false,
};
