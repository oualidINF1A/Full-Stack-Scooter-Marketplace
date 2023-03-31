import React, { useContext, useState } from 'react'
import ErrorMessage from '../ErrorMessage'
import { useEffect } from 'react'
import { userContext } from '../../context/UserContext'
import axios from 'axios'
import { Switch } from './Switch'


interface Props {
  setCurrentShow: React.Dispatch<React.SetStateAction<number>>
  setFinishedPhone: React.Dispatch<React.SetStateAction<string>>
  setFinishedZipCode: React.Dispatch<React.SetStateAction<string>>
  setFinishedCity: React.Dispatch<React.SetStateAction<string>>
  setFinishedProvince: React.Dispatch<React.SetStateAction<string>>
  setFinishedHouseNumber: React.Dispatch<React.SetStateAction<number | string>>
  setFinishedShowContactInfo: React.Dispatch<React.SetStateAction<boolean>>
  setFinishedShowCity: React.Dispatch<React.SetStateAction<boolean>>
  setFinishedLongitude: React.Dispatch<React.SetStateAction<number>>
  setFinishedLatitude: React.Dispatch<React.SetStateAction<number>>
  finishedShowContactInfo: boolean
  finishedShowCity: boolean
  finishedPhone: string
  finishedZipCode: string
  finishedCity: string
  finishedProvince: string
  finishedHouseNumber: number | string
  currentShow: number
  toUpdate: boolean
  
}

