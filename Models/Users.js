
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Config = require('../Config');

let Users = new Schema({
    name: { type: String, trim: true, sparse: true },
    countryCode: { type: String, default: '', sparse: true },
    phoneNumber: { type: String, default: '', sparse: true },
    password: { type: String, default: '', sparse: true },
    email: { type: String, default: '', sparse: true },
    image: {
        original: { type: String, default: "" },
        thumbnail: { type: String, default: "" },
    },
    location: {
        adminArea: { type: String, default: '', sparse: true },
        country: { type: String, default: '', sparse: true },
        countryCode: { type: String, default: '', sparse: true },
        feature: { type: String, default: '', sparse: true },
        formattedAddress: { type: String, default: '', sparse: true },
        locality: { type: String, default: '', sparse: true },
        locale: { type: String, default: '', sparse: true },
        position: {
            lng: { type: Number, default: 0, sparse: true },
            lat: { type: Number, default: 0, sparse: true }
        },
        postalCode: { type: String, default: '', sparse: true },
        streetName: { type: String, default: '', sparse: true },
        streetNumber: { type: String, default: '', sparse: true },
        subAdminArea: { type: String, default: '', sparse: true },
        subLocality: { type: String, default: '', sparse: true },
    },
    registrationDate: { type: Date, default: Date.now, required: true },
    // amount: { type: String, default: "", sparse: true },
    amount: {
        currencySymbol: { type: String, default: '', sparse: true },
        price: { type: Number, default: 0, sparse: true },
        currency: { type: String, default: '', sparse: true },
    },
    amountDueDate: { type: Date },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deviceToken: { type: String, trim: true, default: '' },
    accessToken: { type: String, trim: true, sparse: true },
    accountConnectionStatus: { type: Number, default: 0, sparse: true },
    tokenTime: { type: Number, default: 0, sparse: true },
});

module.exports = mongoose.model('Users', Users);