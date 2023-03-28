import React, { useEffect, useState } from 'react'
import ErrorMessage from '../ErrorMessage'

interface Props {
  finishedTitle: string,
  finishedDescription: string,
  setFinishedTitle: React.Dispatch<React.SetStateAction<string>>
  setFinishedDescription: React.Dispatch<React.SetStateAction<string>>
  setCurrentShow: React.Dispatch<React.SetStateAction<number>>
  currentShow: number
}

const TitleAndDescriptionForm = ({
  finishedTitle, finishedDescription,
  setFinishedDescription, setFinishedTitle,
  setCurrentShow, currentShow }: Props) => {


  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [titleError, setTitleError] = useState<boolean>(false)
  const [descriptionError, setDescriptionError] = useState<boolean>(false)

  const maxTitleLength = 50

  useEffect(() => {
    setTitle(finishedTitle)
    setDescription(finishedDescription)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (description.length <= 0) {
      setDescriptionError(true)
      setTimeout(() => {
        setDescriptionError(false)
      }, 2000)
      return
    }

    if (title.length <= 0) {
      setTitleError(true)
      setTimeout(() => {
        setTitleError(false)
      }, 2000)
      return
    }
    setFinishedTitle(title)
    setFinishedDescription(description)
    setCurrentShow(currentShow + 1)
  }

  const handleBack = () => {
    setCurrentShow(currentShow - 1)
  }

  return (
    <div>
      <form className='flex flex-col gap-4' onSubmit={(e) => handleSubmit(e)}>
        <div>
          <h1>Titel <span className='text-gray-500'>(verplicht)</span></h1>
          {titleError && <ErrorMessage text='Titel is verplicht' />}
          <div className='border-2  flex mt-1 '>
            <input className='border-none w-full outline-none' type="text" placeholder="Titel van je advertentie..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={maxTitleLength}
            />
            <span className=' text-gray-500 text-end'>{maxTitleLength - title.length}</span>
          </div>
        </div>

        <h1>Beschrijving <span className='text-gray-500'>(verplicht)</span></h1>
        {descriptionError && <ErrorMessage text='Beschrijving is verplicht' />}

        <div className='border-2 flex '>
          <textarea
            placeholder="Beschrijving van je advertentie...." value={description}
            className='border-none w-full outline-none'
            cols={20} rows={8}
            onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className='flex gap-1'>
          <button type='button' className='secondary_btn w-full' onClick={handleBack}>Terug</button>
          <button className='primary_btn w-full'>Verder</button>
        </div>

      </form>
    </div>
  )
}

export default TitleAndDescriptionForm