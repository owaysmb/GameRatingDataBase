import { useRef } from "react"
import { FaArrowCircleLeft } from "react-icons/fa";
import { FaArrowAltCircleRight } from "react-icons/fa";

export function GameMedia({game}) {
    const MediaRef = useRef(null);
    const scrollLeft = ()=>{
        MediaRef.current.scrollBy({left:-650,behavior:"smooth"});
    }
    const scrollRight = ()=>{
        MediaRef.current.scrollBy({left:650,behavior:"smooth"});
    }
    return(
    <> 
    {/* screeshots of gameplay  */}
        <div style={{padding:"80px"}}>
            <h1 style={{color:"white",padding:"20px"}}>Media</h1>
            {game.screenshots?.length === 0 ? <p style={{color:"white"}}>No media available Right Now</p> : 
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
                { (
                game.screenshots?.map(s =>(
                     <img
                    src={`https:${s.url.replace("t_thumb", "t_screenshot_big")
                        .replace("t_screenshot_med", "t_screenshot_big")}`}
                    alt={game.name}
                    style={{borderRadius:"40px", width:"700px",height:"400px",backgroundColor: "transparent" }}
                    />
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