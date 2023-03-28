const dotenv = require('dotenv');
const express = require('express');
const bcrypt = require('bcryptjs'); 

const mongoose = require('mongoose');
mongoose.set('strictQuery', true)

dotenv.config();
const router = express.Router();

mongoose.connect(`${process.env.MONGOOSE_URL}`);

const User = require('../models/UserModel.js');

router.post('/register', async (req, res) => {
    const data = req.body;
    try{
        bcrypt.hash(data.password, 10).then(
            async (hashedPassword) => {
                const userDoc = await User.create({
                    name: data.name,
                    email: data.email,
                    password: hashedPassword
                });
                res.status(200).json({message: 'User created successfully', userDoc:{name: userDoc.name, email: userDoc.email, _id: userDoc._id}});
            }
        )

    }catch(err){
        console.log('Something went wrong in /register')
        res.status(500).json({message: err.message});
    }
}); 

router.put('/update', async (req, res) => {
    const {newName, newEmail,_id} = req.body;
    try{
        const userDoc = await User.findById(_id);
        if(userDoc){
            userDoc.name = newName;
            userDoc.email = newEmail;
            const savedDoc = await userDoc.save();
            res.json({message: 'User updated successfully', userDoc:{name: savedDoc.name, email: savedDoc.email, _id: savedDoc._id}}); 
        }
    }catch(err){
        console.log('Something went wrong in /update')
        res.status(500).json({message: err.message});
    }
});
 
router.post('/login', async (req, res) => { 
    const {email, password} = req.body;
    const userDoc = await User.findOne({email:email});
    if(userDoc){
        if(bcrypt.compareSync(password, userDoc.password)){
            res.json({userFound:true,validPassword:true, userDoc:{name: userDoc.name, email: userDoc.email, _id: userDoc._id}})
        }else{
            res.json({userFound:true , validPassword:false})
        }
    }else{
        res.json({userFound:false})   
    }
});
 
module.exports = router;
