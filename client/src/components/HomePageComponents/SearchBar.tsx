import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ErrorMessage from '../ErrorMessage'

const SearchBar = () => {
    const [query, setQuery] = useState('')
    const [city, setcity] = useState('')
    const [cityError, setcityError] = useState(false)
    const navigate = useNavigate()
    const dutchCities = [
      "Amsterdam",
      "Rotterdam",
      "Utrecht",
      "Den Haag",
      "Eindhoven",
      "Tilburg",
      "Groningen",
      "Almere",
      "Breda",
      "Nijmegen",
      "Apeldoorn",
      "Haarlem",
      "Enschede",
      "Arnhem",
      "Zaanstad",
      "Amersfoort",
      "Zwolle",
      "Dordrecht",
      "Leiden",
      "Haarlemmermeer", 
      "Zoetermeer",
      "Emmen",
      "Ede",
      "Delft",
      "Heerlen",
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
      for(let i = 0; i < dutchCities.length; i++){
        if(dutchCities[i].toLowerCase() === city.toLowerCase()){
          return true
        }
      }
      return false
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
    <div className=' md:min-w-[55%] md:w-[55%] w-[90%] min-w-[90%] lg:text-sm text-xs  flex flex-col py-2'>
        {cityError && <ErrorMessage text='Ongeldige stad' />}

        <div className='w-full flex items-end'>
          <input placeholder='Welk soort scooter ben je op zoek?' 
          className='border w-full  rounded-none outline-indigo-500 border-y border-l border-indigo-500
          h-[40px] px-2'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          />

          <div className='md:w-[165px] w-[140px]'>
            <input inputMode="numeric"
              className={'outline-indigo-500 border-y border-indigo-500 h-[40px] pl-1 border-r-none rounded-none'}
              value={city} onChange={onCityChange}
              placeholder="Stad"
              type='text'
            />
            {city && (
              <div className={`dropdown relative z-40 md:w-[165px] w-[120px]
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

          <button className='primary_btn w-[100px] h-[40px] border border-indigo-500 border-r-none rounded-none' 
          onClick={handleSearch}
          >Zoek</button>
        </div>

    </div>
  )
}

export default SearchBar