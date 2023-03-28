import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import ExtraInfo from '../components/AdvertPostComponents/ExtraInfo'
import PhoneAndZipCode from '../components/AdvertPostComponents/PhoneAndZipCode';
import PriceForm from '../components/AdvertPostComponents/PriceForm';
import TitleAndDescriptionForm from '../components/AdvertPostComponents/TitleAndDescriptionForm'
import UploadImages from '../components/AdvertPostComponents/UploadImages';
import { useContext } from 'react';
import { userContext } from '../context/UserContext';
import axios from 'axios'; 

interface Model {
  name: string;
}

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
  houseNumber: number | string,
  province: string,
  city: string,
  showContactInfo: boolean,
  showCity: boolean,
  price: number,
  owner: User,
  phone: string,
  scooter: Scooter,
  saves:string[]
  _id: string,
}

interface ScooterBrand {
  name: string;
  models: { [key: string]: Model };
}

interface ScooterCategory {
  id: number;
  name: string;
  subcategories: ScooterBrand[];
}

interface Props{
  categories:ScooterCategory[]
}

const PostAdvertPage = ({categories}:Props) => {

  interface ExtraInfo {
    condition: string;
    licensePlateType: string;
    cylinderCapacity: string;
    yearOfConstruction: string;
    mileage: string;
  }
  const { user } = useContext(userContext)
  const {toUpdate, advert}  =  useLocation().state as {toUpdate:boolean, advert:Advert} ? useLocation().state as {toUpdate:boolean, advert:Advert} : {toUpdate:false, advert: {} as Advert}
  const [selectedBrand, setSelectedBrand] = useState<string>('')
  const [selectedModel, setSelectedModel] = useState<string>('')

  const [finishedTitle, setFinishedTitle] = useState<string>('')
  const [finishedDescription, setFinishedDescription] = useState<string>('')
  const [finishedImages, setFinishedImages] = useState<string[]>([])
  const [finishedPrice, setFinishedPrice] = useState<number | string>('')
  const [finishedOfferPrice, setFinishedOfferPrice] = useState<number | string>('')

  const [finishedPhone, setFinishedPhone] = useState<string>('')
  const [finishedShowContactInfo, setFinishedShowContactInfo] = useState<boolean>(true)
  const [finishedZipCode, setFinishedZipCode] = useState<string>('')
  const [finishedCity, setFinishedCity] = useState<string>('')
  const [finishedShowCity, setFinishedShowCity] = useState<boolean>(true)
  const [finishedProvince, setFinishedProvince] = useState<string>('')
  const [finishedHouseNumber, setFinishedHouseNumber] = useState<number | string>('')

  const [extraInfo, setExtraInfo] = useState<ExtraInfo | null>(null)

  const [currentShow, setCurrentShow] = useState<number>(1)
  const [uploading, setUploading] = useState<boolean>(false)

  const navigate = useNavigate()

  useEffect(() => {
    if(!toUpdate || !advert._id) return
    setFinishedTitle(advert.title)
    setFinishedDescription(advert.description)
    setFinishedImages(advert.images)
    setFinishedPrice(advert.price)
    setFinishedOfferPrice(advert.offerPrice)
    setFinishedPhone(advert.phone)
    setFinishedZipCode(advert.zipCode)
    setFinishedHouseNumber(advert.houseNumber)
    setFinishedCity(advert.city)
    setFinishedProvince(advert.province)
    setFinishedShowContactInfo(advert.showContactInfo)
    setFinishedShowCity(advert.showCity)
    setExtraInfo({
      condition: advert.scooter.condition,
      licensePlateType: advert.scooter.licensePlateType,
      cylinderCapacity: advert.scooter.cylinderCapacity,
      yearOfConstruction: advert.scooter.yearOfConstruction,
      mileage: advert.scooter.mileage,
    })
    setSelectedBrand(advert.scooter.brand)
    setSelectedModel(advert.scooter.model)
  }, [])



  const handleModelSelected = () => {
    if (selectedModel === '') return
    setCurrentShow(2)
  }

  const handleFinalSubmit = () => {
    if (uploading) return
    setUploading(true)
    // CHECK IF ANY INPUT IS EMPTY
    if (finishedOfferPrice === '' || finishedPhone === '' || finishedZipCode === '' || finishedTitle === ''
      || finishedDescription === '' || finishedImages.length == 0 || extraInfo == null || finishedPrice === ''
      || selectedBrand === '' || selectedModel === '' || finishedCity === '' || finishedProvince === ''
    ) return
    setUploading(true)
    if(toUpdate && advert._id) {
      axios.put(`/advert/update/${advert._id}`, {
        ownerId: user._id,
        title: finishedTitle,
        description: finishedDescription,
        price: finishedPrice,
        offerPrice: finishedOfferPrice,
        images: finishedImages,
        phone: finishedPhone,
        showContactInfo: finishedShowContactInfo,
        zipCode: finishedZipCode,
        showCity:finishedShowCity,
        houseNumber: finishedHouseNumber,
        city: finishedCity,
        province: finishedProvince,
        brand: selectedBrand,
        model: selectedModel,
        extraInfo: extraInfo,
      }).then(res => {
        if (res.data.succes) {
          navigate(`/advert/${res.data.advert._id}`)
          return
        }
        else {
          console.log('something went wrong')
        }
      })
      return
    }
    axios.post('/advert/new', {
      ownerId: user._id,
      title: finishedTitle,
      description: finishedDescription,
      price: finishedPrice,
      offerPrice: finishedOfferPrice,
      images: finishedImages,
      phone: finishedPhone,
      showContactInfo: finishedShowContactInfo,
      zipCode: finishedZipCode,
      city: finishedCity,
      houseNumber: finishedHouseNumber,
      showCity:finishedShowCity,
      province: finishedProvince,
      brand: selectedBrand,
      model: selectedModel,
      extraInfo: extraInfo,
    }).then(res => {
      if (res.data.succes) {
        navigate(`/advert/${res.data.advert._id}`)
        return
      }
      else {
        console.log('something went wrong')
      }
    })

  }

  const getBrandIndex = ():number => {
    if(selectedBrand === '') return 0
    for(let i = 0; i < categories[0].subcategories.length; i++){
      if(categories[0].subcategories[i].name === selectedBrand) return i
    }
    return 0
  } 

  if(!user._id) return (
    <div className='w-full h-full flex flex-col gap-8 m-4 items-center justify-center'>
      <h1 className='md:text-4xl text-xl'>Plaats je advertentie.</h1>
      <h1 className='md:text-xl text-lg'>Je moet ingelogd zijn om een advertentie te plaatsen.</h1>
      <button className='primary_btn' onClick={() => navigate('/login')}>Log in</button>
    </div>
  )

  return (
    <div className='w-full h-full flex flex-col gap-8 m-4 items-center justify-center'>
      <h1 className='md:text-4xl text-xl'>Plaats je advertentie.</h1>

      <div className='md:w-2/3 w-1/3 min-w-fit p-8 flex flex-col gap-4 bg-white rounded-lg shadow-md'>
        <h1 className='md:text-xl text-lg'>Geselecteerd model: <span className='text-gray-600 italic'>{selectedModel}</span></h1>
        {currentShow == 1 && (
          <>
            <div className='flex flex-col'>
              <h1>Selecteer een scooter merk:</h1>
              <select name="scooter_select" id="scooter_select" value={selectedBrand == '' ? 'Kies een merk' : selectedBrand} onChange={e => setSelectedBrand(e.target.value)}>
                <option disabled >Kies een merk</option>
                {(categories[0].subcategories).map((subcategory, index) => (
                  <option key={index} value={subcategory.name}>{subcategory.name}</option>
                ))}
              </select>
            </div>


            {selectedBrand && (
              <div className='flex flex-col'>
                <h1>Selecteer je model:</h1>

                <select name="model_select" id="" value={selectedModel == '' ? 'Kies een model' : selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                  <option disabled>Kies een model</option>
                  {Object.values(categories[0].subcategories[getBrandIndex()].models).map((model, index) => (
                    <option key={index} value={model.name}>{model.name}</option>
                  ))}
                </select>
              </div>
            )}

            {selectedModel && (
              <button className='primary_btn' onClick={handleModelSelected}>Verder</button>
            )}
          </>

        )}

        {currentShow == 2 && (
          <TitleAndDescriptionForm
            finishedTitle={finishedTitle} finishedDescription={finishedDescription}
            setFinishedDescription={setFinishedDescription} setFinishedTitle={setFinishedTitle}
            setCurrentShow={setCurrentShow} currentShow={currentShow}
          />
        )}

        {currentShow == 3 && (
          <ExtraInfo setCurrentShow={setCurrentShow}
            setExtraInfo={setExtraInfo} extraInfo={extraInfo}
            currentShow={currentShow}
          />
        )}

        {currentShow == 4 && (
          <UploadImages setCurrentShow={setCurrentShow} setFinishedImages={setFinishedImages}
            currentShow={currentShow} finishedImages={finishedImages}

          />
        )}

        {currentShow == 5 && (
          <PriceForm
            setCurrentShow={setCurrentShow} setFinishedOfferPrice={setFinishedOfferPrice}
            finishedOfferPrice={finishedOfferPrice} setFinishedPrice={setFinishedPrice}
            finishedPrice={finishedPrice}
            currentShow={currentShow}

          />
        )}

        {currentShow == 6 && (
          <PhoneAndZipCode setCurrentShow={setCurrentShow} setFinishedPhone={setFinishedPhone}
            setFinishedZipCode={setFinishedZipCode} currentShow={currentShow} finishedPhone={finishedPhone}
            finishedZipCode={finishedZipCode} finishedCity={finishedCity} setFinishedCity={setFinishedCity}
            finishedProvince={finishedProvince} setFinishedProvince={setFinishedProvince} finishedHouseNumber={finishedHouseNumber}
            setFinishedHouseNumber={setFinishedHouseNumber} finishedShowContactInfo={finishedShowContactInfo} setFinishedShowContactInfo={setFinishedShowContactInfo}
            finishedShowCity={finishedShowCity} setFinishedShowCity={setFinishedShowCity} toUpdate={toUpdate}

          />
        )}

        {currentShow == 7 && (
          <div>
            <h1 className='text-xl'>{toUpdate ?  'Klaar om bij te werken?' : 'Klaar op te plaatsen?'}</h1>
            <div className='flex flex-col gap-4'>
              <h1 className='text-lg'>Titel: <span className='text-gray-600 italic'>{finishedTitle}</span></h1>
              <img src={finishedImages[0]} alt="foto" className='h-[400px] w-[300px] rounded-2xl object-contain'

              />
              <h1 className='text-lg'>Beschrijving: <span className='text-gray-600 italic'>{finishedDescription}</span></h1>
              <h1 className='text-lg'>Prijs: <span className='text-gray-600 italic'>{finishedPrice}</span></h1>

              <div className='flex gap-1'>
                <button className='secondary_btn w-full' onClick={() => {
                  if(uploading) return
                  setCurrentShow(currentShow - 1)}}>Terug</button>
                <button className='primary_btn w-full' disabled={uploading} onClick={handleFinalSubmit}>{
                  uploading ? 'Bezig met uploaden...' : 'Verder'
                }</button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>

  )
}


export default PostAdvertPage