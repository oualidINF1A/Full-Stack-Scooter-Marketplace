import React, { useEffect, useState } from 'react'
import {TailSpin} from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import axios from 'axios'

interface Props{
    user: {
        name?: string,
        email?: string,
        _id?: string
    }
}

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

const MijnAdvertenties = ({user}:Props) => {
    const [adverts, setAdverts] = useState<[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [deleting, setDeleting] = useState<boolean>(false)
    const [dataLoaded, setDataLoaded] = useState<boolean>(false)
    const navigate = useNavigate()
    

    if(!user) return (
        <div className='flex justify-center items-center'>
            <TailSpin color='gray' height={100} width={100} />
        </div>
    )

    const getAdverts = async () => {
        if(adverts.length > 0) return
        setLoading(true)
        const res = await axios.get(`/advert/userAdverts/${user._id}`)
        setAdverts(res.data.adverts)
        setLoading(false)
    }

    const handleDelete = async (id:string) => {
        if(deleting) return
        setDeleting(true)
        const res = await axios.get(`/advert/delete/${id}`)
        setDeleting(false)
        if(res.data.succes){
            navigate('/profile/profiel')
        }
    }


    useEffect(() => {
        if(!user._id || dataLoaded ) return
        setDataLoaded(true)
        getAdverts() 
    }, [user])

    if(loading ) return (
            <div className='flex w-screen justify-center items-center mt-16'>
                <TailSpin color='gray' height={100} width={100} />
            </div>
    )

    if(deleting) return (
        <div className='flex w-screen justify-center items-center mt-16'>
            <TailSpin color='red' height={100} width={100} />
        </div>
    )

  return (
    <div className='w-full flex justify-center'>
        {adverts.length > 0 ? (
        <div className='md:w-2/3 mt-4 flex flex-col gap-4 py-2'>
        {adverts.map((advert:Advert, index) => (
            <div key={index} className='flex flex-col bg-white shadow-md w-full gap-4 p-4'>
                <div className='flex gap-1 items-center'>
                    <div className='w-full flex justify-between md:px-8 gap-2'>
                        <button className='secondary_btn' onClick={() => navigate(`/advert/${advert._id}`)}>Bekijk</button>
                        <button className='primary_red_btn' onClick={() => handleDelete(advert._id)}>Verwijder</button>
                    </div>

                </div>

                <div className='flex w-full justify-between md:px-8 items-start cursor-pointer'>
                    <img src={advert.images[0]} alt="foto" className=' w-[120px] h-[140px] object-contain rounded-md' 
                    onClick={() => navigate(`/advert/${advert._id}`)}
                    />
                    <div className='md:flex hidden w-full justify-around'>
                        <div className='flex flex-col'>
                            <span className='text-md font-bold'>{advert.title}</span>
                            <span className='text-sm'>{advert.scooter.brand} ,{advert.scooter.model}</span>
                            <span className='text-sm'>{advert.scooter.mileage} km</span>
                            <span className='text-md text-indigo-500 font-bold'>{
                                 new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(advert.price)
                            }</span>
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-sm'>{advert.scooter.licensePlateType} kenteken</span>
                            <span className='text-sm'>{advert.scooter.cylinderCapacity} cc</span>
                            <span className='text-sm'>{advert.scooter.condition}</span>
                            <span className='text-sm font-bold italic'>{moment(advert.date).format('DD-MM-YYYY')}</span>
                        </div>

                    </div> 
                </div>
            </div>
            )
        )}
        </div>
        ):(
            <div className='flex flex-col gap-4 mt-16'>
                <span className='text-2xl font-bold'>Je hebt nog geen advertenties geplaatst</span>
                <button className='primary_btn' onClick={() => navigate('/advertentie_plaatsen')}>Plaats een advertentie</button>
            </div>
        )}

    </div>
  )
}

export default MijnAdvertenties