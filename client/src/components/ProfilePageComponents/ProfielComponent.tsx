import React, { useEffect, useState } from 'react'
import { userContext } from '../../context/UserContext'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { TailSpin } from 'react-loader-spinner'
import axios from 'axios'

interface UserProp {
    user: {
        name: string,
        email: string,
        _id: string
    }
}

const ProfielComponent = () => {
    const [showForm, setShowForm] = useState<boolean>(false)
    const [name, setName] = useState<string | undefined>('')
    const [email, setEmail] = useState<string | undefined>('')
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()

    const { user, setUser } = useContext(userContext)

    useEffect(() => {
        setName(user.name);
        setEmail(user.email)
    }, [])

    const handleSave = async () => {
        if (name == user.name && email == user.email) {
            setShowForm(false)
            return;
        }
        setLoading(true)
        axios.put('auth/update', { newName: name, newEmail: email, _id: user._id }).then(res => {
            const { userDoc } = res.data
            setUser({ name: userDoc.name, email: userDoc.email, _id: userDoc._id })
            setLoading(false)
            setShowForm(false)
        })


    }

    const handleCancel = () => {
        setShowForm(false)
    }

    const handleLogout = () => {
        setUser({})
        localStorage.removeItem('SCOOTER_PLACE_USER_INFO')
        navigate('/login')
    }



    if (showForm) {
        if (loading) return (<div className='flex w-full min-wift justify-center mt-4'>
            <TailSpin color='gray' />
        </div>)

        return (
            <div className='flex w-full min-w-fit justify-center mt-4'>
                <form className='bg-white md:p-8 p-4 rounded-lg'>
                    <h1 className='md:text-2xl text-lg'>Profiel Gegevens</h1>
                    <div className='input_div'>
                        <label>Naam:</label>
                        <input type="text" placeholder='Type hier je nieuwe naam...'
                            value={name}
                            className='border border-black'
                            onChange={(e) => setName(e.target.value)}
                        />

                    </div>

                    <div className='input_div'>
                        <label>Email:</label>
                        <input type="email" placeholder='Type hier je nieuw email adres....'
                            value={email}
                            className='border border-black'
                            onChange={(e) => setEmail(e.target.value)}
                        />

                    </div>
                    <div className='flex justify-between'>
                        <button type='button' className='secondary_btn'
                            onClick={handleCancel}
                        >Annuleren</button>

                        <button type='button' className='primary_btn'
                            onClick={handleSave}
                        >Opslaan</button>
                    </div>

                </form>
            </div>
        )
    }

    return (
        <div className='w-full min-w-fit h-full min-h-fit mt-8 flex justify-center'>
            <div className='w-fit min-w-fit flex flex-col jusitfy-center md:gap-4 gap-2 md:p-12 p-4 bg-white text-black rounded-lg'>
                <h1 className='md:text-2xl text-xl'>{user.name}</h1>
                <div className='flex flex-col gap-2'>

                    <div className='flex items-center gap-4'>
                        <h1>Naam:</h1>
                        <h1 className='italic'>{user.name}</h1>
                    </div>

                    <div className='flex items-center gap-4'>
                        <h1>Email:</h1>
                        <h1 className=' italic'>{user.email}</h1>
                    </div>

                    <button className='secondary_btn' onClick={(e) => setShowForm(!showForm)}>Wijzigen</button>
                    <button className='primary_btn' onClick={handleLogout}>Uitloggen</button>


                </div>
            </div>

        </div>
    )
}

export default ProfielComponent