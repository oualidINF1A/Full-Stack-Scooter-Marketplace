import React from 'react'
import { Link } from 'react-router-dom'
import { Advert } from '../../types'

interface Props {
    advert: Advert
}

const HomePageAd = ({advert}:Props) => {
  return (
    <Link to={`/advert/${advert._id}`} className='shadow-sm shadow-blue-500'>
      <div className=' bg-white shadow-md w-fit lg:min-w-[220px] min-w-[150px]'>
        <div className='flex justify-center bg-gray-200'>
        <img src={advert.images[0]} alt="" className='lg:w-[220px] lg:h-[220px] w-[150px] h-[150px] 
        object-cover bg-gray-400' />
        </div>
        <div className='px-1'>
          <h1 className='md:text-lg text-sm lg:max-w-[220px] max-w-[150px] text-indigo-500 truncate'>{advert.title}</h1>
          <span className='text-md font-bold'>{
              new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(advert.price)}
          </span>
        </div>
      </div>

    </Link>
  )
}

export default HomePageAd