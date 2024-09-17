'use strict';
if (process.env.NODE_ENV === 'dev') {
    exports.config = {
        PORT: 8000,
        dbURI: ''
    }
}
else {
    exports.config = {
        PORT: 8002,
        dbURI: 'mongodb://localhost/unet-dev'
    };
}
