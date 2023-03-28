const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OfferSchema = new Schema({
    owner:{type: Schema.Types.ObjectId, ref: 'User'},
    amount: Number,
    date: {type: Date, default: Date.now},
});

const Offer = mongoose.model('Offer', OfferSchema);
module.exports = Offer;