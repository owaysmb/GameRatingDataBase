import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from "../../../context/AuthContext";


export function ProfileFavorite() {
    const token = localStorage.getItem("token");
    const [Fav,SetFav] = useState([])
    const [game, setGames] = useState([]);
    const { user, logout } = useContext(AuthContext);

    useEffect(()=>{
            const fetchFav = async ()=>{
                const resFav = await fetch("http://localhost:3000/getfavorite",{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                });
                const FavData = await resFav.json();
                SetFav(FavData.Favorites); 
            }
            fetchFav();
          },[])  

          console.log(Fav)
        
           useEffect(()=>{
            const fetchGames = async () => {
                const res = await fetch("http://localhost:3000/batch/favorites", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ ids: Fav }),
                });
                const data = await res.json();
                setGames(data);
            }
            if (Fav.length > 0) {
                fetchGames();
            }
        }, [Fav]);
        
            useEffect(() => {
            console.log("Games:", game);
        }, [game]);
        


    return(
    <>
     <h1>{user?.username}'s Favorites : </h1>
            <div style={{display:"flex",gap:"20px",padding:"30px",backgroundColor:"#111",borderRadius:"20px",justifyContent:"space-around",overflow:"hidden"}}>
                    {game.map((g) => {
                    return (
                        <div key={g.id} style={{display:"flex", flexDirection:"column", alignItems:"center", width:"150px"}}>
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