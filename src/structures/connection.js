const mongoose = require('mongoose');
mongoose
	.connect(process.env.mongoDB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then((db) => console.log(db.connection.host))
	.catch((err) => console.error(err.message));