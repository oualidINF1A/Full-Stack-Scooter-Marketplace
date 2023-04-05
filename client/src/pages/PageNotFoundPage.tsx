import React from 'react'
import { useNavigate } from 'react-router-dom'

const PageNotFoundPage = () => {

    const navigate = useNavigate()

  return (
    <div className='w-screen h-screen overflow-hidden flex justify-center items-center -mt-32'>
        <div className='w-1/2 h-1/2 flex flex-col justify-center items-center'>
            <h1 className='text-4xl font-semibold'>404</h1>
            <h1 className='text-2xl font-semibold'>Pagina niet gevonden</h1>
            <button
            onClick={() => navigate('/')}
            className='primary_btn mt-4'>Terug naar startpagina</button>
        </div>
    </div>

  )
}

export default PageNotFoundPage