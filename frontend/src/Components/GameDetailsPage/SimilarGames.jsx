
import { useRef } from "react"
import { useNavigate } from "react-router-dom";
import { FaArrowCircleLeft } from "react-icons/fa";
import { FaArrowAltCircleRight } from "react-icons/fa";

export function SimilarGames({game}) {
    const navigate = useNavigate();
    const MediaRef = useRef(null);
    const scrollLeft = ()=>{
        MediaRef.current.scrollBy({left:-400,behavior:"smooth"});
    }
    const scrollRight = ()=>{
        MediaRef.current.scrollBy({left:400,behavior:"smooth"});
    }


    return(
        <>
            <div style={{padding:"40px 80px"}}>
                <h1 style={{color:"#f5f5f5",padding:"0 0 20px 0",fontSize:"32px",fontWeight:"700"}}>Similar Games</h1>
                {game.similarGames?.length === 0 ? <p style={{color:"#8a8a8a"}}>No similar games available Right Now</p> :
                (
                <div style={{position:"relative",display:"flex",alignItems:"center"}}>
                    <FaArrowCircleLeft style={{
                        fontSize:"36px",
                        color:"#b3b3b3",
                        position:"absolute",left:"-18px",
                        cursor: "pointer",
                        zIndex: "100",
                        background:"#0a0a0a",
                        borderRadius:"50%"}} 
                        onClick={scrollLeft}/>
    
                    <div style={{display:"flex",gap:"16px",overflowX:"auto",overflowY:"hidden",scrollBehavior:"smooth",padding:"4px 0"}} ref={MediaRef}>
                        {game.similarGames && (
                        game.similarGames.map((s,i) =>(
                            <div onClick={() => navigate(`/game/${s.id}`)} style={{cursor:"pointer",minWidth:"200px"}}key={i}>
                                <img
                                    src={`https:${s.cover?.url?.replace("t_thumb", "t_cover_big")}`}
                                    alt={s.name}
                                    style={{borderRadius:"8px",width:"200px",height:"280px",objectFit:"cover",border:"1px solid #2a2a2a" }}
                                />
                                <p style={{color:"#f5f5f5",marginTop:"10px"}}>{s.name}</p>
                            </div>
                        ))
                        )}
                    </div>
                    <FaArrowAltCircleRight 
                    style={{
                        fontSize:"36px",
                        color:"#b3b3b3",
                        position:"absolute",
                        right:"-18px",
                        cursor: "pointer",
                        background:"#0a0a0a",
                        borderRadius:"50%"
                        }} 
                        onClick={scrollRight}/>
                </div>
                )}
            </div>
        </>
    
)}