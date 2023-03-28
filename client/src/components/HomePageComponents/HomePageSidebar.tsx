import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

interface Model {
  name: string;
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
  categories: ScooterCategory[];
}

const HomePageSidebar = ({categories}:Props) => {
  const [selectedBrand, setSelectedBrand] = useState<string>('')
  const [brandToShowOptionsOf, setBrandToShowOptionsOf] = useState<string>('')

  const getBrandIndex = ():number => {
    if(selectedBrand === '') return 0
    for(let i = 0; i < categories[0].subcategories.length; i++){
      if(categories[0].subcategories[i].name === selectedBrand) return i
    }
    return 0
  } 


  return (
    <div className='w-1/6 min-w-[200px] border bg-white shadow-sm min-h-fit rounded-b-xl p-1'>
      <h1 className='text-lg font-semibold text-center w-full'>Selecteer</h1>
      <div className='flex flex-col gap-2'>
        {categories[0].subcategories.map((brand, index) => (
          <div key={index} className="py-2">
          <div className='flex justify-between p-1'>
            <Link to={`/category/${brand.name}/alle`} className=" underline">{brand.name}</Link>
            <button onClick={() => {
              if (brand.name === brandToShowOptionsOf) {
                setBrandToShowOptionsOf('')
                setSelectedBrand('')
              } else {
                setBrandToShowOptionsOf(brand.name)
                setSelectedBrand(brand.name)
              }
            }}>
              {brand.name !== brandToShowOptionsOf ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
                              
              ):(
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
              )}
            </button>
          </div>
          <div>
            {brand.name === brandToShowOptionsOf && (
              <div className='flex flex-col gap-2 pl-2'>
                {Object.values(categories[0].subcategories[getBrandIndex()].models).map((model, index)  => (
                  <div className='flex gap-2' key={index}>
                  <span>-</span>
                  <Link to={`/category/${categories[0].subcategories[getBrandIndex()].name}/${model.name}`} className='text-indigo-500 underline-offset-2 underline'>{model.name}</Link>
                  </div>
                ))}
              </div>

            )}
          </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomePageSidebar