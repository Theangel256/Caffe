const mongoose = require("mongoose");
mongoose
  .connect(process.env.mongoDB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }, err => {
    if(err) throw err;
    console.log(db.connection.host)
 });