import React, { useEffect, useState } from 'react'
import ErrorMessage from '../ErrorMessage'

interface Props {
    setFinishedPrice: React.Dispatch<React.SetStateAction<number | string>>
    setFinishedOfferPrice: React.Dispatch<React.SetStateAction<number | string>>
    finishedPrice: number | string
    finishedOfferPrice: number | string
    setCurrentShow: React.Dispatch<React.SetStateAction<number>>
    currentShow: number
}

const PriceForm = ({ setFinishedPrice, setFinishedOfferPrice, setCurrentShow,
    finishedPrice, finishedOfferPrice, currentShow
}: Props) => {
    const [price, setPrice] = useState<number | string>('')
    const [priceError, setPriceError] = useState<boolean>(false)

    const [offerPrice, setOfferPrice] = useState<number | string>('')
    const [offerPriceError, setOfferPriceError] = useState<boolean>(false)

    const [offerPriceTooHighError, setOfferPriceTooHighError] = useState<boolean>(false)

    useEffect(() => {
        if (finishedPrice) {
            setPrice(finishedPrice)
        }
        if (finishedOfferPrice) {
            setOfferPrice(finishedOfferPrice)
        }
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (price === undefined || offerPrice === undefined) {
            return
        }
        if (price <= 0) {
            setPriceError(true)
            setTimeout(() => {
                setPriceError(false)
            }, 2000)
            return
        }
        if (offerPrice <= 0) {
            setOfferPriceError(true)
            setTimeout(() => {
                setOfferPriceError(false)
            }, 2000)
            return
        }
        if (offerPrice >= price) {
            setOfferPriceTooHighError(true)
            setTimeout(() => {
                setOfferPriceTooHighError(false)
            }, 3000)
            return
        }

        setFinishedPrice(price)
        setFinishedOfferPrice(offerPrice)
        setCurrentShow(currentShow + 1)
    }

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '')
        if (isNaN(parseInt(value))) {
            setPrice('')
            return
        }
        const valueInt = parseInt(value)

        if (valueInt <= 0) {
            return
        }
        setPrice(valueInt)
    }

    const handleOfferPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '')
        if (isNaN(parseInt(value))) {
            setOfferPrice('')
            return
        }
        const valueInt = parseInt(value)

        if (valueInt <= 0) {
            return
        }
        setOfferPrice(valueInt)
    }

    const handleBack = () => {
        setCurrentShow(currentShow - 1)
    }


    return (
        <div>
            <form className='flex flex-col gap-4'
                onSubmit={(e) => handleSubmit(e)}
            >
                {offerPriceTooHighError && <ErrorMessage text='Bieden vanaf mag niet hoger zijn dan de vraagprijs' />}
                {priceError && <ErrorMessage text='Vraagprijs is verplicht' />}
                <div>
                    <h1 className='md:text-lg text-md'>Vraagprijs:</h1>
                    <div className='border border-black flex items-center px-1'>
                        <span className='text-gray-500 font-bold'>€</span>
                        <input type="tel" name="price" className='border-none w-full outline-none bg-white text-black'
                            placeholder='0'
                            value={price}
                            onChange={(e) => handlePriceChange(e)}
                        />
                    </div>
                </div>

                {offerPriceError && <ErrorMessage text='Bieden vanaf is verplicht' />}
                <div>
                    <h1 className='md:text-lg text-md'>Bieden vanaf:</h1>
                    <div className='border border-black flex items-center px-1'>
                        <span className='text-gray-500 font-bold'>€</span>
                        <input type="tel" name="price" className='border-none w-full outline-none'
                            placeholder='0'
                            value={offerPrice}
                            onChange={(e) => handleOfferPriceChange(e)}
                        />
                    </div>
                </div>

                <div className='flex gap-1'>
                    <button type='button' className='secondary_btn w-full' onClick={handleBack}>Terug</button>
                    <button type='submit' className='primary_btn w-full'>Verder</button>
                </div>


            </form>
        </div>
    )
}

export default PriceForm