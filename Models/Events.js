
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Config = require('../Config');

let Events = new Schema({
    name: { type: String, trim: true, index: true },
    description: { type: String, trim: true, index: true },
    image: {
        original: { type: String, default: "" },
        thumbnail: { type: String, default: "" },
        type: { type: String },
    },
    location: { type: [Number] },
    country: { type: String, default: "" },
    city: { type: String, default: "" },
    address: { type: String, default: "" },
    postalCode: { type: String, default: "" },
    state: { type: String, default: "" },
    localityName: { type: String, default: "" },
    landmark: { type: String, default: "" },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    priority: { type: Number, default: 0, sparse: true },
    startDate: { type: Number },
    endDate: { type: Number },
    createdAt: { type: Number },
    updatedAt: { type: Number }
});

Events.index({'location': "2dsphere"});

module.exports = mongoose.model('Events', Events);