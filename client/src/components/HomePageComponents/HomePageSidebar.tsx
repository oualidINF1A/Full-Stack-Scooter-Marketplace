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
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [categoryToShowOptionsOf, setCategoryToShowOptionsOf] = useState<string>('')

  const getBrandIndex = ():number => {
    if(selectedBrand === '') return 0
    for(let i = 0; i < categories[0].subcategories.length; i++){
      if(categories[0].subcategories[i].name === selectedBrand) return i
    }
    return 0
  } 

  const getcategoryIndex = ():number => {
    if(selectedCategory === '') return 0
    for(let i = 0; i < categories[0].subcategories.length; i++){
      if(categories[i].name === selectedCategory){
        console.log(categories[i].name)
        return i
      }
    }
    return 0
  }


  return (
    <div className='w-1/6 min-w-[200px] border bg-white shadow-sm min-h-fit rounded-b-xl p-1'>
      <h1 className='text-lg font-semibold text-center w-full'>Selecteer</h1>
      <div className='flex flex-col gap-2'>
        <div className=''>
          {categories.map((category, index) => (
              <div key={category.name} className="w-full flex flex-col gap-2">
                <div className='flex justify-between p-1'>
                  <p>{category.name}</p>
                  <button onClick={() => {
                    if (category.name === categoryToShowOptionsOf) {
                      setCategoryToShowOptionsOf('')
                      setSelectedCategory('')
                    } else {
                      setCategoryToShowOptionsOf(category.name)
                      setSelectedCategory(category.name)
                    }
                  }}>
                    {category.name !== categoryToShowOptionsOf ? (
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
              {category.name === categoryToShowOptionsOf && (
                    <div className='flex flex-col gap-2 ml-2' key={category.name}>
                      {category.subcategories.map((brand, index) => (
                        <div key={brand.name}>
                        <div key={brand.name} className='flex justify-between p-1'>
                          <Link to={`/category/${category.name}/${brand.name}/alle`} className=" underline">{brand.name}</Link>
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
                        {brand.name === brandToShowOptionsOf && (
                          <div className='flex flex-col gap-2 ml-4'>
                            {Object.keys(brand.models).map((model, index) => (
                              <Link key={model} to={`/category/${category.name}/${brand.name}/${brand.models[model].name}`} className=" underline">
                                {brand.models[model].name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                      ))}
                  </div>
            )}
        </div>
        ))}
      </div>
    </div>
  </div>
  )
}

export default HomePageSidebar