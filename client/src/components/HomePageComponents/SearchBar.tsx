import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ErrorMessage from '../ErrorMessage'

const SearchBar = () => {
    const [query, setQuery] = useState('')
    const [city, setcity] = useState('')
    const [cityError, setcityError] = useState(false)
    const [longitude, setLongitude] = useState<number>(0)
    const [latitude, setLatitude] = useState<number>(0)
    const navigate = useNavigate()
    const dutchCities = [
      "amsterdam",
      "rotterdam",
      "utrecht",
      "den haag",
      "eindhoven",
      "tilburg",
      "groningen",
      "almere",
      "breda",
      "nijmegen",
      "apeldoorn",
    ];
    const [citySuggestions, setCitySuggestions] = useState<string[]>([])

    const handleSearch = () => {
        if(city){
            if(!isValidDutchCity(city)){
                setcityError(true)
                setTimeout(() => {
                    setcityError(false)
                }, 2000)
                return
            }

        }
        if(query === '') return
        if(city === '') {
          navigate(`/search/q/${query}`, 
          {state: {city: "none"}})
          return
        }
        navigate(`/search/q/${query}`, 
        {state: {city: city}})
    }

    function isValidDutchCity(city: string): boolean {
      return dutchCities.includes(city.toLowerCase());
    }

    const onCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setcity(e.target.value)
      if(e.target.value.length > 0){
        setCitySuggestions(dutchCities.filter(city => city.toLowerCase().startsWith(e.target.value.toLowerCase())))
      }else{
        setCitySuggestions([])
      }
    }
    


  return (
    <div className='w-2/3 flex flex-col py-2'>
        {cityError && <ErrorMessage text='Ongeldige stad' />}

        <div className='w-full flex items-end'>
          <input placeholder='Welk soort scooter ben je op zoek?' 
          className='border w-full rounded-none outline-indigo-500 border-y border-l border-indigo-500
          h-[40px] px-2'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          />
          <div className='w-[150px]'>
          <input id="zip" name="zip" inputMode="numeric"
            className={'outline-indigo-500 border-y  border-indigo-500 h-[40px] w-full border-r-none rounded-none'}
            value={city} onChange={onCityChange}
            placeholder="Stad"
            
          />
          {city && (
            <div className={`dropdown relative z-40 
            ${citySuggestions.length == 0 && 'hidden'}`}>
            <div className='dropdown-content'>
              {citySuggestions.map((city, index) => (
                <div key={index} className='dropdown_item' onClick={() => {
                  setcity(city)
                  setCitySuggestions([])
                }}>{city}</div>
              ))}
          </div>
          </div>
          )}

          </div>

          <button className='primary_btn w-[150px] h-[40px] border border-indigo-500 border-r-none rounded-none' 
          onClick={handleSearch}
          >Zoek</button>
        </div>

    </div>
  )
}

export default SearchBar