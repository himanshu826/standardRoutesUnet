
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Config = require('../Config');

let HomeSlider = new Schema({
    image: {
        original: { type: String, default: "" },
        thumbnail: { type: String, default: "" },
        type: { type: String },
    },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    priority: { type: Number, default: 0, sparse: true },
    createdAt: { type: Number },
    updatedAt: { type: Number }
});

module.exports = mongoose.model('HomeSlider', HomeSlider);