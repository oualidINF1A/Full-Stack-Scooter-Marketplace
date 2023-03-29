const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
dotenv.config();
const cors = require('cors');
const axios = require('axios');



const app = express();

app.use(bodyParser.json({
    limit: '50mb'
  }));
  
  app.use(bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true 
  }));
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173', 'https://6423209e92c8ad006798b1bb--bejewelled-centaur-26079f.netlify.app']

}));


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(cors())
app.use( express.json());

const AuthRoute = require('./routes/AuthRoute.js');
const AdvertRoute = require('./routes/AdvertRoute.js');
const MessageRoute = require('./routes/BerichtenRoute.js');

app.get('/checkZipCode/:zipCode/:houseNumber', async (req, res) => {
    const zipCode = req.params.zipCode;
    const houseNumber = req.params.houseNumber;
    try{
      const response = await axios.get(`https://json.api-postcode.nl?postcode=${zipCode}&number=${houseNumber}`, {
        headers: {
          token: 'aa2bcc27-5503-4eba-a8df-195f1948e7b6'	
        }
      });
      res.json({success: true, data: response.data})
    }catch(err){
      res.json({success: false, message: err.message})
    }

    
    

}); 




app.use('/advert',AdvertRoute )
app.use('/auth', AuthRoute);
app.use('/berichten', MessageRoute);


app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});

