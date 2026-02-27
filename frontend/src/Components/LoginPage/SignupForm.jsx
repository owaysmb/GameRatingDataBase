import { useNavigate } from "react-router-dom";

export function SignupForm({onSubmit}) {
    const navigate = useNavigate();
    const onFormSubmit = (e) => {
    e.preventDefault();
    
    onSubmit({
        username:e.target.username.value,
        email: e.target.email.value,
        password: e.target.password.value,
    });
  };
    return(
        <>
            {/* the entire form for login and signup */}
            <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",color:'white',fontFamily:"cursive"}}>
                <div style={{backgroundColor:"black",width:"500px",height:"500px",display:"flex",alignItems:"center",flexDirection:"column",gap:"50px",borderRadius:"20px"}}>
                    <h1>Sign Up Here !</h1>
                    <div style={{display:"flex",flexDirection:"column"}}>
                        <form  onSubmit={onFormSubmit}>
                            <label>Username: </label><br></br>   
                            <input name="username" style={{width:"150px",height:"30px",borderRadius:"5px"}} /><br /><br />
                            <label>Email: </label><br></br>   
                            <input name="email" style={{width:"300px",height:"30px",borderRadius:"5px"}} /><br /><br />
                            <label>Password: </label><br></br>
                            <input name="password" style={{width:"300px",height:"30px",borderRadius:"5px"}}/><br/><br />
                            <input 
                            type="button" 
                            value="Log in" 
                            style={{width:"100px",height:"40px",borderRadius:"5px",backgroundColor:"#3cff00",cursor:"pointer"}}
                            onClick={()=>navigate("/login")}></input>
                            <input type="submit" value="Sign Up" style={{width:"100px",height:"40px",borderRadius:"5px",backgroundColor:"#00ffff",cursor:"pointer"}}></input>
                        </form>
                        
                    </div>
                </div>
                
            </div>

        </>
    )
}