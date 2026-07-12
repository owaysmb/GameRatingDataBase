import { useNavigate } from "react-router-dom";

export function LoginForm({ onSubmit, disabled, lockMessage }) {
    const token = localStorage.getItem("token")
    const onFormSubmit = (e) => {
        e.preventDefault();
        if (disabled) {
            return;
        }

        onSubmit({
            email: e.target.email.value,
            password: e.target.password.value,
        });
    };
    const navigate = useNavigate();

    return(
        <>
            {/* the entire form for login and signup */}
            <div style={{display:"flex",justifyContent:"center",alignItems:"center",minHeight:"100vh",width:"100%",color:'white',fontFamily:"cursive",padding:"20px",boxSizing:"border-box"}}>
                <div style={{backgroundColor:"black",width:"100%",maxWidth:"500px",minHeight:"500px",display:"flex",alignItems:"center",flexDirection:"column",gap:"50px",borderRadius:"20px",padding:"30px",boxSizing:"border-box"}}>
                    <h1>Login Here !</h1>
                    <div style={{display:"flex",flexDirection:"column"}}>
                        <form onSubmit={onFormSubmit}>
                            <label>Email: </label><br></br>   
                            <input name="email" style={{width:"300px",height:"30px",borderRadius:"5px"}} /><br /><br />
                            <label>Password: </label><br></br>
                            <input name="password" style={{width:"300px",height:"30px",borderRadius:"5px"}}/><br/><br />
                            <input
                                type="submit"
                                value="Log in"
                                disabled={disabled}
                                style={{
                                    width:"100px",
                                    height:"40px",
                                    borderRadius:"5px",
                                    backgroundColor: disabled ? "#999" : "#3cff00",
                                    cursor: disabled ? "not-allowed" : "pointer"
                                }}
                            />
                            <input 
                                type="button" 
                                value="Sign Up" 
                                style={{width:"100px",height:"40px",borderRadius:"5px",backgroundColor:"#00ffff",cursor:"pointer"}}
                                onClick={()=>navigate("/signup")}
                            />
                        </form>
                        {lockMessage && <p style={{ color: "#f88", marginTop: "10px" }}>{lockMessage}</p>}
                        <p>Forgot password?</p>
                    </div>
                </div>
            </div>
        </>
    )
}