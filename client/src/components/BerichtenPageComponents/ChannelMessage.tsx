import moment from 'moment'
import React, {useEffect} from 'react'

interface Message{
    message: string,
    owner: {
      _id: string,
      name: string
    }
    date: string
  
  }

interface Props {
    message: Message
    ownMessage?: boolean
    latestMessage: boolean
}

const ChannelMessage = ({message, ownMessage=false, latestMessage}:Props) => {

    useEffect(() => {
        var latestMessageDiv = document.getElementById('latest_message') as HTMLElement;
        latestMessageDiv.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
    },[])


  return (
    <div className={ownMessage ? 'msg rcvd' : 'msg sent'} id={latestMessage ? 'latest_message' : ''}>
            <span>{message.message}</span>
        <div className=' text-end' style={{fontSize:'10px'}}>
            {moment(message.date).format('HH:mm DD-MM')}
            </div>

    </div>

  )
}

export default ChannelMessage