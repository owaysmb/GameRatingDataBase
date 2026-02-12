import { login } from "../LoginPage/auth"
import { LoginForm } from "../LoginPage/LoginForm"
import { useNavigate } from "react-router-dom"

export function Login() {
    const navigate = useNavigate();
    const handleSubmit = async (data)=>{
        const res = await login(data)
        console.log(res)
        if (res.message === "Login successful") {
            navigate("/profile")
        }
    }

    


    return(<LoginForm onSubmit={handleSubmit}/>)
}