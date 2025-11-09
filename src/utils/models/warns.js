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

export default Model("warnMembers", warnSchema);