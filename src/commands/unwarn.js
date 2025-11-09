import warnMembers from '../utils/models/warns.js';

export async function run(client, message, args) {
  const target = message.mentions.members.first();
  if (!target) return message.reply('Menciona a alguien.');

  const warn = await warnMembers.findOne({ guildID: message.guild.id, userID: target.id });
  if (!warn) return message.reply('No tiene advertencias.');

  warn.muteUntil = null;
  warn.muteRoleID = null;
  await warn.save(); // Quita el rol automáticamente gracias al post('save') en el modelo

  message.reply(`${target} ha sido desmuteado.`);
}