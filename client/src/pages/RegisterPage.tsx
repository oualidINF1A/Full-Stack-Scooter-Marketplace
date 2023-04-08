import React, {useContext, useState} from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage';
import { userContext } from '../context/UserContext';
import GoogleLogin from '../components/GoogleLogin';


const RegisterPage = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [password2, setPassword2] = useState<string>('');
    const [passwordsDontMatch, setPasswordsDontMatch] = useState<boolean>(false);
    const [notAllFieldsFilled, setNotAllFieldsFilled] = useState<boolean>(false);
    const [passwordTooShort, setPasswordTooShort] = useState<boolean>(false);
    const {setUser}  = useContext(userContext);

    const navigate = useNavigate();

    function checkIfPasswordsMatch(p1:string, p2:string):boolean {
        if (p1 === p2) {
            return true;
        } 
        return false;
    }

    const passwordCheck = (p1:string, p2:string):boolean => {
        if(password.length >= 8) {
            if(checkIfPasswordsMatch(p1,p2)){
                return true;
            }else{
                setPasswordsDontMatch(true);
                setTimeout(() => {
                    setPasswordsDontMatch(false);
                },1000)
                return false;
            }
            
        }
        setPasswordTooShort(true);
        setTimeout(() => {
            setPasswordTooShort(false);
        }, 1000)
        return false;
    }

    function checkAllFieldsFilled():boolean {
        if(name.length > 0 && email.length > 0 && password.length > 0 && password2.length > 0) {
            return true;
        }
        return false;
    }

    interface UserData {
        name:string,
        email:string
        _id:string
    }

    const handleSuccesfulRegister = (data:UserData) => {
        localStorage.setItem('SCOOTER_PLACE_USER_INFO', JSON.stringify({name:data.name, email:data.email, _id:data._id}));
        setUser({name:data.name, email:data.email, _id:data._id})
        navigate('/');
    }


    const handleRegister = async (e:React.FormEvent):Promise<void> => {
        e.preventDefault();
        if(!passwordCheck(password, password2)) {
            return
        }
        if(!checkAllFieldsFilled()){
            setNotAllFieldsFilled(true);
            setTimeout(() => {
                setNotAllFieldsFilled(false);
            },1000)
            return
        }

        const data = {name, email, password}
        axios.post('/auth/register', data).then(res => {
            handleSuccesfulRegister(res.data.userDoc)
        }).catch(err => {
            console.log(err);
        })
    }
        
    

  return (
    <div className='w-[100vw] h-[100vh] flex flex-col items-center -mt-32  fixed'>
        <form className='bg-white rounded-2xl p-8 md:min-w-[500px] min-w-[350px] flex flex-col gap-2'
        onSubmit={(e) => handleRegister(e)}
        >
            <h1 className='text-4xl font-bold'>Registreren</h1>
            {/* TODO ALLOW USER TO LOGIN USING GOOGLE */}
            {/* <GoogleLogin/> */}
            {notAllFieldsFilled && <ErrorMessage text='Vul alle velden in.'/> }
            {passwordTooShort && <ErrorMessage text='Wachtwoorden minimum 8 karakters.'/> }

            
            
            <div className='input_div'>
                <label>Naam:</label>
                <input type="text" placeholder='Type hier je naam te zien voor anderen...' 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='border border-black'
                />
                
            </div>

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
                <input type="password" placeholder='Type hier je email adres....' 
                autoComplete='new-password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={passwordsDontMatch ? 'border-red-500 border' : 'border border-black'}
                />
            </div>

            {passwordsDontMatch && <ErrorMessage text='Wachtwoorden komen niet overeen'/>}

            <div className='input_div'>
                <label>Herhaal wachtwoord:</label>
                <input type="password" placeholder='Type hier je email adres....'
                autoComplete='new-password'
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className={passwordsDontMatch ? 'border-red-500 border' : 'border border-black'}
                />
            </div>

            

            <button className='primary_btn mt-4'>Account Aanmaken</button>
        </form>

        <div>
            <h1 className='text-gray-800'>Al een account? <Link to={'/login'} className="text-indigo-500 underline">Log in</Link></h1>
        </div>

        
    </div>
  )
}

export default RegisterPage