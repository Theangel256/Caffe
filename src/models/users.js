const { model: Model, Schema } = require("mongoose");

const schema = new Schema({
  userID: {  type: String, required: true, unique: true, },
  marryTag: { type: String, default: null },
  marryId: { type: String, default: null },
  daily: { type: Number, default: Date.now() },
  money: { type: Number, default: 200, },
});

// Si planeas hacer búsquedas frecuentes basadas en `userID`, puedes mantener el índice único
// Aunque ya se está asegurando la unicidad con `unique: true` en `userID`.

// Ejemplo de índice compuesto si necesitas búsquedas combinadas
// schema.index({ marryTag: 1, marryId: 1 }, { unique: true });

module.exports = Model("users", schema);
