'use strict';
if (process.env.NODE_ENV === 'dev') {
    exports.config = {
        PORT: 8000,
        dbURI: 'mongodb://unet-dev-uSeR:3!unet!!9U2g65fsBNMV@45.232.252.32/unet-DB'
    }
}
else {
    exports.config = {
        PORT: 8002,
        dbURI: 'mongodb://localhost/unet-dev'
    };
}