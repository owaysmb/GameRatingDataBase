import { useState } from "react"
import { useParams } from "react-router-dom";

export function GameReviewModal({close}) {
    const [review, setReview] = useState("")
    const { id } = useParams();

    const handlesave = async ()=>{
        await fetch(`http://localhost:3000/game/${id}/addreview`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ review: review })
  });
        close()
    }
    return(
        <>
        <div style={{display:"flex",justifyContent:"center",padding:"100px",position:"fixed",inset:"0",background:" rgba(0, 0, 0, 0.7)","zIndex": "9999"}}>

            <form style={{backgroundColor:"#111",width:"600px",maxHeight:"80vh",overflow:"auto",padding:"25px",borderRadius:"10px",boxShadow:"0 10px 30px rgba(0,0,0,0.4)"}}>
                    <p style={{color:"white",fontSize:"24px",marginBottom:"20px"}}>Review The Game </p>

                    <textarea 
                        rows="4" 
                        cols="50" 
                        style={{backgroundColor:"#111",color:"white",border:"1px solid #ccc",borderRadius:"5px",padding:"10px"}}
                        onChange={(e) => setReview(e.target.value)}
                    ></textarea>

                    <br></br>

                    <input 
                        type="submit" 
                        value="Submit" 
                        style={{backgroundColor:"#111",color:"white",border:"1px solid #ccc",borderRadius:"5px",padding:"10px"}}
                        onClick={(e) => {e.preventDefault(); handlesave();}}
                    ></input>
                
                
            </form>

            <div  >
                <button onClick={close}>Cancel</button>
                <button onClick={handlesave}>Save</button>
            </div>

        </div>
            
        </>
    )
}