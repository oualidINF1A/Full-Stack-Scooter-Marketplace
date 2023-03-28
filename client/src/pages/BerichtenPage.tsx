import React, {useContext, useEffect, useState} from 'react'
import BerichtenSidebar from '../components/BerichtenPageComponents/BerichtenSidebar'
import ChannelMessage from '../components/BerichtenPageComponents/ChannelMessage'
import { userContext } from '../context/UserContext'
import axios from 'axios'
import { TailSpin } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'

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

const BerichtenPage = () => {
  const [activeChannel, setActiveChannel] = useState('')
  const [channels, setChannels] = useState<Channel[]>([])
  const {user} = useContext(userContext)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [reloaded, setReloaded] = useState(false)
  const [messaging, setMessaging] = useState<boolean>(false)
  const [mobileShow, setMobileShow] = useState<string>('channels')
  const navigate = useNavigate()

  const getChannels = async (activeChannel='') => {
    const {data} = await axios.get(`/berichten/channels/${user._id}`)
    setLoading(false)
    setChannels(data.channels)
    if(activeChannel === ''){
      setActiveChannel(data.channels[0]._id)
    }else{
      setActiveChannel(activeChannel)
    }
  }

  useEffect(() => {
    if(!user?._id) return
    setLoading(true)
    getChannels()

  },[user])

  const handleNewMessage = async () => {
    if(!user?._id || messaging) return
    setMessaging(true)
    if(message === '') return
    const {data} = await axios.post(`/berichten/newmessage/${activeChannel}`, {message, userId: user._id})
    setMessage('')
    getChannels(activeChannel)
    setMessaging(false)
  }

  useEffect(() => {
    if(!user?._id) return
    axios.post(`/berichten/readmessages`, {userId: user._id}).
    catch((err) => {
      console.log(err)})
  }, [user])

  
  const getActiveChannel = ():Channel => {
    const activeChannelData = channels.find(item => item._id === activeChannel)
    if(!activeChannelData) return channels[0]
    return activeChannelData
  } 

  if(loading){
    return (
      <div className='w-full flex justify-center mt-8 h-screen'>
        <TailSpin width={100} height={100} color='gray'/>
      </div>
    )
  }

  if(!user._id){
    return (
      <div className='w-full flex justify-center mt-8'>
        <TailSpin width={100} height={100} color='gray'/>
      </div>
    )
  }

  if(channels.length === 0){
    return (
      <div className='w-full flex justify-center mt-8'>
        <h1 className='text-2xl font-semibold'>Je hebt nog geen berichten</h1>
      </div>
    )
  }

  return (
    <>
      <div className='w-full h-screen lg:flex hidden justify-center mt-28 '>
        <div className='w-4/5 h-[500px] bg-gray-100 flex'>
          {/* Berichten channels Sidebar*/}
          <div>
            <BerichtenSidebar activeChannel={activeChannel} setActiveChannel={setActiveChannel} channels={channels}
            />
          </div>

          {/* Chat*/}
          <div className='flex flex-col justify-between w-full bg-[#e0e0de]'>
            <div className='max-h-fit bg-white p-2 flex gap-8'>
              <div className='relative top-0 left-0 h-[80px] w-[80px] max-h-[80px] max-w-[80px]'>
                <img src={getActiveChannel()?.advert.images[0]} alt="" className='relative top-0 h-[80px] w-[80px] left-0 object-cover rounded-sm'/>
                </div>
                <div className='w-full flex flex-col'>
                  <h1>{getActiveChannel()?.advert.title}</h1>
                  <h1 className='font-semibold'>{new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' })
                  .format(getActiveChannel().advert.price)}</h1>
                </div>
            </div>
            {channels.length > 0 &&(
              <div className='relative w-full max-w-[900px] min-w-[900px] px-2 max-h-[400px] overflow-y-auto overflow-x-hidden chat border-x shadow-sm' 
              id='message_container' >
              {getActiveChannel()?.messages?.map((item, index) => {
                if(item.owner._id !== user._id){
                  return (
                    <ChannelMessage key={index} message={item} ownMessage 
                    latestMessage={index === getActiveChannel().messages.length - 1}
                    />
                  )
                }else{
                  return (
                    <ChannelMessage key={index} message={item}
                    latestMessage={index === getActiveChannel().messages.length - 1}
                    />
                  )
                }
        })}
          </div>
            )}


            <div className='flex items-end gap-1' >
              <div className='w-full flex bg-white border-2 focus:outline'>
              <textarea placeholder='Typ een bericht' className='w-full rounded-full px-2 outline-none'
                value={message}
                onChange={(e) => {
                  if(message.length < 100)
                  setMessage(e.target.value)}}
                cols={30}
                onKeyDown={(e) => {
                  if(e.key === 'Enter'){
                    handleNewMessage()
                  }}}
                />
                {message.length}/100
              </div>


              <button className='primary_btn h-full'
              onClick={handleNewMessage}
              >

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>

              </button>
            </div>
          </div>

        </div>
      </div>

      <div className='w-full h-screen lg:hidden flex justify-end mt-28'>
        <div className='w-full h-[500px] bg-gray-100 flex'>

            {/* Berichten channels Sidebar*/}
            {mobileShow === 'channels' && (
            <div>
              <BerichtenSidebar activeChannel={activeChannel} setActiveChannel={setActiveChannel} channels={channels}
              mobileShow={mobileShow} setMobileShow={setMobileShow}/>
            </div>
            )}
            {/* Chat*/}
            {mobileShow === 'chat' && (
              <div className='flex flex-col justify-between w-full bg-[#e0e0de] mx-1 min-[600px] h-[600px]'>
                <div className='max-h-fit bg-white p-2 flex gap-8'>
                <div className='relative top-0 left-0 h-[80px] w-[80px] max-h-[80px] max-w-[80px]'>
                <img src={getActiveChannel()?.advert.images[0]} alt="" className='relative top-0 h-[80px] w-[80px] left-0 object-cover rounded-sm'/>
                </div>
                <div className='w-full flex flex-col'>
                  <h1>{getActiveChannel()?.advert.title}</h1>
                  <h1 className='font-semibold'>{new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' })
                  .format(getActiveChannel().advert.price)}</h1>
                </div>
              </div>
              {channels.length > 0 &&(
              <div className='relative w-full max-w-full min-w-full px-2  overflow-y-auto overflow-x-hidden chat border-x shadow-sm' 
              id='message_container' >
              {getActiveChannel()?.messages?.map((item, index) => {
                if(item.owner._id !== user._id){
                  return (
                    <ChannelMessage key={index} message={item} ownMessage 
                    latestMessage={index === getActiveChannel().messages.length - 1}
                    />
                  )
                }else{
                  return (
                    <ChannelMessage key={index} message={item}
                    latestMessage={index === getActiveChannel().messages.length - 1}
                    />
                  )
                }
        })}
          </div>
              )}

            <div className='flex items-end gap-1' >
              <div className='w-full flex bg-white border-2 focus:outline'>
              <textarea placeholder='Typ een bericht' className='w-full rounded-full px-2 outline-none'
                value={message}
                onChange={(e) => {
                  if(message.length < 100)
                  setMessage(e.target.value)}}
                cols={30}
                onKeyDown={(e) => {
                  if(e.key === 'Enter'){
                    handleNewMessage()
                  }}}
                />
                {message.length}/100
              </div>


              <button className='primary_btn h-full'
              onClick={handleNewMessage}
              >

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>

              </button>
            </div>
          </div>
            )}
        </div>
      </div>
    </>

  )
}

export default BerichtenPage