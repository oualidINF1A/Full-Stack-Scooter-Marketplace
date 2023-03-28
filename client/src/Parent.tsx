import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'

const Parent = () => {
  return (
    <div>
        <Navbar />
        <div className='lg:mt-16 mt-28'>
        <Outlet />
        </div>
    </div>
  )
}

export default Parent