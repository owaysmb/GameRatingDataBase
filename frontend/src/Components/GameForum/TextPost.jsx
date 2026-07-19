import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



export function TextPost() {

    const { id } = useParams();
    const [title,setTitle] = useState("");
    const [body,setBody] = useState("");
    const navigate = useNavigate();
    const handleTextSubmit = async ()=>{
        await fetch(`http://localhost:3000/game/${id}/addtextpost`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            credentials: "include",
            body:JSON.stringify({
                title:title,
                body:body,
            })
        })
        setTitle("");
        setBody("");
    }

    return(
        <>   
            <h1 style={{ textAlign:"center" }}>Text Post</h1>
            <form>
                 <div style={{
                    display:"flex",
                    flexDirection:"column",
                    gap:"20px",
                    marginTop:"20px",
                    alignItems:"center",
                }}>

                    <TextField
                        variant="filled"
                        label="Title"
                        maxRows={6}
                        style={{ width:"700px",backgroundColor:"lightblue",borderRadius:"10px", marginTop:"20px" }}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <TextField
                        id="filled-multiline-static"
                        label="Body"
                        multiline
                        rows={4}
                        variant="filled"
                        style={{ width:"700px",backgroundColor:"lightblue",borderRadius:"10px", marginTop:"20px" }}
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                                        />
                    <button 
                        type="submit" 
                        style={{ 
                            backgroundColor:"black",
                            border:"none",
                            borderRadius:"10px", 
                            padding:"10px 20px", 
                            marginTop:"20px",
                            color:"#ff4aa3",
                            fontSize:"16px",
                            cursor:"pointer",
                            bold:"true" ,
                            boxShadow:"0 4px 8px rgba(255, 74, 163, 0.5)",
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                title.length > 0 && body.length > 0 ? handleTextSubmit() && navigate(`/game/${id}/forum`) : alert("Please fill in both the title and body fields.");
                                
                                 
                            }}
                            
                            
                    >Submit</button>
                </div>
                

            </form>    
               
                
        </>
    )
}