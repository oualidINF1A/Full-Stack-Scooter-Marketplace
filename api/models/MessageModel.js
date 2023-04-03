const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    channel: {type: Schema.Types.ObjectId, ref: 'Channel'},
    message: {type: String, required: true},
    owner: {type: Schema.Types.ObjectId, ref: 'User'},
    date: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;