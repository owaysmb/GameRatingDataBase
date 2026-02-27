import { createContext,useState,useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({children}) {
    const [ user,SetUser] = useState(null);

    useEffect(()=>{
        const savedUser = localStorage.getItem("user")
        if(savedUser){
           SetUser(JSON.parse(savedUser)); 
        }
        
    },[]);

    const login = (userData,token) =>{
        localStorage.setItem("user",JSON.stringify(userData))
        localStorage.setItem("token",token);
        SetUser(userData)
        
    }

    const logout = ()=>{
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        SetUser(null);
    }

    return(
        <AuthContext.Provider value={{user,login,logout}}>
            {children}
        </AuthContext.Provider>
    )

}