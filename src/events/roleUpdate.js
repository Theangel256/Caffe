module.exports = async (client, oldRole, newRole) => {
  const p1 = oldRole.permissions;
  const p2 = newRole.permissions;
  if(p1.equals(p2)) return;
  const r1 = p1.missing(p2)
  const r2 = p2.missing(p1)
  const embed = new client.Discord.MessageEmbed()
  .setTitle("Permisos del rol cambiados")
  .addField("Rol", newRole.toString())
  .setColor("RANDOM")
  if(r1.length) {
    embed.addField("Permisos agregados", r1.join(", "))
  }
  if(r2.length) {
    embed.addField("Permisos removidos", r2.join(", "))
  }
  client.channels.cache.get("739049236259405845").send(embed);
}