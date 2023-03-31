import React, { useEffect } from 'react'
import ChannelComponent from './ChannelComponent'
import { useState } from 'react'
import { userContext } from '../../context/UserContext'
import { useContext } from 'react'
import ChannelMessage from './ChannelMessage'

interface Message{
    message: string,
    owner: {
      _id: string,
      name: string
    }
    date: string
  
  }
  
  interface ChannelAdvert{
    images: string[],
    title: string,
    price: number,
    owner:{
      name: string,
      _id: string
    }
    _id: string
  }
  
  interface participant{
    name: string,
    _id: string
  }
  
interface Channel{
    advert: ChannelAdvert,
    date: string,
    messages: Message[],
    participants: participant[],
    _id: string
  }

interface Props{
    channels: Channel[],
    activeChannel: string,
    setActiveChannel: (channel: string) => void
    mobileShow?: string,
    setMobileShow?: (show: string) => void  
}


const BerichtenSidebar = ({channels ,activeChannel, setActiveChannel, mobileShow='', setMobileShow}:Props) => {
    const {user} = useContext(userContext)

  return (
    <div className='min-w-[400px] max-w-full w-[400px] max-h-[500px] overflow-x-hidden overflow-y-auto h-[500px] shadow-md '>
        <div className='flex flex-col'>
            {channels.map((item, index) => (
                <ChannelComponent key={index} channel={item} activeChannel={activeChannel} setActiveChannel={setActiveChannel}  user={user}
                mobileShow={mobileShow} setMobileShow={setMobileShow}
                />
            ))}
        </div>
    </div>
  )
}

export default BerichtenSidebar