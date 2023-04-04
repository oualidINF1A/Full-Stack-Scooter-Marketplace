import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'

const Parent = () => {
  return (
      <div className='lg:mt-16 mt-28'>
        <Outlet />
      </div>
  )
}

export default Parent