import React from 'react'

interface Props{
    text: string
}

const ErrorMessage = ({text}:Props) => {
  return (
    <p className='text-red-500 border-2 border-red-500 text-center px-2'>{text}</p>
  )
}

export default ErrorMessage