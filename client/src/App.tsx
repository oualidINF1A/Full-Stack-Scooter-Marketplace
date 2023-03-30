import { useEffect } from 'react'
import axios from 'axios'	
import {Routes, Route} from 'react-router-dom'
import BerichtenPage from './pages/BerichtenPage'
import HomePage from './pages/HomePage'
import HulpEnInfoPage from './pages/HulpEnInfoPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Parent from './Parent'
import ProfilePage from './pages/ProfilePage'
import PostAdvertPage from './pages/PostAdvertPage'
import { AdvertPage } from './pages/AdvertPage'
import CategorySelectedPage from './pages/CategorySelectedPage'
import QueryPage from './pages/QueryPage'


axios.defaults.baseURL = 'http://localhost:3030/'
axios.defaults.baseURL = import.meta.env.VITE_AXIOS_BASE_URL
axios.defaults.withCredentials = true

function App() {

  
  interface Model {
    name: string;
  }

  interface ScooterBrand {
    name: string;
    models: { [key: string]: Model };
  }

  interface ScooterCategory {
    id: number;
    name: string;
    subcategories: ScooterBrand[];
  }

  const categories: ScooterCategory[] = [
    {
      id: 1,
      name: 'Scooters',
      subcategories: [
        {
          name: 'Peugeot',
          models: {
            '1.1': { name: 'Peugeot Speedfight' },
            '1.2': { name: 'Peugeot Vivacity' },
            '1.3': { name: 'Peugeot Ludix' },
            '1.4': { name: 'Peugeot Satelis' },
            '1.5': { name: 'Peugeot Trekker' },
            '1.6': { name: 'Peugeot Metropolis' },
            '1.7': { name: 'Peugeot XPS' },
            '1.8': { name: 'Peugeot XPS Cross' },
            '1.9': { name: 'Peugeot XPS Sport' },
            '1.10': { name: 'Peugeot Django' },
            '1.11': { name: 'Peugeot Tweet' },
            '1.12': { name: 'Peugeot Kisbee' },
            '1.13': { name: 'Peugeot Elyseo' },
            '1.14': { name: 'Peugeot Elystar' },
            '1.15': { name: 'Peugeot Jet Force' },            
          },
        },
        {
          name: 'Piaggio',
          models: {
            '3.1': { name: 'Piaggio Zip' },
            '3.2': { name: 'Piaggio Fly' },
            '3.3': { name: 'Piaggio MP3' },
            '3.4': { name: 'Piaggio Liberty' },
            '3.5': { name: 'Piaggio Beverly' },
            '3.6': { name: 'Piaggio Medley' },
            '3.7': { name: 'Piaggio X9' },
            '3.8': { name: 'Piaggio Typhoon' },
            '3.9': { name: 'Piaggio BV' },
            '3.11': { name: 'Piaggio X8' },
            '3.12': { name: 'Piaggio X7' },
            '3.13': { name: 'Piaggio X-Evo' },
            '2.1': { name: 'Vespa Primavera' },
            '2.2': { name: 'Vespa Sprint' },
            '2.3': { name: 'Vespa GTS' },
            '2.4': { name: 'Vespa LX' },
            '2.5': { name: 'Vespa S' },
            '2.6': { name: 'Vespa ET' },
          },
        },
        {
          name: 'SYM',
          models: {
            '4.1': { name: 'SYM Fiddle' },
            '4.2': { name: 'SYM Jet' },
            '4.3': { name: 'SYM Symphony' },
            '4.4': { name: 'SYM Crox' },
            '4.5': { name: 'SYM Allo' },
            '4.6': { name: 'SYM Wolf' },
            '4.7': { name: 'SYM Orbit' },
            '4.8': { name: 'SYM Orbit II' },
          },
        },
        {
          name: 'Kymco',
          models: {
            '5.1': { name: 'Kymco Agility' },
            '5.2': { name: 'Kymco Super 8' },
            '5.3': { name: 'Kymco People S' },
            '5.4': { name: 'Kymco New Dink' },
            '5.5': { name: 'Kymco Like' },
            '5.6': { name: 'Kymco Downtown' },
          },
        },
        {
          name: 'Yamaha',
          models: {
            '6.1': { name: 'Yamaha Aerox' },
            '6.2': { name: 'Yamaha Neo\'s' },
            '6.3': { name: 'Yamaha Jog' },
            '6.4': { name: 'Yamaha X-Max' },
            '6.5': { name: 'Yamaha T-Max' },
            '6.6': { name: 'Yamaha Vino' },
            '6.7': { name: 'Yamaha Majesty' },
            '6.8': { name: 'Yamaha Vity' },
            '6.9': { name: 'Yamaha X-City' },            
          },
        },
        {
          name: 'Honda',
          models: {
            '7.1': { name: 'Honda PCX' },
            '7.2': { name: 'Honda Forza' },
            '7.3': { name: 'Honda Vision' },
            '7.4': { name: 'Honda SH' },
            '7.5': { name: 'Honda Zoomer' },
            '7.6': { name: 'Honda Silverwing' },
            '7.7': { name: 'Honda Integra' },

          },
        },
        {
          name: 'Kawasaki',
          models: {
            '8.1': { name: 'Kawasaki J125' },
            '8.2': { name: 'Kawasaki J300' },
            '8.3': { name: 'Kawasaki J50' },
          },
        },
        {
          name: 'Suzuki scooters',
          models: {
            '9.1': { name: 'Suzuki Address' },
            '9.2': { name: 'Suzuki Burgman' },
            '9.3': { name: 'Suzuki Let\'s' },
            '9.4': { name: 'Suzuki Skywave' },
            '9.5': { name: 'Suzuki V-Strom' },
          },
        },
        {
          name: 'Aprilia',
          models: {
            '10.1': { name: 'Aprilia SR' },
            '10.2': { name: 'Aprilia Scarabeo' },
            '10.3': { name: 'Aprilia Mojito' },
            '10.4': { name: 'Aprilia Atlantic' },
            '10.5': { name: 'Aprilia Shiver' },
            '10.6': { name: 'Aprilia Mana' },
            '10.7': { name: 'Aprilia Caponord' },
            '10.8': { name: 'Aprilia Dorsoduro' },
            '10.9': { name: 'Aprilia Tuono' },
            '10.10': { name: 'Aprilia RSV' },
            '10.11': { name: 'Aprilia RS' },
            '10.12': { name: 'Aprilia SXV' },
            '10.13': { name: 'Aprilia Tuareg' },
        }
      },
      {
        name:'Tomos',
        models: {
          '11.1': { name: 'Tomos A' },
          '11.2': { name: 'Tomos M' },
          '11.3': { name: 'Tomos Sprint' },
          '11.4': { name: 'Tomos Streetmate' },
          '11.5': { name: 'Tomos Targa' },
          '11.6': { name: 'Tomos Targa LX' },
           }
      },
      ],
    },
  ];



  return (
    <Routes>
      <Route path="/" element={<Parent/>}>
        <Route path="/" element={<HomePage categories={categories}/>} />
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/hulp_en_info" element={<HulpEnInfoPage/>} />
        <Route path="/berichten" element={<BerichtenPage/>} />
        <Route path="/profile/:choice" element={<ProfilePage/>} />
        <Route path='/advertentie_plaatsen' element={<PostAdvertPage categories={categories}/>} />
        <Route path='/advert/:id' element={<AdvertPage />}/>
        <Route path='/account/:id' element={<ProfilePage/>}/>
        <Route path='/category/:brand/:model' element={<CategorySelectedPage/>}/>
        <Route path='/search/q/:query' element={<QueryPage/>}/>
      </Route>
      <Route path="*" element={<div>PAGE NOT FOUND ERROR 404</div>} />
    </Routes>
  )
}

export default App
