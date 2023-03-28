import moment from 'moment'
import React from 'react'
import axios from 'axios'

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

interface ChannelComponentProps{
  channel: Channel,
  activeChannel: string,
  setActiveChannel: (id: string) => void
  user:{
    _id?: string
    name?: string
  }
  mobileShow: string,
  setMobileShow?: (show: string) => void
}

const ChannelComponent = ({channel, activeChannel, setActiveChannel, user, mobileShow, setMobileShow}:ChannelComponentProps) => {

    const handleChannelClick = async () => {
      if(!setMobileShow) return
        setMobileShow('chat')  
        setActiveChannel(channel._id)
    }



  return (
    <div className={activeChannel === channel._id ? 'bg-indigo-200 channel_component' : 'bg-white channel_component'}
    onClick={handleChannelClick}
    >
        <div className='relative top-0 left-0 h-[80px] w-[80px] max-h-[80px] max-w-[80px]'>
            <img src={channel.advert.images[0]} alt="" className='relative top-0 h-[80px] w-[80px] left-0 object-cover rounded-2xl'/>
            <div className='rounded-full h-10 w-10  bg-gray-100  border flex items-center justify-center text-2xl
            absolute top-[50%] right-0 transform translate-x-1/2 -translate-y-1/2
            '>{channel.advert.owner.name[0]}</div>
        </div>
        <div className='w-full'>
            <h1>
                {channel.advert.title}
            </h1>
            <h1 className='font-semibold'>
              gesprek met {channel.participants.filter(participant => participant._id !== user._id)[0].name}
            </h1>
            <h1 className='text-sm text-end'>
            {moment(Date.now()).format('DD-MM-YYYY')}
            </h1>
        </div>
    </div>
  )
}

export default ChannelComponent