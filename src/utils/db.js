const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (!MONGO_URI) {
    console.error("❌ MONGO_URI no está definido en el archivo .env");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI)
    .then((mongoose) => {
      console.log("✅ Conectado a MongoDB");
      return mongoose;
    }).catch(err => {
      throw new Error("❌ Error conectando a MongoDB:", err);
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
module.exports = dbConnect;
