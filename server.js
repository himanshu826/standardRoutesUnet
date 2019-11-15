const Config = require('./Config');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Hapi = require('@hapi/hapi');
const Plugins = require('./Plugins');
const Routes = require('./Routes');

global.__basedir = __dirname;
(async initServer => {
    try {
        const server = new Hapi.Server({
            // host: 'localhost',
            port: Config.dbConfig.config.PORT,
            routes: { cors: true }
        });

        mongoose.connect(Config.dbConfig.config.dbURI, { useNewUrlParser: true, useFindAndModify: false }, function (err) {
            if (err) {
                console.log("DB Error: ", err);
                process.exit(1);
            } else {
                console.log('MongoDB Connected');
            }
        });


        await server.register(Plugins);

        await server.route(Routes);

        server.start(function() {
            console.log('Server running on', server.info.uri)
        })

        server.route(
            [
                {
                    method: 'GET',
                    path: '/uploads/{image}',
                    handler:function (req, res) {
                        return res.file('uploads/' + req.params.image);
                    }
                }
            ]);

        server.events.on('response', function (request) {
            console.log(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.path + ' --> ' + request.response.statusCode);
            console.log('Request payload:', request.payload);
        });

    } catch (error) {
        console.log('6666666666666666', error);
        // Logger.error(error);
    }
})();