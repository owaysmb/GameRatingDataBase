import { createContext,useState,useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({children}) {
    const [ user,SetUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const fetchUser = async () => {
            try {
                const res = await fetch("http://localhost:3000/me", {
                    credentials: "include"
                });
                if (res.ok) {
                    const data = await res.json();
                    SetUser(data.user);
                }
            } catch (err) {
                console.log("Not authenticated");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    },[]);

    const login = async () =>{
        const res = await fetch("http://localhost:3000/me", {
            credentials: "include"
        });
        if (res.ok) {
            const data = await res.json();
            SetUser(data.user);
            return data.user;
        }
        return null;
    }

    const updateUser = (updatedUser) => {
        SetUser(updatedUser);
    }

    const logout = async ()=>{
        try {
            await fetch("http://localhost:3000/logout", {
                method: "POST",
                credentials: "include"
            });
        } catch (err) {
            console.log("Logout error:", err);
        }
        SetUser(null);
    }

    return(
        <AuthContext.Provider value={{user,login,logout,updateUser,loading}}>
            {children}
        </AuthContext.Provider>
    )

}
