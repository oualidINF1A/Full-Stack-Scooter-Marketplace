const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  
const mongoose = require('mongoose');

const Advert = require('../models/AdvertModel.js');
const Scooter = require('../models/ScooterModel.js');
const ScooterPart = require('../models/ScooterPart.js');
const User = require('../models/UserModel.js');
const Offer = require('../models/OfferModel.js');
const Channel = require('../models/ChannelModel.js');
const Message = require('../models/MessageModel.js');

const router = express.Router();



router.post('/new' , async (req, res) => {
    mongoose.set('strictQuery', true)
    mongoose.connect(`${process.env.MONGOOSE_URL}`);
    const {
    ownerId,
    title,
    description,
    price,
    offerPrice,
    images,
    phone,
    showContactInfo,
    zipCode,
    city,
    longitude,
    latitude,
    houseNumber,
    showCity,
    province,
    category,
    brand,
    model,
    extraInfo,
    } = req.body;
    const newImages = [];
    for(let i = 0; i < images.length; i++){
        const url = await cloudinary.uploader.upload(images[i]).catch(err => console.log(err));
        newImages.push(url.secure_url);
    }
    try {
        if(category === 'Scooters'){
            const scooterDoc = await Scooter.create({
                category, brand, model, condition:extraInfo.condition, licensePlateType:extraInfo.licensePlateType, cylinderCapacity:extraInfo.cylinderCapacity, 
                yearOfConstruction:extraInfo.yearOfConstruction, mileage:extraInfo.mileage 
            }).catch(err => console.log(err));

            const advertDoc = await Advert.create({
                owner: ownerId, title, description:description+` ${scooterDoc.brand} ${scooterDoc.model}`, price, offerPrice, images:newImages, phone, 
                showContactInfo,showCity,zipCode,city,
                location:{
                    type: 'Point',
                    coordinates: [longitude, latitude]
                }, province,houseNumber ,scooter: scooterDoc._id
            }).catch(err => console.log(err));
            res.json({succes:true, advert:advertDoc});
        }else{
            console.log(brand, model, extraInfo.condition)
            const scooterPartDoc = await ScooterPart.create({
                partCategory:brand, typeOfPart:model, condition:extraInfo.condition
            }).catch(err => console.log(err));
            const advertDoc = await Advert.create({
                owner: ownerId, title, description:description+` ${scooterPartDoc.partCategory}, ${scooterPartDoc.typeOfPart}`, price, offerPrice, images:newImages, phone, 
                showContactInfo,showCity,zipCode,city,
                location:{
                    type: 'Point',
                    coordinates: [longitude, latitude]
                }, province,houseNumber ,scooterPart: scooterPartDoc._id
            }).catch(err => console.log(err));
            res.json({succes:true, advert:advertDoc});
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
    
})

router.put('/update/:id', async (req, res) => {
    mongoose.set('strictQuery', true)
    mongoose.connect(`${process.env.MONGOOSE_URL}`);
    const { id } = req.params;
    if(!id) return res.status(400).json({succes:false, msg:'No id provided'});
    const {
        title,
        description,
        price,
        offerPrice,
        images,
        phone,
        showContactInfo,
        zipCode,
        houseNumber,
        city,
        longitude,
        latitude,
        province,
        showCity,
        category,
        brand,
        model,
        extraInfo,
        } = req.body;
    try {
        const advert = await Advert.findById(id);
        if(!advert) return res.status(400).json({succes:false, msg:'No advert found'});
        const newImages = [];
        for(let i = 0; i < images.length; i++){
            const url = await cloudinary.uploader.upload(images[i]).catch(err => console.log(err));
            newImages.push(url.secure_url);
        }
        if(category === 'Scooters'){
            const scooter = await Scooter.findById(advert.scooter);
            if(!scooter) return res.status(400).json({succes:false, msg:'No scooter found'});
            scooter.category = category;
            scooter.brand = brand;
            scooter.model = model;
            scooter.condition = extraInfo.condition;
            scooter.licensePlateType = extraInfo.licensePlateType;
            scooter.cylinderCapacity = extraInfo.cylinderCapacity;
            scooter.yearOfConstruction = extraInfo.yearOfConstruction;
            scooter.mileage = extraInfo.mileage;
            await scooter.save();
        }else{
            const scooterPart = await ScooterPart.findById(advert.scooterPart);
            if(!scooterPart) return res.status(400).json({succes:false, msg:'No scooter part found'});
            scooterPart.partCategory = brand;
            scooterPart.typeOfPart = model;
            scooterPart.condition = extraInfo.condition;
            await scooterPart.save();
        }


        advert.title = title;
        advert.description = description;
        advert.price = price;
        advert.offerPrice = offerPrice;
        advert.images = newImages;
        advert.phone = phone;
        advert.zipCode = zipCode;
        advert.showContactInfo = showContactInfo;
        advert.showCity = showCity;
        advert.city = city;
        advert.location = {
            type: 'Point',
            coordinates: [longitude, latitude]
        };
        advert.province = province;
        advert.houseNumber = houseNumber;

        await advert.save();
        res.json({succes:true, advert});
    }catch(err){
        console.log(err);
        res.status(500).send('Server error');
    }
});

router.get('/userAdverts/:id', async (req, res) => {
    mongoose.set('strictQuery', true)
    mongoose.connect(`${process.env.MONGOOSE_URL}`);
    const { id } = req.params;
    if(!id) return res.status(400).json({succes:false, msg:'No id provided'});
    try {
        const adverts = await Advert.find({owner:id})?.populate('scooter')?.populate('scooterPart').populate({
            path: 'owner', 
            model: 'User',
            select: 'name email'
          }).exec();

        res.json({succes:true, adverts});
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
}); 

router.get('/delete/:id', async (req, res) => {
    mongoose.set('strictQuery', true)
    mongoose.connect(`${process.env.MONGOOSE_URL}`);
    const { id } = req.params;
    if(!id) return res.status(400).json({succes:false, msg:'No id provided'});
    try {
        const advert = await Advert.findById(id);
        if(!advert) return res.status(400).json({succes:false, msg:'No advert found'});
        if(advert.scooter){
            await Scooter.deleteOne({_id: advert.scooter});
        }
        if(advert.scooterPart){
            await ScooterPart.deleteOne({_id: advert.scooterPart});
        }
        advert.images.forEach(async (image) => {
            await cloudinary.uploader.destroy(image);
        });

        await Advert.deleteOne({_id: advert._id});
        res.json({succes:true, msg:'Advert deleted'});
    }catch(err){
        console.log(err);
        res.status(500).send('Server error');
    }
});

router.get('/advert/:id', async (req, res) => {
    mongoose.set('strictQuery', true)
    mongoose.connect(`${process.env.MONGOOSE_URL}`);
    const { id } = req.params;
    if(!id) return res.status(400).json({succes:false, msg:'No id provided'}) ;
    try {
        const advert = await Advert.findById(id)?.populate('scooter')?.populate('scooterPart').populate({
            path: 'owner', 
            model: 'User',
            select: 'name email _id'
          }).exec();
        if(!advert) return res.status(400).json({succes:false, msg:'No advert found'});
        res.json({succes:true, advert});
    }catch(err){
        console.log(err);
        res.status(500).send('Server error');
    }
});

router.post('/all', async (req, res) => {
    mongoose.set('strictQuery', true)
    mongoose.connect(`${process.env.MONGOOSE_URL}`);
    const {skip} = req.body;
    try {
        const adverts = await Advert.find().
        skip(skip).limit(10)
        ?.populate('scooter')?.populate('scooterPart').populate({
            path: 'owner', 
            model: 'User',
            select: 'name email'
          }).exec();
        res.json({succes:true, adverts});
    }catch(err){
        console.log(err);
        res.status(500).send('Server error');
    }
});

router.put('/advert/save', async (req, res) => {
    mongoose.set('strictQuery', true)
    mongoose.connect(`${process.env.MONGOOSE_URL}`);
    const {advertId, userId} = req.body;
    if(!advertId || !userId) return res.status(400).json({succes:false, msg:'No id provided'});
    try {
        const userDoc = await User.findById(userId);
        const advertDoc = await Advert.findById(advertId);
        if(!userDoc) return res.status(400).json({succes:false, msg:'No user found'});
        if(!advertDoc) return res.status(400).json({succes:false, msg:'No advert found'});
        if(userDoc.favorites.includes(advertId) || advertDoc.saves.includes(userId)){
            userDoc.favorites.remove(advertId);
            await userDoc.save();
            advertDoc.saves.remove(userId)
            await advertDoc.save();
            return res.json({succes:true, saved:false});
        }
        userDoc.favorites.push(advertId);
        await userDoc.save();
        advertDoc.saves.push(userId);
        await advertDoc.save();
        res.json({succes:true, saved:true});
    }catch(err){
        console.log(err);
        res.status(500).send('Server error');
    }
});

router.get('/saved/:id', async (req, res) => {
    mongoose.set('strictQuery', true)
    mongoose.connect(`${process.env.MONGOOSE_URL}`);
    const { id } = req.params;
    if(!id) return res.status(400).json({succes:false, msg:'No id provided'});
    try{
        const userDoc = await User.findById(id).populate('favorites').exec();
        if(!userDoc) return res.status(400).json({succes:false, msg:'No user found'});
        res.json({succes:true, adverts:userDoc.favorites});
    }catch(err){

    }
});

router.post('/favorites/delete', async (req, res) => {
    mongoose.set('strictQuery', true)
    mongoose.connect(`${process.env.MONGOOSE_URL}`);
    const {advertId, userId} = req.body;
    if(!advertId) return res.status(400).json({succes:false, msg:'No id provided'});
    if(!userId) return res.status(400).json({succes:false, msg:'No id provided'});
    try{
        const advertDoc = await Advert.findById(advertId);
        if(!advertDoc) return res.status(400).json({succes:false, msg:'No advert found'});
        const userDoc = await User.findById(userId);
        if(!userDoc) return res.status(400).json({succes:false, msg:'No user found'});
        userDoc.favorites.remove(advertId);
        await userDoc.save();
        advertDoc.saves.remove(userId);
        await advertDoc.save();
        res.json({succes:true, msg:'Advert removed from favorites'});
    }catch(err){

    }
});

router.get(`/adverts/:category/:brand/:model`, async (req, res) => {
    mongoose.set('strictQuery', true)
    mongoose.connect(`${process.env.MONGOOSE_URL}`);
    const { brand, model, category } = req.params;
    if(!brand || !model || !category) return res.status(400).json({succes:false, msg:'No brand or model or category provided'});
    try {
        if(category === 'Scooters'){
            const scooters = model === 'alle' ? await Scooter.find({brand}).limit(4).exec() : await Scooter.find({brand, model}).limit(4).exec()
            if(!scooters) return res.status(400).json({succes:false, msg:'No scooters found'});
            const adverts = await Advert.find({scooter:{$in:scooters}})?.populate('scooter')?.populate('scooterPart').populate({
                path: 'owner',
                model: 'User',
                select: 'name email'
            }).exec();
            res.json({succes:true, adverts});
        }else{
            const scooterParts = model === 'alle' ? await ScooterPart.find(
                {partCategory:brand}
            ).limit(4).exec() : await ScooterPart.find({partCategory:brand, typeOfPart:model}).limit(4).exec();
            if(!scooterParts) return res.status(400).json({succes:false, msg:'No scooter parts found'});
            const adverts = await Advert.find(
                {scooterPart:{$in:scooterParts}}
            )?.populate('scooter')?.populate('scooterPart').populate({
                path: 'owner',
                model: 'User',
                select: 'name email' 
            }).exec();  
            res.json({succes:true, adverts});
        }

    }catch(err){
        console.log(err);
        res.status(500).send('Server error');
    }
});

router.get('/query/:query/:city', async (req, res) => {
    mongoose.set('strictQuery', true)
    mongoose.connect(`${process.env.MONGOOSE_URL}`);
    const { query, city } = req.params;
    if(!query) return res.status(400).json({succes:false, msg:'No query provided'});
    try {
        if(city === "none"){
            const adverts = await Advert.find({$text:{$search:query}})?.populate('scooter')?.populate('scooterPart').populate({
                path: 'owner',
                model: 'User',
                select: 'name email'
            }).exec();
        res.json({succes:true, adverts});

        }else{
            const adverts = await Advert.find({$text:{$search:query},
                city:city.charAt(0).toUpperCase() + city.slice(1)
            })?.populate('scooter')?.populate('scooterPart').populate({
                path: 'owner'
                }).exec();
            res.json({succes:true, adverts});    
        }
    } catch (error) {
        console.log(error)
    }
});

router.put('/advert/newOffer', async (req, res) => {
    mongoose.set('strictQuery', true)
    mongoose.connect(`${process.env.MONGOOSE_URL}`);
    const {advertId, userId, offer} = req.body;
    if(!advertId || !userId || !offer) return res.status(400).json({succes:false, msg:'No id provided'});
    try {
        const advertDoc = await Advert.findById(advertId);
        if(!advertDoc) return res.status(400).json({succes:false, msg:'No advert found'});
        const offerDoc = await Offer.create({owner:userId, amount:offer})
        advertDoc.offers.push(offerDoc._id);
        await advertDoc.save();
        res.json({succes:true, msg:'Offer created'});
    } catch (error) {
        console.log(error)
    }
});

router.get('/advert/offers/:id', async (req, res) => {
    mongoose.set('strictQuery', true)
    mongoose.connect(`${process.env.MONGOOSE_URL}`);
    const { id:advertId } = req.params;
    if(!advertId) return res.status(400).json({succes:false, msg:'No id provided'});
    try {
        const advertDoc = await Advert.findById(advertId).populate('offers').populate({
            path: 'offers',
            model: 'Offer',
            populate: {
                path: 'owner',
                model: 'User',
                select: 'name email'
            }
        }).exec();
        if(!advertDoc) return res.status(400).json({succes:false, msg:'No advert found'});
        res.json({succes:true, offers:advertDoc.offers});
    } catch (error) {
        console.log(error) 
    }
}); 

router.post('/delete/offer/:id', async (req, res) => {
    mongoose.set('strictQuery', true)
    mongoose.connect(`${process.env.MONGOOSE_URL}`);
    const { id:offerId } = req.params;
    const {advertId} = req.body;
    if(!offerId) return res.status(400).json({succes:false, msg:'No id provided'});
    try {
        const advertDoc = await Advert.findById(advertId);
        if(!advertDoc) return res.status(400).json({succes:false, msg:'No advert found'});
        advertDoc.offers.remove(offerId) ;
        await advertDoc.save();
        const offerDoc = await Offer.findByIdAndDelete(offerId);
        if(!offerDoc) return res.status(400).json({succes:false, msg:'No offer found'});
        res.json({succes:true, offers:advertDoc.offers});
    } catch (error) {
        console.log(error)
    }
});



module.exports = router;