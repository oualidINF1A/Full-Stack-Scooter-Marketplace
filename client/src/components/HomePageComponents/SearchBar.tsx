import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SearchBar = () => {
    const [query, setQuery] = useState('')
    const navigate = useNavigate()

    const handleSearch = () => {
        if(query === '') return
        navigate(`/search/q/${query}`)
    }



  return (
    <div className='w-full flex max-h-[100px] items-end py-2 justify-center'>
        <input type="text" placeholder='Welk soort scooter ben je op zoek?' 
        className='w-[300px] max-w-[300px] border rounded-none outline-indigo-500 border-y border-l border-indigo-500'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        />
        <button className='primary_btn w-[100px] h-[40px] border border-indigo-500 border-r-none rounded-none' 
        onClick={handleSearch}
        >Zoek</button>
    </div>
  )
}

export default SearchBar