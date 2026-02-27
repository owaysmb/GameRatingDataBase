import { useEffect, useRef, useState } from "react";
import { GameCard } from "../GameCard";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowCircleLeft } from "react-icons/fa";
import { FaArrowAltCircleRight } from "react-icons/fa";


export function UpcomingGames() {
    const navigate = useNavigate();
    const [TopRatedGames,SetTopRatedGames] = useState([]);
    const [Loading,setLoading] = useState([]);

      useEffect(() => {
    fetch("http://localhost:3000/api/Upcoming")
      .then(res => res.json())
      .then(data => {
        SetTopRatedGames(data);
        setLoading(false);
        console.log(data)
      });
  }, []);

    function ShowTopRated() {
        const TopRatedRef = useRef(null);

        const scrollLeft = ()=>{
            TopRatedRef.current.scrollBy({left:-400,behavior:"smooth"});
        }
        const scrollRight = ()=>{
            TopRatedRef.current.scrollBy({left:400,behavior:"smooth"});
        }

        return(
            <>
        <div style={{padding:"80px"}}>
                <h1 style={{color:"white",fontSize:"60px"}}>Upcoming Games</h1>
                <div style={{position:"relative",display:"flex",alignItems:"center"}} >
                <FaArrowCircleLeft style={{fontSize:"40px",color:"rgb(0, 204, 255)",position:"absolute",left:"0",cursor: "pointer",zIndex: "100"}} onClick={scrollLeft}/>
                <div ref={TopRatedRef} style={{display:"flex",gap:"24px",overflow: "hidden"}}>
                    {TopRatedGames.map((game)=>(
                <GameCard   key={game.id}
                            game={game}
                            onClick={() => navigate(`/game/${game.id}`)}
                />
                
                ))}
                </div>
                
                <FaArrowAltCircleRight style={{fontSize:"40px",color:"rgb(0, 204, 255)",position:"absolute",right:"0",cursor: "pointer"}} onClick={scrollRight}/>
            </div>
        </div>
                
            


            </>
            
        )
    }
    return(
        <>
            <ShowTopRated/>
        </>
    )

}