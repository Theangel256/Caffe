const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI no está definido en el archivo .env");
}
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then((mongoose) => {
        console.log("✅ Conectado a MongoDB");
        return mongoose;
    }).catch(err => {
        console.error("❌ Error conectando a MongoDB:", err);
        throw err
});
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
