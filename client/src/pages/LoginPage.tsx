import React, { useEffect, useState } from 'react'
import { userContext } from '../context/UserContext'
import { useContext } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import {useNavigate} from 'react-router-dom'
import GoogleLogin from '../components/GoogleLogin'

const LoginPage = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [showEmptyFieldError, setShowEmptyFieldError] = useState<boolean>(false)
    const [showInvalidPasswordError, setShowInvalidPasswordError] = useState<boolean>(false)
    const [showUserNotFoundError, setShowUserNotFoundError] = useState<boolean>(false)


    const navigate = useNavigate()

    const { setUser} = useContext(userContext);

    const handleLogin = () => {
        if(email == '' || password == ''){
            setShowEmptyFieldError(true)
            setTimeout(() => {
                setShowEmptyFieldError(false)
            }, 1500)
            return;
        }

        axios.post('auth/login', {email, password}).then(res => {
            
            const {userFound} = res.data 
            
            if(userFound){

                const {validPassword} = res.data
                if(validPassword){
                    const {userDoc} = res.data
                    setUser(userDoc)
                    navigate('/profile/profiel')
                }else{
                    setShowInvalidPasswordError(true)
                    setTimeout(() => {
                        setShowInvalidPasswordError(false)
                    }, 1500)
                }
            }else{
                setShowUserNotFoundError(true)
                setTimeout(() => {
                    setShowUserNotFoundError(false)
                }, 1500)
            }
        }).catch(err => {
            console.log(err)
        })
    }
        


  return (
    <div className='w-[100vw] flex flex-col -mt-28 items-center - fixed'>
            <form className='bg-white rounded-2xl p-8 md:min-w-[500px] min-w-[350px] flex flex-col gap-2'>

                    <h1 className='text-4xl font-bold mb-4'>Inloggen</h1>
                    
                    {/* TODO ALLOW USER TO LOGIN USING GOOGLE */}
                    {/* <GoogleLogin/> */}

                    {showEmptyFieldError && <ErrorMessage text='Vul alle velden in' />}
                    {showInvalidPasswordError && <ErrorMessage text='Onjuist wachtwoord.' />}
                    {showUserNotFoundError && <ErrorMessage text='Geen gebruiker op dit email adress.' />}


                    
                    <div className='input_div'>
                        <label>Email:</label>
                        <input type="email" placeholder='Type hier je email adres....'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='border border-black'
                        />
                    </div>

                    <div className='input_div'>
                        <label>Wachtwoord:</label>
                        <input type="password" placeholder='Type hier je wachtwoord....'
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        className='border border-black'
                        />
                    </div>


                    <button type='button' className='primary_btn mt-4' onClick={handleLogin}>Inloggen</button>
            </form>
        <div>
            <h1>Nog geen account? <Link to={'/register'} className="text-indigo-500 underline">Maak een account aan</Link></h1>
        </div>
    </div>
  )
}

export default LoginPage