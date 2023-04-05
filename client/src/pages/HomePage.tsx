import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import HomePageSidebar from '../components/HomePageComponents/HomePageSidebar'
import { userContext } from '../context/UserContext'
import axios from 'axios'
import HomePageAd from '../components/HomePageComponents/HomePageAd'
import { TailSpin } from 'react-loader-spinner'
import SearchBar from '../components/HomePageComponents/SearchBar'
import {ScooterCategory, Advert} from '../types'
interface Props{
  categories: ScooterCategory[]
}


const HomePage = ({categories}:Props) => {
  const {user} = useContext(userContext)
  const [adverts, setAdverts] = useState<Advert[]>([])
  const [loading, setLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [fetchingMorePosts, setFetchingMorePosts] = useState(false)
  const [noMorePostsInDatabase, setnoMorePostsInDatabase] = useState(false)
  const loadingAdverts = [...Array(15)]
  const [skip, setSkip] = useState(0)

  const fetchMorePosts = async () => {
    setSkip(skip + adverts.length)
    const res = await axios.post('/advert/all', {skip: skip})
    if(!res.data.succes) return
    if(res.data.adverts.length === 0) return setnoMorePostsInDatabase(true)
    setAdverts([...adverts, ...res.data.adverts]);
    setFetchingMorePosts(false)
  }

  window.onscroll = function() {
    if(fetchingMorePosts || noMorePostsInDatabase ) return
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

  if(loading && !noMorePostsInDatabase) return (
    <div className='flex flex-col gap-4'>
        <div className='w-full flex justify-center'>
            <SearchBar/>
        </div>
      <div className='flex'>
          <div className='flex gap-4'>
            <div className='lg:block hidden absolute lg:left-4'>
              <HomePageSidebar categories={categories} />
            </div>  
            <div id='homepage_adverts' 
                className='w-full min-w-[300px] lg:left-72 left-0 max-w-fit right-0 px-8 flex-wrap flex 
                lg:gap-4 gap-2 lg:border-l-2 border-blue-500 overflow-auto absolute'>
                    {loadingAdverts.map((_, index) => (
                      <div key={index} className=''>
                        <div className='lg:w-[220px] lg:h-[220px] w-[150px] h-[150px] bg-gray-300' ></div>
                        <div className=' bg-gray-200 h-[50px] flex justify-center items-center'>
                      </div>
                    </div>
                  ))}
              </div>
          </div>

      </div>
    </div>

  )
  return (
    <div className='flex flex-col gap-4 h-screen'>
      
      <div className='w-full flex justify-center'>
        <SearchBar/>
      </div>

      <div className='flex md:flex-row gap-2 px-4 pb-32'>
        <div className=' lg:block hidden'>
        <HomePageSidebar categories={categories} />
        </div>
        
        <div>
          <div id='homepage_adverts' 
          className='w-full min-w-[300px] lg:left-72 left-0 max-w-fit right-0 px-8 flex-wrap flex lg:gap-4 gap-2 
          lg:border-l-2 border-blue-500 overflow-auto absolute md:justify-start justify-center'>
            {adverts.map((advert, index) => (
              <HomePageAd key={index} advert={advert} />
            ))}
            {noMorePostsInDatabase && adverts.length > 0 && (
              <div className='w-full flex justify-center'>
                <p className='text-gray-500 py-4'>Geen advertenties meer</p>
              </div>

            )}
            {fetchingMorePosts && adverts.length > 0 && !noMorePostsInDatabase && (
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