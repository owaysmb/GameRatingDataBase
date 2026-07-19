import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

export function ProfileFavorite({ profileUser, isOwnProfile }) {
    const [Fav,SetFav] = useState([])
    const [game, setGames] = useState([]);
    const navigate = useNavigate()

    useEffect(()=>{
            const fetchFav = async ()=>{
                const resFav = await fetch(`http://localhost:3000/getfavorite?userId=${profileUser._id}`,{
                    credentials: "include"
                });
                const FavData = await resFav.json();
                SetFav(FavData.Favorites); 
            }
            fetchFav();
          },[profileUser._id])  

          console.log(Fav)
        
           useEffect(()=>{
            const fetchGames = async () => {
                const res = await fetch("http://localhost:3000/games/batch", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ ids: Fav }),
                });
                const data = await res.json();
                setGames(data);
            }
            if (Fav?.length > 0) {
                fetchGames();
            }
        }, [Fav]);
        
            useEffect(() => {
            console.log("Games:", game);
        }, [game]);
        


    return(
    <>
     <h1>{profileUser?.username}'s Favorites : </h1>
            <div style={{display:"flex",gap:"20px",padding:"30px",backgroundColor:"#111",borderRadius:"20px",justifyContent:"space-around",textAlign:"center",overflow:"hidden"}}>
                    {game?.map((g) => {
                    return (
                        <div key={g.id} style={{display:"flex", flexDirection:"column", alignItems:"center", width:"150px" ,cursor:"pointer"}} onClick={()=>{navigate(`/game/${g.id}`)}}>
                            { g.cover 
                            ? <img src={g.cover} alt={g.name} style={{width:"150px", height:"200px", objectFit:"cover", borderRadius:"8px"}} />
                            : <div style={{width:"150px", height:"200px", backgroundColor:"#333", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", color:"#666"}}>No Image</div>
                            }
                            <h2 style={{fontSize:"14px", textAlign:"center", color:"white"}}>{g.name}</h2>
                        </div>
                    );
                })}
            </div>
    </>)
}