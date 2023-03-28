import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

interface User{
    name?: string,
    email?: string,
    _id?: string
}

interface Offer{
    owner:User,
    amount: number,
    date:string,
    _id: string,
}

interface Props{
    offer: Offer,
    isOwner: boolean
    user: User,  
    advert?: Advert, 
    setOffers: React.Dispatch<React.SetStateAction<Offer[]>>,
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

interface Offer{
    owner:User,
    amount: number,
    date:string,
    _id: string,
}

interface Advert {
    date?: string,
    title: string,
    zipCode: string,
    description: string,
    images: string[],
    offers: Offer[],
    offerPrice: number,
    price: number,
    owner: User,
    phone: string,
    scooter: Scooter,
    saves:string[]
    _id: string,
}

const Offer = ({offer, isOwner, user, advert, setOffers}:Props) => {
    const [showingOptions, setShowingOptions] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const navigate = useNavigate()

    const handleContacteer = async () => {
        if(!user._id || !advert?._id) return
        const res = await axios.post('/berichten/createChannel', {advertId: advert?._id, userId: offer.owner._id})
        if(!res.data.succes) return
            navigate('/berichten')
    }

    const handleDeleteOffer = async () => {
        setDeleting(true)
        if(!advert?._id || !offer._id) return
        const res  = await axios.post(`/advert/delete/offer/${offer._id}`, {advertId: advert._id})
        if(res.data.succes){
            setShowingOptions(false)
            setOffers(res.data.offers)
            return
        }
    }

    if(deleting) return (
        <div className='w-full'>Aan het verwijderen...</div>
    )

            

  return (
    <div className='w-full'>
        <div className='w-full border-b-2 py-2 flex justify-between px-1'>
            <span>{offer.owner.name}</span>
            <span>{
                new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(offer.amount)
                }</span>
            <span> {moment(offer.date).format('DD-MM-YYYY')}</span>
            {!isOwner && showingOptions && (
                <div className='cursor-pointer'
                onClick={() => setShowingOptions(!showingOptions)}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                    </svg>
                </div>
            )}

            {!isOwner && !showingOptions && (
                <div className='cursor-pointer' onClick={() => setShowingOptions(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
            )}

            {isOwner && showingOptions && 
            <div className='cursor-pointer'
            onClick={() => setShowingOptions(!showingOptions)}
            >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
            </div>
            }
            {isOwner && !showingOptions &&(
                <div className='cursor-pointer' onClick={() => setShowingOptions(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
                </div>

              
            )}

        </div>
        {
            showingOptions && (
                <div className='w-full flex gap-1'>
                    <button className='w-full primary_red_btn' onClick={handleDeleteOffer}>Verwijder</button>
                    {isOwner && (
                    <button className='w-full secondary_btn' onClick={handleContacteer}>Contacteer</button>
                    )}
                </div>
            )
        }
        
    </div>

  )
}

export default Offer