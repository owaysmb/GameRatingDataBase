import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function ProfileReviews() {
    const token = localStorage.getItem("token");
    const [Reviews,SetReviews] = useState([])
    const [game, setGames] = useState([]);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate()

    const fetchReviews = async ()=>{
        const resReviews = await fetch("http://localhost:3000/getreview",{
            headers:{
                "Authorization": `Bearer ${token}`
            }
        })
        const data = await resReviews.json()
        SetReviews(data.reviews)
        console.log(data)
    }

    useEffect(()=>{
        fetchReviews()
    },[])


    useEffect(()=>{
            const fetchGames = async () => {
                const res = await fetch("http://localhost:3000/games/batch", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ ids: Reviews.map(r => r.gameId) }),
                });
                const data = await res.json();
                const gamesWithReviews = Reviews.map(r => {
                const gameData = data.find(g => String(g.id) === r.gameId);
                return { ...gameData, review: r.review };
            });

            setGames(gamesWithReviews);
            }
        if (Reviews.length > 0) {
            fetchGames();
        }
        }, [Reviews]);





    return (
        <>
        <h1>{user?.username}'s Reviews : </h1>
            
            <div style={{display:"flex",gap:"20px",padding:"30px",backgroundColor:"#111",borderRadius:"20px",justifyContent:"space-around",overflow:"hidden", textAlign:"center"}}>
                    {game.map(g => (
                        <div style={{flexDirection:"column", alignItems:"center", width:"250px",cursor:"pointer"}} key={g.id} onClick={()=>{navigate(`/game/${g.id}`)}}>
                            { g.cover 
                            ? <img src={g.cover} alt={g.name} style={{width:"150px", height:"200px", objectFit:"cover", borderRadius:"8px"}} />
                            : <div style={{width:"150px", height:"200px", backgroundColor:"#333", borderRadius:"8px", display:"flex", alignItems:"center", justifyContent:"center", color:"#666"}}>No Image</div>
                            }
                            <div stryle={{display:"flex", flexDirection:"column", alignItems:"center", width:"250px" ,cursor:"pointer"}} onClick={()=>{navigate(`/game/${g.id}`)}}>
                                <h2 style={{fontSize:"20px", textAlign:"center", color:"white"}}>{g.name}</h2>
                                <p style={{color:"lightblue",fontSize:"20px"}}>{g.review}</p>
                            </div>
                             
                        </div>
                    ))}
            </div>

<br />


<br />
            <h1>illibio's Forums : </h1>

            

            <div style={{display:"flex",gap:"20px" , fontSize:"50px",justifyContent:"space-between",padding:"30px",backgroundColor:"#111",height:"200px",borderRadius:"20px"}}>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                    <div>test</div>
                </div>
                
        </>
    )
}