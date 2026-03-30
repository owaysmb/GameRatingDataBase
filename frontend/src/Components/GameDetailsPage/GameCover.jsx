import { RestaurantRounded } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

// mui icons and components
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { MdOutlineFavorite } from "react-icons/md";

// react icons
import Rating from '@mui/material/Rating';
import { FaStar } from "react-icons/fa6";

export function GameCoverAndTrailer({game}) {

    const [starValue,SetstarValue] = useState(null);
    const token = localStorage.getItem("token");
    const {id} = useParams();
    const [favorite,setFavorite] = useState(false);


    const handlerating = async ()=>{
        try {
            const res = await fetch(`http://localhost:3000/game/${id}/rate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ rating: starValue })
            });
            console.log("done rating by fetch")

        } catch (err) {
            console.error(err);
        }
        
    }
    useEffect(() => {
        if (starValue > 0) {
            handlerating(starValue);
        }
    }, [starValue]);

    const handleFavorite = async ()=>{
        const newFavorite = !favorite;
        setFavorite(newFavorite );
        localStorage.setItem(`favorite_${id}`, newFavorite);
        try {
            
            await fetch(`http://localhost:3000/game/${id}/favorite`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body:JSON.stringify({favorite:newFavorite})
            })
            
        } catch (err) {
            console.log(err);
        }
        
    }
    useEffect(() => {
        const storedFavorite = localStorage.getItem(`favorite_${id}`);

        if (storedFavorite !== null) {
            setFavorite(storedFavorite === "true");
        }
    }, [id]);
    
    return(
        <>  
        {/* main container */}
            <div style={{display:"flex" , gap:"20px" , alignItems:"center",justifyContent:"space-evenly",padding:"30px",height:"500px",backgroundColor:"#111",borderRadius:"10px",marginTop:"40px"}}> 
                {/* game name and cover  */}
                <div style={{padding:"20px", textAlign:"center"}}>
                    <h1 style={{color:"white"}}>{game.name}</h1>
                    {game.cover && (
                    <img
                    
                    src={game.cover}
                    alt={game.name}
                    style={{borderRadius:"40px", width:"350px",}}
                    />
                )}
                </div> 

                {/* Game rating and release date */}
                <div style={{width:"300px",height:"100%", display:"flex", flexDirection:"column",textAlign:"start", justifyContent:"space-evenly"}}>
                    {game.release_date && (
                        <h3 style={{color:"white",width:"300px",fontSize:"20px"}}>
                            Release Date:{game.release_date}
                        </h3>
                    )}

                    <div>
                {(
                    <h3 style={{color:"white",width:"300px",display:"flex", alignItems:"center", gap:"10px"}} >
                        {
                            
                            Math.round(game.rating) >= 80 
                            ? <FaStar style={{fontSize:"80px" , color:"#00ff15"}} /> 
                            : game.rating >= 60 ? <FaStar style={{fontSize:"80px" , color:"#fbff00"}} /> 
                            : <FaStar style={{fontSize:"80px" , color:"#ff0000"}} /> 
                            
                            
                        }
                        <div style={{fontSize:"60px"}}>
                            {game.rating ? Math.round(game.rating) : "N/A"}
                        </div>
                    </h3>
                )}
            </div>
            <div style={{display:"flex",gap:"30px",alignItems:"center"}}>

                {
                !favorite 
                ? <MdOutlineFavorite size={32} style={{cursor:"pointer",color:"white"}} onClick={handleFavorite}/> 
                : <MdOutlineFavorite size={32} style={{cursor:"pointer",color:"red"}} onClick={handleFavorite}/> 
                }
                
                    <Box style={{backgroundColor:"rgb(255, 255, 255)", padding:"20px", borderRadius:"20px", textAlign:"center"}}>
                        <Rating 
                        name="customized-10"  
                        max={5} 
                        style={{fontSize:"40px"}}
                        value={starValue}
                        onChange={(event,newValue)=>{
                            SetstarValue(newValue);
                            console.log("User selected:", newValue);
                        }}
                        
                        />
                    </Box>
            </div>
                    
                </div>

                {/* game trailer  */}

                <div>
                    {game.trailer && (
                        <iframe
                            width="700"
                            height="380"
                            src={game.trailer}
                            title="Game Trailer"
                            frameBorder="0"
                            allowFullScreen
                            style={{borderRadius:"40px"}}
                        />
                    )}
                </div>     
            </div>

            

        </>
    )
}