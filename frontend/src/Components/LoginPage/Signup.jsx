import { SignupForm } from "./SignupForm"
import { signup } from "./auth"
import { useNavigate } from "react-router-dom"

export function Signup() {
    const navigate = useNavigate()
    const handleSubmit = async (data)=>{
        const res = await signup(data)
        console.log(res)
        if(res.message == "Signup successful"){
            navigate("/")
        }
    }
    return(<SignupForm onSubmit={handleSubmit}/>)
}