let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Config = require('../Config');

let GenresAndTypes = new Schema({
    name: { type: String, trim: true, index: true },
    priority: { type: Number, default: 0, sparse: true },
    type: {
        type: String, trim: true, index: true, enum: [
            Config.APP_CONSTANTS.CATEGORY_TYPES.DIRECTORY_TYPE,
            Config.APP_CONSTANTS.CATEGORY_TYPES.CHANNEL_GENRES,
        ]
    },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Number },
    updatedAt: { type: Number }
});

module.exports = mongoose.model('GenresAndTypes', GenresAndTypes);