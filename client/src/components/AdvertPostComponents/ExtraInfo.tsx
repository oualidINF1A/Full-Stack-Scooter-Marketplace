import React, { useEffect, useState } from 'react'
import ErrorMessage from '../ErrorMessage'

interface ExtraInfo {
    condition: string;
    licensePlateType: string;
    cylinderCapacity: string;
    yearOfConstruction: string;
    mileage: string;

}

interface Props {
    setExtraInfo: React.Dispatch<React.SetStateAction<ExtraInfo | null>>
    extraInfo: {
        condition: string;
        licensePlateType: string;
        cylinderCapacity: string;
        yearOfConstruction: string;
        mileage: string;
    } | null
    setCurrentShow: React.Dispatch<React.SetStateAction<number>>
    currentShow: number
}

const ExtraInfo = ({ setCurrentShow, setExtraInfo, extraInfo, currentShow }: Props) => {
    const [condition, setCondition] = useState<string>('')
    const [licensePlateType, setLicensePlateType] = useState<string>('')
    const [cylinderCapacity, setCylinderCapacity] = useState<string>('')
    const [yearOfConstruction, setYearOfConstruction] = useState<string>('')
    const [mileage, setMileage] = useState<string>('')

    const [yearToHighError, setYearToHighError] = useState<boolean>(false)
    const [emptyFieldsError, setEmptyFieldsError] = useState<boolean>(false)

    useEffect(() => {
        if (extraInfo) {
            setCondition(extraInfo.condition)
            setLicensePlateType(extraInfo.licensePlateType)
            setCylinderCapacity(extraInfo.cylinderCapacity)
            setYearOfConstruction(extraInfo.yearOfConstruction)
            setMileage(extraInfo.mileage)
        }
    }, [])

    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '')
        if (value.length > 4) {
            return
        }
        if (value.length === 4 && parseInt(value) > new Date().getFullYear()) {
            setYearToHighError(true)
            setTimeout(() => {
                setYearToHighError(false)
            }, 2000)
            return
        }

        setYearOfConstruction(value)
    }

    const handleCilinderCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '') // remove all non numeric characters

        // return if value is dash
        setCylinderCapacity(value)
    }

    const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '')
        if (value.length > 6) {
            return
        }

        setMileage(value)
    }

    const handleBack = () => {
        setCurrentShow(currentShow - 1)
    }

    const handleNext = () => {
        if (condition.length <= 0 || licensePlateType.length <= 0 || cylinderCapacity.length <= 0 || yearOfConstruction.length <= 0 || mileage.length <= 0) {
            setEmptyFieldsError(true)
            setTimeout(() => {
                setEmptyFieldsError(false)
            }, 2000)
            return
        }

        if (parseInt(yearOfConstruction) < 1900) {
            setYearToHighError(true)
            setTimeout(() => {
                setYearToHighError(false)
            }, 2000)
            return
        }
        setExtraInfo({
            condition,
            licensePlateType,
            cylinderCapacity,
            yearOfConstruction,
            mileage
        })
        setCurrentShow(currentShow + 1)
    }

    return (
        <div className='flex flex-col gap-4'>
            {emptyFieldsError && <ErrorMessage text='Vul alle velden in.' />}
            <div className='flex flex-col gap-0'>
                <h1 className='md:text-lg text-sm'>Conditie:</h1>
                <select className='border rounded-none' value={condition} onChange={(e) => setCondition(e.target.value)}>
                    <option className=''> Kies een optie... </option>
                    <option value="Nieuw">Nieuw</option>
                    <option value="Zo goed als nieuw">Zo goed als nieuw</option>
                    <option value="gebruikt">Gebruikt</option>
                </select>
            </div>

            <div className='flex flex-col gap-0'>
                <h1 className='md:text-lg text-sm'>Kenteken type:</h1>
                <select className='border rounded-none' value={licensePlateType} onChange={(e) => setLicensePlateType(e.target.value)}>
                    <option > Kies een optie... </option>
                    <option className='flex' value="Geel">Geel 45km/u</option>
                    <option value="Blauw">Blauw 25km/u</option>
                    <option value="Anders">Anders</option>
                </select>
            </div>

            <div className='flex flex-col gap-0'>
                <h1 className='md:text-lg text-sm'>Cilinderinhoud:</h1>
                <div className='flex border-black border items-center px-1'>
                    <input type="tel" className='outline-none w-full p-1' placeholder="Cilinderinhoud" maxLength={4} min={0}
                        value={cylinderCapacity} onChange={(e) => handleCilinderCapacityChange(e)}
                    />
                    <span className=' text-gray-500'>CC</span>
                </div>
            </div>

            <div className='flex flex-col gap-0'>
                <h1 className='md:text-lg text-sm'>Bouwjaar:</h1>
                <div className={yearToHighError ? 'flex border-red-500 border items-center px-1' : 'flex border-black border items-center px-1'}>
                    <input type="tel" className='outline-none w-full p-1' placeholder="Bouwjaar"
                        value={yearOfConstruction} onChange={(e) => handleYearChange(e)}
                    />
                    <span className=' text-gray-500'>YYYY</span>
                </div>
                {yearToHighError && <span className='text-red-500 text-xs'>Bouwjaar moet tussen 1900 en huidig jaar liggen.</span>}
            </div>

            <div className='flex flex-col gap-0'>
                <h1 className='md:text-lg text-sm'>Kilometerstand:</h1>
                <div className='flex border-black border items-center px-1'>
                    <input type="tel" className='outline-none w-full p-1' placeholder="Kilometerstand"
                        value={mileage} onChange={(e) => handleMileageChange(e)}
                        min={0}
                    />
                    <span className=' text-gray-500'>km</span>
                </div>
            </div>
            <div className='flex space-evenly w-full gap-1'>
                <button onClick={handleBack} className='secondary_btn w-full'>Terug</button>
                <button onClick={handleNext} className='primary_btn w-full '>Verder</button>
            </div>


        </div>
    )
}

export default ExtraInfo