import { model as Model, Schema } from "mongoose";

const warnSchema = new Schema({
  guildID: { type: String, required: true },
  userID: { type: String, required: true },
  warnings: { type: Number, default: 0 },
  reasons: { type: [String], default: [] },
  muteUntil: { type: Date, default: null },
  muteRoleID: { type: String, default: null }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
// Índice compuesto único para evitar que un usuario tenga más de un documento por servidor
warnSchema.index({ guildID: 1, userID: 1 }, { unique: true });

warnSchema.virtual('isMuted').get(function() {
  if (!this.muteUntil) return false;
  return new Date(this.muteUntil) > new Date();
});

warnSchema.virtual('muteTimeLeft').get(function() {
  if (!this.isMuted) return 0;
  return Math.ceil((new Date(this.muteUntil) - new Date()) / 1000); // segundos
});

warnSchema.post('save', async function(doc) {
  if (!doc.isMuted && doc.muteRoleID) {
    const client = globalThis.client;
    if (!client) return;

    const guild = client.guilds.cache.get(doc.guildID);
    if (!guild) return;

    const member = await guild.members.fetch(doc.userID).catch(() => null);
    if (!member) return;

    await member.roles.remove(doc.muteRoleID).catch(() => {});
    console.log(`[WARN] Mute expirado para ${member.user.tag} en ${guild.name}`);
  }
});

warnSchema.post('find', async function(docs) {
  const client = globalThis.client;
  if (!client) return;

  for (const doc of docs) {
    if (doc.isMuted) continue; // Aún activo

    if (doc.muteRoleID) {
      const guild = client.guilds.cache.get(doc.guildID);
      if (guild) {
        const member = await guild.members.fetch(doc.userID).catch(() => null);
        if (member) {
          await member.roles.remove(doc.muteRoleID).catch(() => {});
        }
      }
    }

    // Limpiar campos
    doc.muteUntil = null;
    doc.muteRoleID = null;
    await doc.save().catch(() => {});
  }
});

export default Model("warnMembers", warnSchema);