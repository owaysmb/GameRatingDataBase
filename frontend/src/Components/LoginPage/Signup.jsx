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
        }else {
            alert("Signup failed. Please one of these - input fields are empty , invalid input , email is not a Gmail address.");
        }
    }
    return(<SignupForm onSubmit={handleSubmit}/>)
}