import { SignupForm } from "./SignupForm";
import { useNavigate } from "react-router-dom";

export function LoginForm({onSubmit}) {
    const token = localStorage.getItem("token")
    const onFormSubmit = (e) => {
    e.preventDefault();
    
    onSubmit({
      email: e.target.email.value,
      password: e.target.password.value,
    });
  };
    const navigate = useNavigate();
    console.log("Generated token:", token);
    return(
        <>
            {/* the entire form for login and signup */}
            <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",color:'white',fontFamily:"cursive"}}>
                <div style={{backgroundColor:"black",width:"500px",height:"500px",display:"flex",alignItems:"center",flexDirection:"column",gap:"50px",borderRadius:"20px"}}>
                    <h1>Login Here !</h1>
                    <div style={{display:"flex",flexDirection:"column"}}>
                        <form  onSubmit={onFormSubmit}>
                            <label>Email: </label><br></br>   
                            <input name="email" style={{width:"300px",height:"30px",borderRadius:"5px"}} /><br /><br />
                            <label>Password: </label><br></br>
                            <input name="password" style={{width:"300px",height:"30px",borderRadius:"5px"}}/><br/><br />
                            <input type="submit" value="Log in" style={{width:"100px",height:"40px",borderRadius:"5px",backgroundColor:"#3cff00",cursor:"pointer"}}></input>
                            <input 
                            type="button" 
                            value="Sign Up" 
                            style={{width:"100px",height:"40px",borderRadius:"5px",backgroundColor:"#00ffff",cursor:"pointer"}}
                            onClick={()=>navigate("/signup")}
                            ></input>
                        </form>
                        
                    </div>
                </div>
                
            </div>

        </>
    )
}