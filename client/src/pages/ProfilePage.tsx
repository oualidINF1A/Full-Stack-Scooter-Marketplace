import React, { useEffect, useState } from 'react'
import { userContext } from '../context/UserContext'
import { useContext } from 'react'
import { useParams } from 'react-router-dom'
import ProfielComponent from '../components/ProfilePageComponents/ProfielComponent'
import MijnAdvertenties from '../components/ProfilePageComponents/MijnAdvertenties'
import MijnFavorietenComponents from '../components/ProfilePageComponents/MijnFavorietenComponents'
import { useNavigate } from 'react-router-dom'

const ProfilePage = () => {
    const { choice } = useParams() as { choice: string }
    const [active, setActive] = useState<string>(choice)
    const { user } = useContext(userContext)
    const navigate = useNavigate()

    useEffect(() => {
        setActive(choice)
    }, [choice])

    


    if (!user._id) {
        return (
            <div className='w-full h-full flex flex-col gap-8 m-4 items-center justify-center'>
                <h1 className='md:text-xl text-lg'>Je bent niet ingelogd.</h1>
                <button className='primary_btn' onClick={() => navigate('/login')}>Log in</button>
            </div>
        )

    }


    return (
        <div>
            <div className=' bg-gray-700 min-w-fit flex flex-col items-center text-white'>
                <h1 className='W-100VW p-16 md:text-4xl text-xl text-center '>Mijn Dashboard</h1>
                <div className='flex space-between gap-4'>
                    <div className={active == 'profiel' ? 'profiel_item border-b-4 text-white border-gray-500' : 'profiel_item text-gray-400'}
                        onClick={() => setActive('profiel')}
                    >Profiel
                    </div>

                    <div className={active == 'advertenties' ? 'profiel_item border-b-4 text-white border-gray-500' : 'profiel_item text-gray-400'}
                        onClick={() => setActive('advertenties')}
                    >Mijn Advertenties
                    </div>

                    <div className={active == 'favorieten' ? 'profiel_item border-b-4 text-white border-gray-500' : 'profiel_item text-gray-400'}
                        onClick={() => setActive('favorieten')}
                    >Mijn Favorieten</div>

                </div>
            </div>
            <div>
                {active == 'profiel' && (
                    <ProfielComponent />
                )}

                {active == 'advertenties' && (
                    <MijnAdvertenties user={user} />
                )}

                {active == 'favorieten' && (
                    <MijnFavorietenComponents user={user}/>
                )}
            </div>
        </div>
    )
}

export default ProfilePage