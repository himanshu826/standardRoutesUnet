const mongoose = require('mongoose');
const Config = require('../Config');
const Modal = require('../Models');
mongoose.Promise = global.Promise;

mongoose.connect(Config.dbConfig.config.dbURI,{ useMongoClient: true }, function (err) {
    if (err) {
        console.log("DB Error: ", err);
        process.exit(1);
    } else {
        console.log('MongoDB Connected');
    }
});
