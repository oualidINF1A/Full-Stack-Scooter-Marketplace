import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { TailSpin } from 'react-loader-spinner'
import moment from 'moment'
import SelectedPageAdComponent from '../components/SelectedCategoryComponents/SelectedPageAdComponent'
import { Advert } from '../types'





const CategorySelectedPage = () => {
    const {category , brand, model, query} = useParams()
    const [adverts, setAdverts] = useState<Advert[]>([])
    const [fetchingData, setFetchingData] = useState<boolean>(false)
    const [currSort, setCurrSort] = useState<string>('')

    const getAdverts = async () => {
        setFetchingData(true)
        try {
            const response = await axios.get(`/advert/adverts/${category}/${brand}/${model}`)
            if(response.data.succes){
                setCurrSort('nieuw')
                setAdverts(response.data.adverts)
            }
            setFetchingData(false)
        } catch (error) {
            console.log(error)
        }
    }

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

    useEffect(() => {
        if(!brand || !model || !category) return
        getAdverts()
    }, [])

    if(fetchingData) return (
        <div className='w-full h-screen flex justify-center items-center'>
            <TailSpin color='gray' height={100} width={100} />
        </div>
    )

    if(adverts.length === 0) return (
        <div className='w-full h-screen -mt-36 flex justify-center items-center'>
            <h1 className='text-3xl'>Geen advertenties gevonden voor : {brand}, {model}</h1>
        </div>
    )



  return (
    <div className='w-full flex justify-center category_selected'>
        <div className=' flex flex-col'>
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

        {adverts.map((advert: Advert, index:number) => (
            <SelectedPageAdComponent advert={advert} key={index}/>
        ))}
        </div>

    </div>
  )
}

export default CategorySelectedPage