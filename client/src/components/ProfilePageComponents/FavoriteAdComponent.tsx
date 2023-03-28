import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import ErrorMessage from '../ErrorMessage'



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

interface Props{
    advert: Advert,
    user:User
    getFavorites: () => void
}

const FavoriteAdComponent = ({advert, user, getFavorites}:Props) => {
    const navigate = useNavigate()
    const [successfullDelete, setSuccessfullDelete] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const handleDelete = async () => {
        setLoading(true)
        const res = await axios.post('/advert/favorites/delete', {advertId: advert._id, userId: user._id})
        if(res.data.succes){
            setSuccessfullDelete(true)
            setTimeout(() => {
                setLoading(false)
                setSuccessfullDelete(false)
            }, 200)
            getFavorites()
            navigate('/profile/favorieten')
            return
        }else{
            console.log('something went wrong')
            setLoading(false)
            return
        }
    }

    if(loading) return (
        <div className='flex justify-center items-center'>
            {successfullDelete ? <ErrorMessage text='Advertentie verwijderd.'/> : <p>Aan het verwijderen.....</p>}
        </div>
    )

    const handleContacteer = async () => {
        if(!user._id || !advert?._id) return
        const res = await axios.post('/berichten/createChannel', {advertId: advert?._id, userId: user._id})
        if(!res.data.succes) return
            navigate('/berichten')
    }

  return (
    <div className='w-full flex flex-col items-center'>
        <div className='bg-white w-2/3 flex justify-around py-1.5 px-2 rounded-lg'>
        <div className='w-full'>
            <span className='text-center font-semibold'>
                {advert.title}
            </span>

            <img src={advert.images[0]} alt="image"  className='w-[100px] h-[100px] object-cover cursor-pointer'
            onClick={() => navigate(`/advert/${advert._id}`)}
            
            />
        </div>
        <div className='w-full'>
            <button className='primary_red_btn w-full hover:text-red-200' onClick={handleDelete}>Verwijder</button>
            <button className='secondary_btn w-full' onClick={handleContacteer}>Contacteer</button>
        </div>
    </div>

    </div>

  )
}

export default FavoriteAdComponent