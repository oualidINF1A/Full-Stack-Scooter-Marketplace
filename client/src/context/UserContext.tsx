import { createContext, useEffect, useState } from "react";


interface User {
    name?: string,
    email?: string,
    _id?: string
}

interface Props{
    children?: React.ReactNode
}


export const userContext = createContext({} as {user: User, setUser: React.Dispatch<React.SetStateAction<User>>});


export const UserContextProvider = ({
    children, 
}:Props) => {
    const [user, setUser] = useState<User>({});

    useEffect(() => {
        if(localStorage.getItem('SCOOTER_PLACE_USER_INFO')){
            const data = JSON.parse(localStorage.getItem('SCOOTER_PLACE_USER_INFO') as string)
            setUser(data)
        }
    },[])

    useEffect(() => {
        if(!user.name) return
        localStorage.setItem('SCOOTER_PLACE_USER_INFO', JSON.stringify(user))
    },[user])

    return <userContext.Provider value={{user, setUser}}>{children}</userContext.Provider>
}

