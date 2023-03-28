import React from 'react'
interface Props {
    children: JSX.Element[]
}


const Modal = ({children:slides}:Props) => {
  return (
    <div className='absolute top-0 left-0 right-0 bottom-0'>
        {slides}
    </div>
  )
}

export default Modal