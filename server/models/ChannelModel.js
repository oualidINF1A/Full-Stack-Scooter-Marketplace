const mongoose = require('mongoose');
const {Schema} = mongoose;

const ChannelSchema = new Schema({
    advert: {type: Schema.Types.ObjectId, ref: 'Advert'},
    participants: [{type: Schema.Types.ObjectId, ref: 'User'}],
    messages: [{type: Schema.Types.ObjectId, ref: 'Message', default: []}],
    date: { type: Date, default: Date.now }
});

const Channel = mongoose.model('Channel', ChannelSchema);

module.exports = Channel;