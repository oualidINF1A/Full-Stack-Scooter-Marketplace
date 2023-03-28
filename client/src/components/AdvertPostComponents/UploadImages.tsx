import React, { useEffect, useState } from 'react'
import ErrorMessage from '../ErrorMessage'
import ImageDisplay from './ImageDisplay'

interface Props {
    setCurrentShow: React.Dispatch<React.SetStateAction<number>>
    setFinishedImages: React.Dispatch<React.SetStateAction<string[] | []>>
    finishedImages: string[]
    currentShow: number
}

const UploadImages = ({ setCurrentShow, setFinishedImages, currentShow, finishedImages }: Props) => {
    const [images, setImages] = useState<string[]>([])
    const [imagesError, setImagesError] = useState<boolean>(false)

    useEffect(() => {
        if(finishedImages.length > 0) setImages(finishedImages)
    }, [])


    const handleNext = () => {
        if (images.length === 0) {
            setImagesError(true)
            setTimeout(() => {
                setImagesError(false)
            }, 2000)
            return
        }
        setFinishedImages(images)
        setCurrentShow(currentShow + 1)
    }


    const handleBack = () => {
        setCurrentShow(currentShow - 1)
    }

    const handleNewImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (images.length > 6) return
        const file = e.target.files![0]
        //todo upload to cloudinary
        
        const base64 = await convertToBase64(file)
        setImages([...images, base64 as string])
        e.target.value = '';
    }



    return (
        <div>
            {imagesError && <ErrorMessage text='Upload minstens 1 foto.' />}
            <div className='flex gap-2  '>
                <button className='primary_btn w-fit'>
                    <label className='w-full p-1'>
                        Upload
                        <input type="file" name='MyFile' id='file-upload'
                            accept='.jpeg, .png, .jpg'
                            onChange={(e) => handleNewImage(e)}
                            className='hidden w-full'
                        />
                    </label>

                </button>
                <button className='secondary_btn'
                    onClick={() => setImages([])}
                >
                    Verwijder
                </button>
            </div>







            <p className='text-gray-500'>{images.length} / 7</p>
            <ImageDisplay setImages={setImages} images={images} />


            <div className='flex gap-1'>
                <button className='secondary_btn w-full' onClick={handleBack}>Terug</button>
                <button className='primary_btn  w-full' onClick={handleNext}>Verder</button>
            </div>
        </div>
    )
}

export default UploadImages

function convertToBase64(file: File) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result)
        }
        fileReader.onerror = (error) => {
            reject(error)
        }
    })
}