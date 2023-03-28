const dotenv = require('dotenv');
const express = require('express');

const mongoose = require('mongoose');
mongoose.set('strictQuery', true)

dotenv.config();
const router = express.Router();

mongoose.connect(`${process.env.MONGOOSE_URL}`);

const Channel = require('../models/ChannelModel.js');
const Message = require('../models/MessageModel.js');
const Advert = require('../models/AdvertModel.js');
const User = require('../models/UserModel.js');

router.post('/createChannel', async (req, res) => {
    const {advertId, userId} = req.body;
    if(!advertId || !userId) return res.status(400).json({message: 'Missing parameters'});
    try {
        const advert = await Advert.findById(advertId);
        if(!advert) return res.status(404).json({message: 'Advert not found'});
        const userDoc = await User.findById(userId);
        if(!userDoc) return res.status(404).json({message: 'User not found'});
        const channelCheck = await Channel.findOne({advert: advert._id, participants: [userId, advert.owner]});
        if(channelCheck) {
            return res.json({succes:true,channelExists:true, channel:channelCheck});
        }
        const channel = await Channel.create({advert:advert._id, participants: [userId, advert.owner]});
        if(!channel) return res.status(500).json({message: 'Server error'});
        res.status(200).json({succes:true, channel});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error'});
    }
});

router.get('/channels/:id', async (req, res) => {
    const {id} = req.params;
    if(!id) return res.status(400).json({message: 'Missing parameters'});
    try {
        const channels = await Channel.find({participants: id}).populate({
            path: 'advert',
            select:{
                title: 1,
                price:1,
                images:1
            },
            populate: {
                path: 'owner',
                select: 'name _id',
                model: 'User'
            },
            model: 'Advert'
        }).populate({
            path: 'participants',
            select: 'name',
            model: 'User'
        }).populate({
            path: 'messages',
            select: 'message date owner',
            model: 'Message',
            populate: {
                path: 'owner',
                select: 'name _id',
                model: 'User'
            }
        });
        if(!channels) return res.status(404).json({message: 'Channels not found'});
        res.status(200).json({succes:true, channels:channels.reverse()});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error'});
    }
});

router.post(`/newmessage/:id`, async (req, res) => {
    const {id:channelId} = req.params;
    const {message, userId} = req.body;
    if(!channelId || !message || !userId) return res.status(400).json({message: 'Missing parameters'});
    try {
        const channelDoc = await Channel.findById(channelId);
        if(!channelDoc) return res.status(404).json({message: 'Channel not found'});
        if(!channelDoc.participants.includes(userId)) return res.status(401).json({message: 'Unauthorized'});
        const messageDoc = await Message.create({message, owner: userId});
        if(!messageDoc) return res.status(500).json({message: 'Server error'});
        channelDoc.messages.push(messageDoc._id);
        await channelDoc.save();
        const otherUser = channelDoc.participants.filter(user => user != userId);
        const otherUserDoc = await User.findById(otherUser[0]);
        if(!otherUserDoc) return res.status(500).json({message: 'Server error'});
        if(!otherUserDoc.unReadChannels.includes(channelDoc._id)) {
            otherUserDoc.unReadChannels.push(channelDoc._id);
            await otherUserDoc.save();
        }
        res.status(200).json({succes:true, messageDoc});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error'});
    }
});

router.get('/unreadChannels/:id', async (req, res) => {
    const {id} = req.params;
    if(!id) return res.status(400).json({message: 'Missing parameters'});
    try {
        const userDoc = await User.findById(id)
        if(!userDoc) return res.status(404).json({message: 'User not found'});
        res.json({succes:true, unReadChannels: userDoc.unReadChannels});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error'});
    }
});

router.post('/readmessages', async (req, res) => {
    const {userId} = req.body;
    if(!userId) return res.status(400).json({message: 'Missing parameters'});
    const userDoc = await User.findById(userId);
    if(!userDoc) return res.status(404).json({message: 'User not found'});
    try {
        userDoc.unReadChannels = []
        await userDoc.save();
        res.json({succes:true});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error'});
    }
});

module.exports = router;