import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useContext } from 'react'
import { userContext } from '../context/UserContext'
import { TailSpin } from 'react-loader-spinner'
import axios from 'axios'
import Carousel from   '../components/AdvertPageComponents/Carousel'
import moment from 'moment'
import ErrorMessage from '../components/ErrorMessage'
import OfferComponent from '../components/AdvertPageComponents/Offer'
import { useNavigate } from 'react-router-dom'
import { Modal } from 'stream-chat-react'

interface User{
    name?: string,
    email?: string,
    _id?: string
}

interface Scooter{
    brand: string,
    model: string,
    yearOfConstruction: string,
    mileage:string,
    licensePlateType: string,
    cylinderCapacity: string,
    condition: string,
    _id: string,
}

interface Offer{
    owner:User,
    amount: number,
    date:string,
    _id: string,
}

interface Advert {
    date?: string,
    title: string,
    zipCode: string,
    description: string,
    images: string[],
    offers: Offer[],
    offerPrice: number,
    price: number,
    owner: User,
    city: string,
    province: string,
    phone: string,
    showContactInfo: boolean,
    showCity: boolean,
    scooter: Scooter,
    saves:string[]
    _id: string,
}

export const AdvertPage = () => {
    const {id} = useParams()
    const {user} = useContext(userContext)
    const [advert, setAdvert] = useState<Advert>()
    const [offers, setOffers] = useState<Offer[]>([])
    const [dataLoaded, setDataLoaded] = useState(false)
    const [saved, setSaved] = useState<boolean>(false)
    const navigate = useNavigate()

    const [city, setCity] = useState<string>('')
    const [bidPrice, setBidPrice] = useState<number | string>('')
    
    const [notLoggedInError, setNotLoggedInError] = useState<boolean>(false)
    const [offerTooLowError, setOfferTooLowError] = useState<boolean>(false)
    const [offerLowerThanLast, setOfferLowerThanLast] = useState<boolean>(false)
    const [alreadyHighestBidderError, setAlreadyHighestBidderError] = useState<boolean>(false)

    const [offersLoading, setOffersLoading] = useState<boolean>(false)
    const [deleting, setDeleting] = useState<boolean>(false)
    const [modal, setModal] = useState<boolean>(false)

    const handleSaveAdvert = async () => {
        if(!user._id) return
        if(!advert?._id) return
        setSaved(!saved)
        const res = await axios.put('/advert/advert/save', {advertId: advert._id, userId: user._id})
        if(!res.data.succes){
            setSaved(!saved)
            return
        }
    }

    const handleNewOffer = async () => {
        if(!user._id){
            setNotLoggedInError(true)
            setTimeout(() => {
                setNotLoggedInError(false)
            },1000)
            return
        }
        if(!advert?._id) return
        if(!bidPrice) return
        if(bidPrice <= advert.offerPrice) {
            setOfferTooLowError(true)
            setTimeout(() => {
                setOfferTooLowError(false)
            },1000)
            return
        }
        if(offers.length > 0){
            if(bidPrice < offers[0].amount){
                setOfferLowerThanLast(true)
                setTimeout(() => {
                    setOfferLowerThanLast(false)
                },1000)
                return
            }
        }
        if(user._id === offers[0]?.owner._id){
            setAlreadyHighestBidderError(true)
            setTimeout(() => {
                setAlreadyHighestBidderError(false)
            },1000)
            return
        }

        setOffersLoading(true)
        const res = await axios.put('/advert/advert/newOffer', {advertId: advert._id, userId: user._id, offer: bidPrice})
        if(!res.data.succes) return
        await getOffers()
        setOffersLoading(false)
        messageAdvertOwnerOnOffer(bidPrice)
        
    }

    const getOffers = async () => {
        const res = await axios.get(`/advert/advert/offers/${advert?._id}`)
        if(!res.data.succes) return
        const sortedOffers = res.data.offers.sort((a:Offer, b:Offer) => {
            return b.amount - a.amount
        })
        setOffers(sortedOffers)
    }

    const getAdvert = async () => {
        const res = await axios.get(`/advert/advert/${id}`)
        if(!res.data.succes) return 
        setAdvert(res.data.advert)
        setSaved(res.data.advert.saves.includes(user._id))
    }

    useEffect(() => {
        if(!user._id || dataLoaded || !id) return
        setDataLoaded(true)
        getAdvert()
    }, [user])

    useEffect(() => {
        if(!advert?._id) return
        getOffers() 
    }, [advert])

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '')
        if (isNaN(parseInt(value))) {
            setBidPrice('')
            return
        }
        const valueInt = parseInt(value)

        if (valueInt <= 0) {
            return
        }
        setBidPrice(valueInt)
    }

    const handleDelete = async (id:string) => {
        if(deleting) return
        setDeleting(true)
        const res = await axios.get(`/advert/delete/${id}`)
        setDeleting(false)
        if(res.data.succes){
            navigate('/profile/profiel')
        }
    }

    const handleContacteer = async () => {
        if(!user._id || !advert?._id) return
        const res = await axios.post('/berichten/createChannel', {advertId: advert?._id, userId: user._id})
        if(!res.data.succes) return
            navigate('/berichten')
    }

    const handleNewMessage = async (bid:number | string, channel:string) => {
        if(!user?._id || !advert?._id) return
        if(typeof bid === 'string') return
        const {data} = await axios.post(`/berichten/newmessage/${channel}`, {message:`
Beste Jan,\n

hierbij bied ik ${
new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(bid)} op uw "${advert.title}".\n
Ik zie graag een reactie tegemoet.\n
        
Met vriendelijke groet,\n
${user.name}.
                `
            , userId: user._id})
      }

    const messageAdvertOwnerOnOffer = async (bid:number | string):Promise<void> => {
        if(!user._id || !advert?._id) return
        const res = await axios.post('/berichten/createChannel', {advertId: advert?._id, userId: user._id})
        if(!res.data.succes) return
            handleNewMessage(bid, res.data.channel._id)
            navigate('/berichten')
    }

    if(deleting) return (
        <div className='flex w-screen justify-center items-center mt-16'>
            <TailSpin color='red' height={100} width={100} />
        </div>
    )

    if(!advert) return (
        <div className='flex justify-center items-center'>
            <TailSpin color='gray' height={100} width={100} />
        </div>
    )

    if(!user._id) return (
        <div className='flex justify-center items-center'>
            Je moet ingelogd zijn om deze pagina te kunnen bekijken.
        </div>
    )

    async function validateDutchZipCode(zipCode: string): Promise<boolean> {
        const url = `https://api.postcodes.io/postcodes/${zipCode}`;
        const response = await fetch(url);
        console.log(response)
        const data = await response.json();
      
        if (response.status !== 200) {
          return false; // invalid zip code
        }
      
        const city = data.result.city;
        setCity(city)
        return !!city; // true if city is found, false otherwise
      }

    return (
        <div>        
    <div className='px-16 py-4 lg:flex hidden lg:flex-row flex-col justify-center gap-2'>
        {/* Main advert information */}
        <div className=' p-4 bg-white rounded-sm border w-3/5 shadow-sm flex flex-col gap-4'>
            <div className='flex lg:flex-row flex-col'>
                <div>

                <div className='flex flex-col justify-between items-center py-4'>
                    <div className='flex gap-2 items-center '>
                        <h1 className='md:text-2xl text-xl font-bold'>{advert.title}</h1> | 
                        <span className='text-gray-600 flex gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                            </svg>
                            {moment(advert.date).format('DD-MM-YYYY')}
                        </span> | 
                        <span className='text-gray-600 flex gap-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                            {advert.saves.length}
                        </span>
                        
                    </div>
                    
                    {user._id && user._id !== advert.owner._id ?  (
                        <button className='secondary_btn flex gap-1 w-full'
                        onClick={() => handleSaveAdvert()}
                        >

                        <svg xmlns="http://www.w3.org/2000/svg" fill={saved ? 'blue' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>


                            {saved ? 'Bewaard' : 'Bewaren'}
                        
                        </button>
                    ):(
                        <div className='w-full flex gap-2'>
                            <button className='primary_red_btn gap-1 w-full'
                            onClick={() => handleDelete(advert._id)}
                            >
                                Verwijder
                            </button>
                            <button className='secondary_btn gap-1 w-full'
                            onClick={() => navigate('/advertentie_plaatsen', {state: {
                                toUpdate: true,
                                advert: advert
                            }})}
                            >
                                Wijzigen
                            </button>
                        </div>
                    )}

                </div>



                <div className='max-w-lg rounded-xl   shadow-md'
                >
                    <Carousel advertId={advert._id}>
                        {advert.images.map((image, i) => (
                                <img src={image} alt="" key={i} className='min-w-[512px] max-h-[500px] W-[512px] object-contain'/>
                            ))}
                    </Carousel>

                </div>
                </div>





                <div className='mt-16 mx-6 flex flex-col gap-8'>
                    <h1 className='font-bold md:text-2xl text-xl '>{
                    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(advert.price)
                    }</h1>

                                    {/*Contact information*/}
                    
                    <div className='flex flex-col gap-4 h-fit bg-gray-100 py-4 px-8 border'>
                            <Link to={`/account/${advert.owner._id}`}
                            className='text-indigo-500 hover:underline'
                            >{advert.owner.name}</Link>
                            {advert.showContactInfo && (
                                <>
                                    <p className='text-gray-600 border-b flex gap-1 items-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                                        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                                    </svg>
                                        <span>:</span>
                                        {advert.owner.email}</p>
                                    <p className='text-gray-600 border-b flex gap-1 items-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                            <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                                        </svg>
                                        <span>:</span>
                                        {advert.phone}</p>
                                </>
                            ) }

                            {advert.showCity && (
                                <p className='text-gray-600 border-b flex gap-1 items-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>

                                <span>:</span>
                                <span className='font-bold'>{advert.city}</span>
                                </p>
                            )}



                            
                            
                            {user._id && user._id !== advert.owner._id ? (
                            <button className='primary_btn w-full'
                            onClick={handleContacteer}
                            >Contacteer</button>
                            ):(
                                <button className='primary_btn w-full'
                                onClick={() => navigate('/profile/profiel')}
                                >Wijzigen</button>
                            )}
                    </div>

                    <div className='flex flex-col gap-2 bg-gray-100 shadow-sm p-4 rounded-2xl'>
                        <h1 className='text-xl font-bold '>Kenmerken:</h1>
                        <h1 className='text-gray-600 flex gap-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className='w-6 h-6'>
                            <path d="M280 32c-13.3 0-24 10.7-24 24s10.7 24 24 24h57.7l16.4 30.3L256 192l-45.3-45.3c-12-12-28.3-18.7-45.3-18.7H64c-17.7 0-32 14.3-32 32v32h96c88.4 0 160 71.6 160 160c0 11-1.1 21.7-3.2 32h70.4c-2.1-10.3-3.2-21-3.2-32c0-52.2 25-98.6 63.7-127.8l15.4 28.6C402.4 276.3 384 312 384 352c0 70.7 57.3 128 128 128s128-57.3 128-128s-57.3-128-128-128c-13.5 0-26.5 2.1-38.7 6L418.2 128H480c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32H459.6c-7.5 0-14.7 2.6-20.5 7.4L391.7 78.9l-14-26c-7-12.9-20.5-21-35.2-21H280zM462.7 311.2l28.2 52.2c6.3 11.7 20.9 16 32.5 9.7s16-20.9 9.7-32.5l-28.2-52.2c2.3-.3 4.7-.4 7.1-.4c35.3 0 64 28.7 64 64s-28.7 64-64 64s-64-28.7-64-64c0-15.5 5.5-29.7 14.7-40.8zM187.3 376c-9.5 23.5-32.5 40-59.3 40c-35.3 0-64-28.7-64-64s28.7-64 64-64c26.9 0 49.9 16.5 59.3 40h66.4C242.5 268.8 190.5 224 128 224C57.3 224 0 281.3 0 352s57.3 128 128 128c62.5 0 114.5-44.8 125.8-104H187.3zM128 384a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/>
                        </svg>
                        Kilometerstand: <span className='italic'>{advert.scooter.mileage}km</span></h1>

                        <h1 className='text-gray-600 flex gap-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className='w-6 h-6'><path d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zM329 305c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-95 95-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L329 305z"/></svg>
                            Bouwjaar: <span className='italic'>{advert.scooter.yearOfConstruction}</span></h1>

                        <h1 className='text-gray-600 flex gap-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='w-6 h-6'><path d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
                            Conditie: <span className='italic'>{advert.scooter.condition}</span></h1>

                        <h1 className='text-gray-600 flex gap-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='w-6 h-6'><path d="M32 64C32 28.7 60.7 0 96 0H256c35.3 0 64 28.7 64 64V256h8c48.6 0 88 39.4 88 88v32c0 13.3 10.7 24 24 24s24-10.7 24-24V222c-27.6-7.1-48-32.2-48-62V96L384 64c-8.8-8.8-8.8-23.2 0-32s23.2-8.8 32 0l77.3 77.3c12 12 18.7 28.3 18.7 45.3V168v24 32V376c0 39.8-32.2 72-72 72s-72-32.2-72-72V344c0-22.1-17.9-40-40-40h-8V448c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32V64zM96 80v96c0 8.8 7.2 16 16 16H240c8.8 0 16-7.2 16-16V80c0-8.8-7.2-16-16-16H112c-8.8 0-16 7.2-16 16z"/></svg>
                            Cilinderinhoud: <span className='italic'>{advert.scooter.cylinderCapacity}CC</span></h1>

                        <h1 className='text-gray-600 flex gap-2'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='w-6 h-6'><path d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/></svg>
                            Kenteken type: <span className='italic flex'>{advert.scooter.licensePlateType} 
                            {advert.scooter.licensePlateType === 'Geel' ? '(45m/h) ' : '(25km/h)'}
                            </span></h1>


                    </div>
                </div>  
            </div>
            <div className='border-t-4 py-2'>
                    <article className='prose lg:prose-xl'>{advert.description}</article>
            </div>

        </div>
                    {/**Bieden gedeelte */}
         <div className='px-2 py-4 bg-white max-w-[515px] min-w-[300px] flex flex-col gap-1 h-fit'>
                        {notLoggedInError && <ErrorMessage text='U moet ingelogd zijn om te kunnen bieden'/>}
                        {offerTooLowError && <ErrorMessage text='Bod moet hoger zijn dan minimaal bod'/>}
                        {offerLowerThanLast && <ErrorMessage text='Bod moet hoger zijn dan laatste bod.'/>}
                        {alreadyHighestBidderError && <ErrorMessage text='U bent al de hoogste bieder.'/>}

                        <h1 className='lg:text-lg text-md font-semibold'>{user._id !== advert.owner._id ? 
                        'Bieden' : 'Biedingen'    
                    }</h1>
                        <span className='text-gray-600 border-b'>Min: {
                                new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(advert.offerPrice)
                            }</span>

                        {user._id !== advert?.owner._id && (
                            <>
                            <div>
                                <div className='border border-black flex items-center px-1'>
                                    <span className='text-gray-500 font-bold'>€</span>
                                    <input type="tel" name="price" className='border-none w-full outline-none'
                                        placeholder='0'
                                        value={bidPrice}
                                        onChange={(e) => handlePriceChange(e)}
                                    />
                                </div>
                            </div>


                            <button className='secondary_btn flex w-full items-center justify-center gap-4 font-semibold' 
                                onClick={handleNewOffer}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='w-4 h-4 fill-indigo-500'>
                                        <path d="M318.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-120 120c-12.5 12.5-12.5 32.8 0 45.3l16 16c12.5 12.5 32.8 12.5 45.3 0l4-4L325.4 293.4l-4 4c-12.5 12.5-12.5 32.8 0 45.3l16 16c12.5 12.5 32.8 12.5 45.3 0l120-120c12.5-12.5 12.5-32.8 0-45.3l-16-16c-12.5-12.5-32.8-12.5-45.3 0l-4 4L330.6 74.6l4-4c12.5-12.5 12.5-32.8 0-45.3l-16-16zm-152 288c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l48 48c12.5 12.5 32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-1.4-1.4L272 285.3 226.7 240 168 298.7l-1.4-1.4z"/>
                                    </svg>
                                    
                                    Plaats bod
                                </button>
                            </>

                        )}

                        {offersLoading && (
                            <TailSpin color='gray' />
                        )}

                        {offers.length > 0 && !offersLoading && (
                        <div className='flex flex-col gap-2 mt-2'>
                            {offers.map((offer, index) => (
                                <OfferComponent key={index} offer={offer} isOwner={user._id === advert.owner._id} 
                                user={user} advert={advert} setOffers={setOffers}/>
                            ))}
                        </div>
                        )}


        </div>

    </div>

    <div className='lg:hidden flex flex-col gap-2'>

        {/*Fotos */}
        <div className='max-w-lg rounded-xl   shadow-md'
                >
                    <Carousel advertId={advert._id}>
                        {advert.images.map((image, i) => (
                                <img src={image} alt="" key={i} className='min-w-[400px] max-h-[300px] W-[400px] object-contain'/>
                            ))}
                    </Carousel>

            </div>

            {/*Titel datum en saves */}
            <div className='flex flex-col justify-between items-center py-4 bg-white'>
                            <div className='flex justify-around w-full items-center '>
                                <h1 className='md:text-2xl text-xl font-bold'>{advert.title}</h1> | 
                                <span className='text-gray-600 flex gap-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                    </svg>
                                    {moment(advert.date).format('DD-MM-YYYY')}
                                </span> | 
                                <span className='text-gray-600 flex gap-2'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                    </svg>
                                    {advert.saves.length}
                                </span>
                                
                            </div>
                            
                            {user._id && user._id !== advert.owner._id ?  (
                                <button className='secondary_btn flex gap-1 w-full'
                                onClick={() => handleSaveAdvert()}
                                >

                                <svg xmlns="http://www.w3.org/2000/svg" fill={saved ? 'blue' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                </svg>


                                    {saved ? 'Bewaard' : 'Bewaren'}
                                
                                </button>
                            ):(
                                <div className='w-full flex gap-2'>
                                    <button className='primary_red_btn gap-1 w-full'
                                    onClick={() => handleDelete(advert._id)}
                                    >
                                        Verwijder
                                    </button>
                                    <button className='secondary_btn gap-1 w-full'
                                    onClick={() => navigate('/advertentie_plaatsen', {state: {
                                        toUpdate: true,
                                        advert: advert
                                    }})}
                                    >
                                        Wijzigen
                                    </button>
                                </div>
                            )}

            </div>


            {/*Kenmerken*/}
            <div className='flex flex-col gap-2 bg-white shadow-sm p-4 rounded-2xl'>
                                <h1 className='text-xl font-bold '>Kenmerken:</h1>
                                <h1 className='text-gray-600 flex gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className='w-6 h-6'>
                                    <path d="M280 32c-13.3 0-24 10.7-24 24s10.7 24 24 24h57.7l16.4 30.3L256 192l-45.3-45.3c-12-12-28.3-18.7-45.3-18.7H64c-17.7 0-32 14.3-32 32v32h96c88.4 0 160 71.6 160 160c0 11-1.1 21.7-3.2 32h70.4c-2.1-10.3-3.2-21-3.2-32c0-52.2 25-98.6 63.7-127.8l15.4 28.6C402.4 276.3 384 312 384 352c0 70.7 57.3 128 128 128s128-57.3 128-128s-57.3-128-128-128c-13.5 0-26.5 2.1-38.7 6L418.2 128H480c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32H459.6c-7.5 0-14.7 2.6-20.5 7.4L391.7 78.9l-14-26c-7-12.9-20.5-21-35.2-21H280zM462.7 311.2l28.2 52.2c6.3 11.7 20.9 16 32.5 9.7s16-20.9 9.7-32.5l-28.2-52.2c2.3-.3 4.7-.4 7.1-.4c35.3 0 64 28.7 64 64s-28.7 64-64 64s-64-28.7-64-64c0-15.5 5.5-29.7 14.7-40.8zM187.3 376c-9.5 23.5-32.5 40-59.3 40c-35.3 0-64-28.7-64-64s28.7-64 64-64c26.9 0 49.9 16.5 59.3 40h66.4C242.5 268.8 190.5 224 128 224C57.3 224 0 281.3 0 352s57.3 128 128 128c62.5 0 114.5-44.8 125.8-104H187.3zM128 384a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/>
                                </svg>
                                Kilometerstand: <span className='italic'>{advert.scooter.mileage}km</span></h1>

                                <h1 className='text-gray-600 flex gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className='w-6 h-6'><path d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zM329 305c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-95 95-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L329 305z"/></svg>
                                    Bouwjaar: <span className='italic'>{advert.scooter.yearOfConstruction}</span></h1>

                                <h1 className='text-gray-600 flex gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='w-6 h-6'><path d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
                                    Conditie: <span className='italic'>{advert.scooter.condition}</span></h1>

                                <h1 className='text-gray-600 flex gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='w-6 h-6'><path d="M32 64C32 28.7 60.7 0 96 0H256c35.3 0 64 28.7 64 64V256h8c48.6 0 88 39.4 88 88v32c0 13.3 10.7 24 24 24s24-10.7 24-24V222c-27.6-7.1-48-32.2-48-62V96L384 64c-8.8-8.8-8.8-23.2 0-32s23.2-8.8 32 0l77.3 77.3c12 12 18.7 28.3 18.7 45.3V168v24 32V376c0 39.8-32.2 72-72 72s-72-32.2-72-72V344c0-22.1-17.9-40-40-40h-8V448c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32V64zM96 80v96c0 8.8 7.2 16 16 16H240c8.8 0 16-7.2 16-16V80c0-8.8-7.2-16-16-16H112c-8.8 0-16 7.2-16 16z"/></svg>
                                    Cilinderinhoud: <span className='italic'>{advert.scooter.cylinderCapacity}CC</span></h1>

                                <h1 className='text-gray-600 flex gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='w-6 h-6'><path d="M512 256c0 .9 0 1.8 0 2.7c-.4 36.5-33.6 61.3-70.1 61.3H344c-26.5 0-48 21.5-48 48c0 3.4 .4 6.7 1 9.9c2.1 10.2 6.5 20 10.8 29.9c6.1 13.8 12.1 27.5 12.1 42c0 31.8-21.6 60.7-53.4 62c-3.5 .1-7 .2-10.6 .2C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256zM128 288a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm0-96a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm96 96a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/></svg>
                                    Kenteken type: <span className='italic flex'>{advert.scooter.licensePlateType} 
                                    {advert.scooter.licensePlateType === 'Geel' ? '(45m/h) ' : '(25km/h)'}
                                    </span></h1>


                </div>

                
            {/**Bieden gedeelte */}
            <div className='px-2 py-4 bg-white max-w-[515px] min-w-[300px] flex flex-col gap-1 h-fit'>
                        {notLoggedInError && <ErrorMessage text='U moet ingelogd zijn om te kunnen bieden'/>}
                        {offerTooLowError && <ErrorMessage text='Bod moet hoger zijn dan minimaal bod'/>}
                        {offerLowerThanLast && <ErrorMessage text='Bod moet hoger zijn dan laatste bod.'/>}
                        {alreadyHighestBidderError && <ErrorMessage text='U bent al de hoogste bieder.'/>}

                        <h1 className='lg:text-lg text-md font-semibold'>{user._id !== advert.owner._id ? 
                        'Bieden' : 'Biedingen'    
                    }</h1>
                        <span className='text-gray-600 border-b'>Min: {
                                new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(advert.offerPrice)
                            }</span>

                        {user._id !== advert?.owner._id && (
                            <>
                            <div>
                                <div className='border border-black flex items-center px-1'>
                                    <span className='text-gray-500 font-bold'>€</span>
                                    <input type="tel" name="price" className='border-none w-full outline-none'
                                        placeholder='0'
                                        value={bidPrice}
                                        onChange={(e) => handlePriceChange(e)}
                                    />
                                </div>
                            </div>


                            <button className='secondary_btn flex w-full items-center justify-center gap-4 font-semibold' 
                                onClick={handleNewOffer}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='w-4 h-4 fill-indigo-500'>
                                        <path d="M318.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-120 120c-12.5 12.5-12.5 32.8 0 45.3l16 16c12.5 12.5 32.8 12.5 45.3 0l4-4L325.4 293.4l-4 4c-12.5 12.5-12.5 32.8 0 45.3l16 16c12.5 12.5 32.8 12.5 45.3 0l120-120c12.5-12.5 12.5-32.8 0-45.3l-16-16c-12.5-12.5-32.8-12.5-45.3 0l-4 4L330.6 74.6l4-4c12.5-12.5 12.5-32.8 0-45.3l-16-16zm-152 288c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l48 48c12.5 12.5 32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-1.4-1.4L272 285.3 226.7 240 168 298.7l-1.4-1.4z"/>
                                    </svg>
                                    
                                    Plaats bod
                                </button>
                            </>

                        )}

                        {offersLoading && (
                            <TailSpin color='gray' />
                        )}

                        {offers.length > 0 && !offersLoading && (
                        <div className='flex flex-col gap-2 mt-2'>
                            {offers.map((offer, index) => (
                                <OfferComponent key={index} offer={offer} isOwner={user._id === advert.owner._id} 
                                user={user} advert={advert} setOffers={setOffers}/>
                            ))}
                        </div>
                        )}


                </div>
        </div>
        </div>

    )
}
