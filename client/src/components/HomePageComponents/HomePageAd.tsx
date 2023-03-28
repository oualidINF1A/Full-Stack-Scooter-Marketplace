import React from 'react'
import { Link } from 'react-router-dom'

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

interface Props {
    advert: Advert
}

const HomePageAd = ({advert}:Props) => {
  return (
    <Link to={`/advert/${advert._id}`}>
      <div className=' bg-white shadow-md w-fit lg:min-w-[220px] min-w-[150px]'>
        <img src={advert.images[0]} alt="" className='lg:w-[220px] lg:h-[220px] w-[150px] h-[150px] object-cover' />
        <div className='p-1'>
          <h1 className='md:text-lg text-sm text-indigo-500'>{advert.title}</h1>
          <span className='text-md font-bold'>{
              new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(advert.price)}
          </span>
        </div>
      </div>

    </Link>
  )
}

export default HomePageAd