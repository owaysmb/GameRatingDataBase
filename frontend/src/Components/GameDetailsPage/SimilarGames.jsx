
import { useRef } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowCircleLeft } from "react-icons/fa";
import { FaArrowAltCircleRight } from "react-icons/fa";
// import { SimilarGameCard } from "./SimilarGameCard";

export function SimilarGames({game}) {
    const navigate = useNavigate();
    const MediaRef = useRef(null);
    const scrollLeft = ()=>{
        MediaRef.current.scrollBy({left:-350,behavior:"smooth"});
    }
    const scrollRight = ()=>{
        MediaRef.current.scrollBy({left:350,behavior:"smooth"});
    }


    return(
        <>
        {/* similar games suggestions */}
            <div style={{padding:"80px"}}>
                        <h1 style={{color:"white",padding:"20px"}}>Similar Games</h1>
                        {game.similarGames?.length === 0 ? <p style={{color:"white"}}>No similar games available Right Now</p> :
                        (
                        <div style={{position:"relative",display:"flex",alignItems:"center"}}>
                            <FaArrowCircleLeft style={{
                                fontSize:"40px",
                                color:"rgb(0, 204, 255)",
                                position:"absolute",left:"0",
                                cursor: "pointer",
                                zIndex: "100"}} 
                                onClick={scrollLeft}/>
            
                        <div style={{display:"flex",gap:"20px",overflow:"hidden"}} ref={MediaRef}>
                            {game.similarGames && (
                            game.similarGames.map((s,i) =>(
                                <div onClick={() => navigate(`/game/${s.id}`)} style={{cursor:"pointer"}}key={i}>
                                    <img
                                        
                                        src={`https:${s.cover?.url?.replace("t_thumb", "t_cover_big")}`}
                                        alt={s.name}
                                        style={{borderRadius:"40px",width:"300px",height:"350px" }}
                                />
                                <p style={{color:"white",textAlign:"center"}}>{s.name}</p>
                                </div>
                                 
                            ))
                            )}
                        </div>
                        <FaArrowAltCircleRight 
                        style={{
                            fontSize:"40px",
                            color:"rgb(0, 204, 255)",
                            position:"absolute",
                            right:"0",
                            cursor: "pointer"
                            }} 
                            onClick={scrollRight}/>
                        </div>
                        )}
                        
                    </div>
        </>
    
)}