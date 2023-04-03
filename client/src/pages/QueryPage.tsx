import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import SelectedPageAdComponent from '../components/SelectedCategoryComponents/SelectedPageAdComponent'
import SearchBar from '../components/HomePageComponents/SearchBar'
import { TailSpin } from 'react-loader-spinner'
import { useLocation } from 'react-router-dom'
import { Advert } from '../types'
  

const QueryPage = () => {
    const { query } = useParams<{ query: string }>()
    const [adverts, setAdverts] = useState<Advert[]>([])
    const [currSort, setCurrSort] = useState<string>('populair')
    const [noAdverts, setNoAdverts] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(false)
    const {city} = useLocation().state as {city: string}


    const getAdverts = async () => {
        setLoading(true)
        const res = await axios.get(`/advert/query/${query}/${city}`)
        if(!res.data.succes) return
        setLoading(false)
        setAdverts(res.data.adverts)
        if(res.data.adverts.length > 0){
          setNoAdverts(false)
        }else{
          setNoAdverts(true)
        }
      }
    
    useEffect(() => {
        if(!query) return
        getAdverts()
    },[city])

    useEffect(() => {
      switch(currSort){
        case 'populair':
          setAdverts(adverts.sort((a,b) => b.saves.length - a.saves.length))
          break;
        case 'nieuw':
          setAdverts(adverts.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
          break;
        case 'prijs':
          setAdverts(adverts.sort((a,b) => b.price - a.price))
          break;
      }
    },[currSort])

    if(loading){
      return (
        <div className='w-full h-screen flex flex-col gap-4 items-center mt-16'>
          <TailSpin color='#000' height={100} width={100}/>
      </div>
      )
    }

    if(noAdverts){
      return (
        <div className='w-full h-screen flex flex-col gap-4 items-center mt-16'>
          <SearchBar/>
          <h1 className='text-2xl font-semibold'>Geen advertenties gevonden voor: {query} 
          {city !== "none" && ` in ${city}`}</h1>
        </div>
      )
    }

  return (
    <div className='w-full flex justify-center category_selected'>
    <div className='w-full flex justify-center items-center flex-col'>
      <div className='flex justify-center flex-col items-center w-full'>
      <SearchBar/>
        {adverts.length > 0 && (
            <div className='flex gap-2 mb-4'>

                <button className={currSort === 'populair' ? 'primary_btn' : 'secondary_btn'}
                disabled={currSort === 'populair' ? true : false}
                onClick={() => setCurrSort('populair')}>
                Populair</button>

                <button className={currSort === 'nieuw' ? 'primary_btn' : 'secondary_btn'}
                onClick={() => setCurrSort('nieuw')}
                disabled={currSort === 'nieuw' ? true : false}>
                Nieuw</button>

                <button className={currSort === 'prijs' ? 'primary_btn' : 'secondary_btn'}
                onClick={() => setCurrSort('prijs')}
                disabled={currSort === 'prijs' ? true : false}>
                Prijs</button>
            
            </div>
        )}
      </div>


    <div className='w-full lg:hidden block'>
    {adverts.map((advert: Advert) => (
        <SelectedPageAdComponent advert={advert} key={advert._id}/>
    ))}
    </div>
    <div className='w-4/5 lg:block hidden'>
    {adverts.map((advert: Advert) => (
        <SelectedPageAdComponent advert={advert} key={advert._id}/>
    ))}
    </div>
    </div>

</div>
  )
}

export default QueryPage