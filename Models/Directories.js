let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Config = require('../Config');

let Directories = new Schema({
    name: { type: String, trim: true, index: true },
    image: {
        original: { type: String, default: "" },
        thumbnail: { type: String, default: "" },
        type: { type: String },
    },
    location: { type: [Number] },
    country: { type: String, default: "" },
    city:{ type: String, default: "" },
    address: { type: String, default: "" },
    postalCode: { type: String, default: "" },
    state: { type: String, default: "" },
    localityName: { type: String, default: "" },
    landmark: { type: String, default: "" },
    description: { type: String, trim: true, index: true },
    tags: {
        type: Array,
        sparse: true,
        // ref: 'Groups'
    },
    directoryTypeId: { type: Schema.ObjectId, sparse: true, ref: 'GenresAndTypes' },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    // priority: { type: Number, default: 0, sparse: true },
    createdAt: { type: Number },
    updatedAt: { type: Number }
});

Directories.index({'location': "2dsphere"});


module.exports = mongoose.model('Directories', Directories);