const PhoneAndZipCode = ({ setCurrentShow, setFinishedPhone, setFinishedZipCode, currentShow, finishedPhone, finishedZipCode
, setFinishedCity, setFinishedProvince, setFinishedLatitude, setFinishedLongitude, finishedHouseNumber, setFinishedHouseNumber,
setFinishedShowContactInfo, setFinishedShowCity, finishedShowContactInfo, finishedShowCity, toUpdate=false }: Props) => {

  const { user } = useContext(userContext)

  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [showContactInfo, setShowContactInfo] = useState<boolean>(false)

  const [zipCode, setZipCode] = useState<string>('')
  const [showCity, setShowCity] = useState<boolean>(false)
  const [houseNumber, setHouseNumber] = useState<number | string>('')
  const [province, setProvince] = useState<string>('')
  const [city, setCity] = useState<string>('');



  const [emptyFieldsError, setEmptyFieldsError] = useState<boolean>(false)

  const [phoneNumberError, setPhoneNumberError] = useState<boolean>(false)
  const [zipCodeError, setZipCodeError] = useState<boolean>(false)

  useEffect(() => {
    if(finishedPhone) {
      setPhoneNumber(finishedPhone)
    }
    if(finishedZipCode) {
      setZipCode(finishedZipCode)
    }
    if(finishedHouseNumber) {
      console.log(finishedHouseNumber)
      setHouseNumber(finishedHouseNumber)
    }
    if(finishedShowContactInfo) {
      setShowContactInfo(finishedShowContactInfo)
    }
    if(finishedShowCity) {
      setShowCity(finishedShowCity)
    }
    

  }, [])



  const checkPhoneNumber = (phone: string): boolean => {
    // First, remove any non-digit characters from the phone number
    const digitsOnly = phone.replace(/\D/g, '');

    // Check if the phone number has the correct length (10 digits)
    if (digitsOnly.length !== 10) {
      return false;
    }

    // Check if the phone number starts with a valid prefix
    const validPrefixes = ['06', '07'];
    const prefix = digitsOnly.substr(0, 2);
    if (!validPrefixes.includes(prefix)) {
      return false;
    }

    // If all checks pass, the phone number is valid
    return true;
  }


  const isValidDutchZipCode =  (zip: string): boolean => {
    // Remove any non-alphanumeric characters and convert to uppercase
    const normalized = zip.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

    // Check if the normalized string has the correct length (6 characters)
    if (normalized.length !== 6) {
      return false;
    }

    // Check if the first four characters are digits
    const digits = normalized.substr(0, 4);
    if (!/^\d{4}$/.test(digits)) {
      return false;
    }

    // Check if the last two characters are letters
    const letters = normalized.substr(4, 2);
    if (!/^[A-Z]{2}$/.test(letters)) {
      return false;
    }

    // If all checks pass, the zip code is valid
    return true
    

  ;
  }

  useEffect(() => {
    if(city === '' || province === '') {
      return
    }
    handleLastStep()


  }, [city, province])

  const getCityAndProvince = async (zip: string) => {
    const result = await axios.get(`/checkZipCode/${zip}/${houseNumber}`) 
    if(result.data.success){
      setCity(result.data.data.city)
      setProvince(result.data.data.province)
      setFinishedLatitude(result.data.data.latitude)
      setFinishedLongitude(result.data.data.longitude)
    }else{
      setZipCodeError(true)
      setTimeout(() => {
        setZipCodeError(false)
      }
      , 2000)
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPhoneNumber(phoneNumber)) {
      setPhoneNumberError(true)
      setTimeout(() => {
        setPhoneNumberError(false)
      }, 2000)
      return
    }
    if(!houseNumber) {
      setEmptyFieldsError(true)
      setTimeout(() => {
        setEmptyFieldsError(false)
      }, 2000)
      return
    }
    
    if (!isValidDutchZipCode(zipCode)) {
      setZipCodeError(true)
      setTimeout(() => {
        setZipCodeError(false)
      }, 2000)
      return
    }

    if (phoneNumber === '' || zipCode === '') {
      setEmptyFieldsError(true)
      setTimeout(() => {
        setEmptyFieldsError(false)
      }, 2000)
      return
    }

    await getCityAndProvince(zipCode)

  }

  const handleLastStep = async () => {
    setFinishedPhone(phoneNumber)
    setFinishedZipCode(zipCode)
    setFinishedCity(city)
    setFinishedProvince(province)
    setFinishedHouseNumber(houseNumber)
    setFinishedShowContactInfo(showContactInfo)
    setFinishedShowCity(showCity)
    setCurrentShow(currentShow + 1)
  }


  const handleBack = () => {
    setCurrentShow(currentShow - 1)
  }

  return (
    <form className='flex flex-col gap-4'
      onSubmit={e => { handleSubmit(e) }}
    >
      {emptyFieldsError && <ErrorMessage text='Vul alle velden in.' />}
      {phoneNumberError && <ErrorMessage text='Vul een geldig telefoon nummer in.' />}
      {zipCodeError && <ErrorMessage text='Vul een geldige postcode en/of huisnummer in.' />}

      <h1 className='text-lg md:text-xl'>Contact gegevens:</h1>
      <div className='flex gap-4'>
        <label>Naam bij advertentie:</label>
        <p className='italic border-b-2'>{user.name}</p>
      </div>

      <div className='flex gap-4  '>
        <label>Contact email:</label>
        <p className='italic border-b-2'>{user.email}</p>
      </div>

      <div className='flex flex-col gap-1'>
        <div className='flex gap-2'>
          <label>Telefoon Nummer:</label>
          <Switch toggleValue={showContactInfo} onToggle={() => setShowContactInfo(!showContactInfo)} spanText={'Door dit aan te vinken wordt je contact informatie gedeeld op je advertentie.'}/>
        </div>
        <input type="tel" className='border border-black'
          value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
          />

      </div>
      {toUpdate && <p className='text-xs italic'>Je kunt je locatie informatie niet aanpassen. Wil je dit toch doen moet je een nieuwe advertentie plaatsen.</p>}
      <div className='flex flex-col gap-1'>
      <div className='flex gap-2'>
          <label>Postcode:</label>
          <Switch toggleValue={showCity} onToggle={() => setShowCity(!showCity)} spanText={'Door dit aan te vinken wordt de stad van de advertentie getoond op je advertentie.'}/>
        </div>
        <input type="text" inputMode="numeric"
          className={toUpdate ? 'border border-gray-200' : 'border border-black'}
          value={zipCode} onChange={e => setZipCode(e.target.value)}
          disabled={toUpdate}
        />
      </div>

      <div className='flex flex-col gap-1'>
        <label>Huisnummer:</label>
        <input id="number" name="number" type="number" 
          className={toUpdate ? 'border border-gray-200' : 'border border-black'}
          value={houseNumber} onChange={e => {
            if(!e.target.value) return
            setHouseNumber(parseInt(e.target.value))
          }}
          disabled={toUpdate}
        />
      </div>

      <div className='flex w-full gap-1'>
        <button onClick={handleBack} type='button' className='secondary_btn w-full'>Terug</button>
        <button className='primary_btn w-full'>Verder</button>
      </div>
    </form>
  )
}

export default PhoneAndZipCode