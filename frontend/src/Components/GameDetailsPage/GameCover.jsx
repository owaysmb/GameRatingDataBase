import { RestaurantRounded } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

// mui icons and components
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

// react icons
import Rating from '@mui/material/Rating';
import { FaStar } from "react-icons/fa6";

export function GameCoverAndTrailer({game}) {

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

                    <Box style={{backgroundColor:"rgb(255, 255, 255)", padding:"20px", borderRadius:"20px", textAlign:"center"}}>
                        <Rating name="customized-10"  max={5} style={{fontSize:"40px"}}/>
                    </Box>
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