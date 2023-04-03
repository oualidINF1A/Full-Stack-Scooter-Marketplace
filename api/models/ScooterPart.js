const mongoose = require('mongoose');
const {Schema} = mongoose;

const ScooterPartSchema = new Schema({
    partCategory: String,
    typeOfPart: String,
    condition: String,
});

const ScooterPart = mongoose.model('ScooterPart', ScooterPartSchema);
module.exports = ScooterPart;
