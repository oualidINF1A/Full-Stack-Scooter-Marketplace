import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import moment from 'moment'
import { Advert } from '../../types'

interface Props {
    advert: Advert
}

const SelectedPageAdComponent = ({advert}:Props) => {
    const navigate = useNavigate()

  return (
    <>
        {/* Desktop view */}
        <div className="md:flex hidden border max-h-[220px] min-h-fit justify-between px-2 py-1 bg-white rounded-md">
            <div className='flex gap-4'>
                <div className='bg-gray-100 border rounded-sm max-w-fit cursor-pointer' onClick={() => navigate(`/advert/${advert._id}`)}>
                    <img src={advert.images[0]} alt="" className='max-h-[200px] h-[200px] max-w-[200px] w-[200px] object-contain' />
                </div>

                <div className='flex flex-col justify-between py-2'>
                    <div className=''>
                        <Link to={`/advert/${advert._id}`} className='text-lg font-semibold text-indigo-500 hover:underline'>{advert.title}</Link>
                        <p className='md:max-w-[500px] max-w-[100px]'>{advert.description}</p>
                    </div>
                    {advert.scooter && (
                    <div className='flex gap-1 font-semibold'>
                        <p className='text-gray-600'>{advert.scooter.model}</p> | 
                        <p className='text-gray-600'>{advert.scooter.condition}</p> |
                        <p className='text-gray-600'>{advert.scooter.yearOfConstruction}</p> 
                    </div>
                    )}

                    {advert.scooterPart && (
                    <div className='flex gap-1 font-semibold'>
                        <p className='text-gray-600'>{advert.scooterPart.typeOfPart}</p> | 
                        <p className='text-gray-600'>{advert.scooterPart.condition}</p> |
                    </div>
                    )}


                </div>
            </div>

            <div className='flex gap-4'>
                <div className='flex flex-col items-end'>
                    <p className='font-semibold'>{
                        new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(advert.price)
                    }</p>
                    <p className='text-gray-600'>{moment(advert.date).format('DD-MM-YYYY')}</p>
                    <span className='text-gray-600 gap-2 flex items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                            {advert.saves.length}
                        </span>
                </div>
                <p className='font-semibold'>{advert.owner.name}</p>
            </div>
        </div>

        {/* Mobile View */}
        <div className='md:hidden flex border max-h-[220px] min-h-fit justify-between px-2 py-1
        w-full
        bg-white rounded-sm'>
            <div className='flex gap-4 w-full'>
                <div className='bg-gray-100 border rounded-sm max-w-fit cursor-pointer' onClick={() => navigate(`/advert/${advert._id}`)}>
                    <img src={advert.images[0]} alt="" className='max-h-[125px] h-[125px] max-w-[125px] w-[125px] object-contain' />
                </div>
                <div className='flex justify-between w-full'>
                    <div className='flex flex-col h-full justify-between py-2'>
                        <div className=''>
                            <Link to={`/advert/${advert._id}`} className='text-lg font-semibold text-indigo-500 hover:underline'>{advert.title}</Link>
                            <p className='max-w-[100px]'>{
                                new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(advert.price)
                            }</p>
                        </div>
                        <div className='flex gap-2 text-xs'>
                            {advert.showCity && <p className='text-gray-600'>{advert.city} |</p> }
                            {advert.scooter && <p className='text-gray-600'>{advert.scooter.model}</p>}
                        </div>
                    </div>
                    <div className='flex flex-col justify-between text-xs'>
                        <span className='text-gray-600 gap-2 flex items-center justify-end'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                            {advert.saves.length}
                        </span>
                        <span className='text-indigo-500 gap-2 flex items-center'>
                            {moment(advert.date).format('DD-MM-YYYY') === moment().format('DD-MM-YYYY') ? 'Vandaag' : moment(advert.date).format('DD-MM-YYYY')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default SelectedPageAdComponent