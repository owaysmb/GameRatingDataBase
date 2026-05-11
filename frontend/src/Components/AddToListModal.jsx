import { useState } from "react"
import { useParams } from "react-router-dom";

export function AddToListModal({close}) {
    const [seleceted,Setselected] = useState([]) 
    const { id } = useParams();
    const token = localStorage.getItem("token")
    
    const handlecheckbox = (list)=>{
        if(seleceted.includes(list)){
            Setselected(seleceted.filter(l => l !== list))
        }else{
            Setselected([...seleceted,list])
        }
    }

    const handlesave = async ()=>{
        await fetch(`http://localhost:3000/game/${id}/addtolist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status: seleceted })
  });
        close()
    }
    return(
        <>
        <div style={{display:"flex",justifyContent:"center",padding:"100px",position:"fixed",inset:"0",background:" rgba(0, 0, 0, 0.7)","zIndex": "9999"}}>
            <div style={{backgroundColor:"#111",width:"600px",maxHeight:"80vh",overflow:"auto",padding:"25px",borderRadius:"10px",boxShadow:"0 10px 30px rgba(0,0,0,0.4)"}}>
                <div style={{display:"flex",flexDirection:"column", justifyContent:"center",alignItems:"center",gap:"20px"}} >
                    <label><input type="radio" onChange={() => handlecheckbox("played")}  checked={seleceted.includes("played")}/> Played</label>
                    <label><input type="radio" onChange={() => handlecheckbox("playing")} checked={seleceted.includes("playing")}/> Playing</label>
                    <label><input type="radio" onChange={() => handlecheckbox("on-hold")} checked={seleceted.includes("on-hold")}/> on-hold</label>
                    <label><input type="radio" onChange={() => handlecheckbox("want to play")} checked={seleceted.includes("want to play")}/> want to play</label>
                    <label><input type="radio" onChange={() => handlecheckbox("dont want to play")} checked={seleceted.includes("dont want to play")}/> dont want to play</label>
                </div>
                <div >
                    <button onClick={close}>Cancel</button>
                    <button onClick={handlesave}>Save</button>
                </div>
            </div>
        </div>
            
        </>
    )
}