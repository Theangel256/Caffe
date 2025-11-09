import { model as Model, Schema } from "mongoose";
import moment from 'moment';

const userSchema = new Schema({
  userID: {  type: String, required: true, unique: true, },
  marryId: { type: Schema.Types.ObjectId, default: null, ref: 'User' },
  lastDaily: { type: Date, default: null },
  money: { type: Number, default: 200, },
  language: { type: String, default: "en", required: true, },
  reputation: { type: Number, default: 0, },
  personalText: { type: String, default: null },
  repCooldown: { type: Number, default: 0 },
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } });

userSchema.virtual('isMarried').get(function() {
  return this.marryId !== null;
});

userSchema.virtual('canClaimDaily').get(function() {
  if (!this.lastDaily) return true;
  return moment().diff(moment(this.lastDaily), 'hours') >= 24;
});

userSchema.virtual('partner', {
  ref: 'User',
  localField: 'marryId',
  foreignField: '_id',
  justOne: true
});
// Si planeas hacer búsquedas frecuentes basadas en `userID`, puedes mantener el índice único
// Aunque ya se está asegurando la unicidad con `unique: true` en `userID`.

// Ejemplo de índice compuesto si necesitas búsquedas combinadas
// schema.index({ marryTag: 1, marryId: 1 }, { unique: true });
export default Model('users', userSchema);

