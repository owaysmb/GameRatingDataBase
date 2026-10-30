import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import { MdOutlineFavorite } from "react-icons/md";
import Rating from '@mui/material/Rating';
import { FaStar } from "react-icons/fa6";

export function GameCoverAndTrailer({game}) {

    const [starValue,SetstarValue] = useState(null);
    const {id} = useParams();
    const [favorite,setFavorite] = useState(false);
    const [Fav,SetFav] = useState([])

    const handlerating = async ()=>{
        try {
            const res = await fetch(`http://localhost:3000/game/${id}/rate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ rating: starValue })
            });
        } catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        if (starValue > 0) {
            handlerating(starValue);
        }
    }, [starValue]);

    const handleFavorite = async () => {
        const newFavorite = !favorite;
        setFavorite(newFavorite);

        await fetch(`http://localhost:3000/game/${id}/favorite`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ favorite: newFavorite })
        });
    };

    useEffect(() => {
        const fetchFav = async () => {
            const resFav = await fetch("http://localhost:3000/getfavorite", {
                credentials: "include"
            });
            const FavData = await resFav.json();
            const favList = FavData.Favorites ?? [];
            SetFav(favList);
            setFavorite(favList.includes(String(id)));
        };
        fetchFav();
    }, [id]); 

    useEffect(() => {
        const fetchRating = async () => {
            const res = await fetch(`http://localhost:3000/game/${id}/getrating`, {
                credentials: "include"
            });
            const data = await res.json();
            SetstarValue(data.rating);
        };
        fetchRating();
    }, [id]);
    
    return(
        <>  
            <div style={{display:"flex" , gap:"40px" , alignItems:"flex-start",justifyContent:"flex-start",flexWrap:"wrap",padding:"40px 80px",backgroundColor:"#0a0a0a",borderRadius:"10px",marginTop:"110px"}}> 
                <div style={{display:"flex",flexDirection:"column",gap:"16px"}}>
                    <h1 style={{color:"#f5f5f5",fontSize:"42px",fontWeight:"700",margin:0}}>{game.name}</h1>
                    {game.cover && (
                    <img
                    src={game.cover}
                    alt={game.name}
                    style={{borderRadius:"8px", width:"280px",border:"1px solid #2a2a2a"}}
                    />
                )}
                </div> 

                <div style={{display:"flex", flexDirection:"column",gap:"24px",paddingTop:"60px"}}>
                    {game.release_date && (
                        <div style={{color:"#b3b3b3"}}>
                            <div style={{color:"#8a8a8a",fontSize:"14px"}}>Release Date</div>
                            <div style={{color:"#f5f5f5",fontSize:"18px"}}>{game.release_date}</div>
                        </div>
                    )}

                    <div>
                        <div style={{display:"flex", alignItems:"center", gap:"12px"}} >
                            {
                                Math.round(game.rating) >= 80 
                                ? <FaStar style={{fontSize:"48px" , color:"#38bdf8"}} /> 
                                : game.rating >= 60 ? <FaStar style={{fontSize:"48px" , color:"#8b5cf6"}} /> 
                                : <FaStar style={{fontSize:"48px" , color:"#ec4899"}} /> 
                            }
                            <div style={{fontSize:"40px",color:"#f5f5f5"}}>
                                {game.rating ? Math.round(game.rating) : "N/A"}
                            </div>
                        </div>
                    </div>
                    <div style={{display:"flex",gap:"16px",alignItems:"center"}}>

                        <MdOutlineFavorite 
                            size={28} 
                            onClick={handleFavorite}
                            style={{ cursor:"pointer", color: favorite ? "#ec4899" : "#b3b3b3" }} 
                        />
                        
                        <Box style={{backgroundColor:"#151515", padding:"10px 16px", borderRadius:"8px", textAlign:"center",border:"1px solid #2a2a2a"}}>
                            <Rating 
                                name="customized-10"  
                                max={5} 
                                style={{fontSize:"28px"}}
                                value={starValue}
                                onChange={(event, newValue) => {
                                    SetstarValue(newValue);
                                }}
                                sx={{
                                    '& .MuiRating-iconFilled': {
                                        color: "#8b5cf6"
                                    },
                                    '& .MuiRating-iconEmpty': {
                                        color: "#353535"
                                    }
                                }}
                            />
                        </Box>
                    </div>
                </div>

                <div style={{flex:"1 1 600px",minWidth:"280px"}}>
                    {game.trailer && (
                        <iframe
                            width="100%"
                            height="380"
                            src={game.trailer}
                            title="Game Trailer"
                            frameBorder="0"
                            allowFullScreen
                            style={{borderRadius:"8px",border:"1px solid #2a2a2a"}}
                        />
                    )}
                </div>     
            </div>
        </>
    )
}
