const mongoose = require('mongoose');
const {Schema} = mongoose;

const AdvertSchema = new Schema({
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    title: {type: String, text: true},
    description: {type: String, text: true},
    price: Number,
    offerPrice: Number,
    images: [String],
    offers: [{type: Schema.Types.ObjectId, ref: 'Offer', default: []}],
    phone: String,
    showContactInfo: {type: Boolean, default: false},
    zipCode: {type: String, text: true},
    city: {type: String, text: true},
    houseNumber: String,
    location: {
        type: {type: String, default: 'Point'},
        coordinates: {type: [Number], default: [0, 0]} // [longitude, latitude]
    },
    showCity: {type: Boolean, default: false},
    province: String,
    scooter: {type: Schema.Types.ObjectId, ref: 'Scooter'},
    saves: [{type: Schema.Types.ObjectId, ref: 'User', default: []}],
    date: { type: Date, default: Date.now },
});

const Advert = mongoose.model('Advert', AdvertSchema);

module.exports = Advert; 