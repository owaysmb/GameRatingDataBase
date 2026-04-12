import { login } from "../LoginPage/auth"
import { LoginForm } from "../LoginPage/LoginForm"
import { useNavigate } from "react-router-dom"

export function Login() {
    const navigate = useNavigate();
    const handleSubmit = async (data)=>{
        const res = await login(data)
        console.log(res)
        if (res.message === "Login successful") {
            localStorage.setItem("user", JSON.stringify(res.user));
            localStorage.setItem("token", res.token);
            navigate("/profile")
            window.location.reload();
        }
        
    }

    


    return(<LoginForm onSubmit={handleSubmit}/>)
}