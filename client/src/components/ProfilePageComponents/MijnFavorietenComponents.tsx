import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { TailSpin } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import FavoriteAdComponent from './FavoriteAdComponent'
import { Advert } from '../../types'

interface Props{
    user: {
        name?: string,
        email?: string,
        _id?: string
    }
}



const MijnFavorietenComponents = ({user}:Props) => {
    const [favorites, setFavorites] = useState<Advert[]>()
    const navigate = useNavigate()

    const getFavorites = async () => {
        const res = await axios.get(`/advert/saved/${user._id}`)
        setFavorites(res.data.adverts)
    }
    
    
    useEffect(() => {
        if(!user._id){
            return
        }

        getFavorites()

    }, [user])

    if(!favorites) return (
        <div className='flex justify-center w-screen items-center h-[200px]'>
            <TailSpin color='gray'/>
        </div>
    )

    if(favorites.length === 0) return (
        <div className='w-full flex justify-center'>
            <div className='flex flex-col gap-4 mt-16'>
                <span className='text-2xl font-bold'>Je hebt nog geen favorieten advertenties</span>
                <button className='primary_btn' onClick={() => navigate('/')}>Bekijk advertenties</button>
            </div>
        </div>

    )


  return (
    <div>
        <div className='flex items-center flex-col gap-4 w-full my-8'>
            {favorites.map((favorite, index) => (
                <FavoriteAdComponent advert={favorite} key={index} user={user} getFavorites={getFavorites}/>
            ))}
        </div>
    </div>
  )
}

export default MijnFavorietenComponents