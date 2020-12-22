const mongoose = require("mongoose");

const connectDatabase = () => {

    // https://mongoosejs.com/docs/deprecations.html
    const options = {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true
    };

    mongoose.connect(process.env.MONGO_URI, options)
        .then(() => {
            console.log("MongoDb Connection Successful");
        })
        .catch((err) => {
            console.error(err);
        });
}

module.exports = connectDatabase;