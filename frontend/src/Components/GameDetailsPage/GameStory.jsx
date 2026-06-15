import { useState } from "react"
import { AddToListModal } from "../AddToListModal"
import { GameReviewModal } from "../GameReviewModal"
import { useNavigate } from "react-router-dom"

export function GameStory({game}) {
    const [open,Setopen] = useState(false)
    const [openReview,SetopenReview] = useState(false)
    const navigate = useNavigate();

    const buttonStyle = {
        width:"200px",
        height:"50px", 
        backgroundColor:"rgba(255,255,255,0.1)", 
        borderRadius:"10px", 
        display:"flex", 
        justifyContent:"center", 
        alignItems:"center",
        cursor:"pointer",
        color:"white"
    }

    function ShowAddTolist() {  
        return(
            <>
                <div onClick={()=>Setopen(true)} style={buttonStyle}>Add To List</div>

                 {open && <AddToListModal close={() => Setopen(false)} />}
            </>
        )
    }

    function ShowGameReview() {  
        return(
            <>
                <div onClick={()=>SetopenReview(true)} style={buttonStyle}>Review</div>

                 {openReview && <GameReviewModal close={() => SetopenReview(false)} />}
            </>
        )
    }





    return(
        <>
        <div style={{display:"flex",textAlign:"start",flexDirection:"column",padding:"30px",backgroundColor:"#111",marginTop:"40px",borderRadius:"10px"}}>
            <h2 style={{padding:"20px", color:"white"}} >Game Story / description</h2>
            <div style={{padding:"20px", color:"white", textAlign:"start",display:"flex",gap:"300px"}}>
                
                <p style={{fontSize:"20px", marginTop:"20px",width:"1500px"}}>{game.summary ? game.summary : "Summary not available for this game."}</p>

                <div style={{display:"flex",flexDirection:"column",gap:"40px"}}>

                    <div> <ShowAddTolist/></div>

                    <div> <ShowGameReview/></div>
                    <div style={buttonStyle} onClick={() => navigate(`/game/${game.id}/forum`)}> Forum </div>
                </div>

            </div>
        </div>
            
        </>
    )
}