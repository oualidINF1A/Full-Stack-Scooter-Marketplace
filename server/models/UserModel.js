const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema({
    name:String,
    email:String,
    password:String,
    favorites:[{type:Schema.Types.ObjectId, ref:'Advert', default:[]}],
    channels:[{type:Schema.Types.ObjectId, ref:'Channel', default:[]}],
    unReadChannels:[{type:Schema.Types.ObjectId, ref:'Channel', default:[]}],
    date: { type: Date, default: Date.now },    
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel; 

 