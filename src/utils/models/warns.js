import { model as Model, Schema } from "mongoose";

const schema = new Schema({
    guildID: { type: String, required: true },
    userID: { type: String, required: true },
    warnings: { type: Number, default: 0 },
    reasons: { type: [String], default: [] }
});

// Índice compuesto único para evitar que un usuario tenga más de un documento por servidor
schema.index({ guildID: 1, userID: 1 }, { unique: true });

export default Model("warnMembers", schema);