import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import HomePageSidebar from '../components/HomePageComponents/HomePageSidebar'
import { userContext } from '../context/UserContext'
import axios from 'axios'
import HomePageAd from '../components/HomePageComponents/HomePageAd'
import { TailSpin } from 'react-loader-spinner'
import SearchBar from '../components/HomePageComponents/SearchBar'
import Footer from '../components/Footer'
import { Divide, SkipBack } from 'react-feather'

interface User{
  name?: string,
  email?: string,
  _id?: string
}

interface Scooter{
  brand: string,
  model: string,
  yearOfConstruction: string,
  mileage:string,
  licensePlateType: string,
  cylinderCapacity: string,
  condition: string,
  _id: string,
}

interface Advert {
  date: string,
  title: string,
  zipCode: string,
  description: string,
  images: string[],
  offerPrice: number,
  price: number,
  owner: User,
  phone: string,
  scooter: Scooter,
  _id: string,
}

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

interface Props{
  categories: ScooterCategory[]
}


const HomePage = ({categories}:Props) => {
  const {user} = useContext(userContext)
  const [adverts, setAdverts] = useState<Advert[]>([])
  const [loading, setLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [fetchingMorePosts, setFetchingMorePosts] = useState(false)
  const loadingAdverts = [...Array(15)]
  const [skip, setSkip] = useState(0)

  const fetchMorePosts = async () => {
    setSkip(skip + adverts.length)
    const res = await axios.post('/advert/all', {skip: skip})
    if(!res.data.succes) return
    setAdverts([...adverts, ...res.data.adverts]);
    setFetchingMorePosts(false)
  }

  window.onscroll = function() {
    if(fetchingMorePosts) return
    if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2) {
      fetchMorePosts()
      setFetchingMorePosts(true)
    }
   }

  const getAdverts = async () => {
    const res = await axios.post('/advert/all', {skip: 0})
    if(!res.data.succes) return

    setAdverts(res.data.adverts) 
    setSkip(res.data.adverts.length)
    setLoading(false)
    setDataLoaded(true)

  }

  useEffect(() => {
    if(dataLoaded) return
    setLoading(true)
    getAdverts()
  }, [])

  if(loading) return (
    <div className='flex flex-col gap-4'>
      <div className='w-screen flex mt-24'>
          <div className='w-full flex mx-8 justify-center -mt-24 '>
            <SearchBar/>
          </div>
            <div id='homepage_adverts' 
              className='w-full min-w-[300px] lg:left-72 left-0 max-w-fit right-0 px-8 flex-wrap flex gap-4 lg:border-l-2 border-gray-400 overflow-auto absolute'>
                {loadingAdverts.map((_, index) => (
                  <div key={index}>
                          <div className=' bg-white shadow-md w-fit py-2 px-2 lg:min-w-[220px] lg:h-[220px] 
                          flex flex-col gap-2
                          h-[150px] min-w-[150px]'>
                            <div className='w-full lg:h-[150px] h-[100px] bg-gray-300'/>
                            <h1 className='bg-gray-200 h-[50px] w-full'></h1>
                        </div>
                  </div>
                ))}
            </div>
      </div>
    </div>

  )
  return (
    <div className='flex flex-col gap-4'>
      
      <div className='w-full flex mx-8 justify-center'>
        <SearchBar/>
      </div>

      <div className='flex md:flex-row gap-2 px-4 pb-32'>
        <div className=' lg:block hidden'>
        <HomePageSidebar categories={categories} />
        </div>
        
        <div>
          <div id='homepage_adverts' 
          className='w-full min-w-[300px] lg:left-72 left-0 max-w-fit right-0 px-8 flex-wrap flex gap-4 lg:border-l-2 border-gray-400 overflow-auto absolute'>
            {adverts.map((advert, index) => (
              <HomePageAd key={index} advert={advert} />
            ))}
            {fetchingMorePosts && adverts.length > 0 && (
              <div className='w-full flex justify-center'>
                <TailSpin color='gray' height={50} width={50} />
              </div>
            )}
        </div>


        </div>

      </div>
    </div>

  )
}

export default HomePage