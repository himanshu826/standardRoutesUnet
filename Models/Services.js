
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Config = require('../Config');

let Services = new Schema({
    name: { type: String, default: "" },
    ott_link: { type: String, default: "" },
    radio_link: { type: String, default: "" },
    church_link: { type: String, default: "" },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Number },
    updatedAt: { type: Number }
});

module.exports = mongoose.model('Services', Services);