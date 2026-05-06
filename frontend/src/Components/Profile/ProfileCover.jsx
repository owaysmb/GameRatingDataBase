import reactLogo from '../../assets/react.svg'
import { useContext } from 'react';
import { AuthContext } from "../../../context/AuthContext";


export function ProfileCover() {
   
    const { user, logout } = useContext(AuthContext);


    return(
        <>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"80%",padding:"50px"}}>
                
                <div style={{display:"flex",alignItems:"center",gap:"100px"}}>
                    <img src={reactLogo} style={{cursor:"pointer",width:"200px",height:"auto"}} />
                    <div>
                        <h1>{user?.username}</h1>
                        <h2>{user?.email}</h2>
                        <div style={{display:"flex",gap:"20px"}}>
                            <button style={{backgroundColor:"rgb(0, 217, 255)",fontSize:"20px",borderRadius:"10px",cursor:"pointer"}}>Settings</button>
                            <button style={{backgroundColor:"rgb(0, 217, 255)",fontSize:"20px",borderRadius:"10px",cursor:"pointer"}}>Edit Profile</button>
                        </div>
                        
                    </div>
                    
                </div>
                <div style={{display:"grid"}}>
                    <h1>Rank: Legendary Master </h1>
                    <h1>Last Online :</h1>
                </div>
                
            </div>
        </>
    )
}