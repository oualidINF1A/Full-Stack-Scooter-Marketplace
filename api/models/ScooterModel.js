const mongoose = require('mongoose');
const {Schema} = mongoose;

const ScooterSchema = new Schema({
    brand: String,
    model: String,
    condition: String,
    licensePlateType: String,
    cylinderCapacity: String,
    yearOfConstruction: String,
    mileage: String
}); 

const Scooter = mongoose.model('Scooter', ScooterSchema);
module.exports = Scooter;