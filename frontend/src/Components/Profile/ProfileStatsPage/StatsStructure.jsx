import { useState } from 'react';
import { useEffect } from 'react';
import { Loading } from '../../Loading';
import { StatsCard } from './StatsCard';

export function StatsStructure({link}) {
    const token = localStorage.getItem("token");
    const [stats,SetStats] = useState(0);
    const [game, setGames] = useState([])
    const [loading, setLoading] = useState(true);

    const StatsCategory = {
        "allgames" : "allgames",
        "played" : "played",
        "playing" : "playing",
        "onhold" :  "OnHold",
        "wanttoplay" : "WantToPlay",
        "dontwanttoplay" : "DontWantToPlay"
    }

    useEffect(()=>{
            const fetchStats = async ()=>{
                    const res = await fetch("http://localhost:3000/getstats",{
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    });
    
                    const statsData = await res.json();
                    SetStats(statsData)
                }
            fetchStats();
            
        },[])


useEffect(() => {
    const fetchGames = async () => {
        setLoading(true);
        setGames([]);

        const ids = stats[StatsCategory[link]];
        if (!ids?.length) {
            setLoading(false); 
            return;
        }

        const res = await fetch("http://localhost:3000/batch/stats", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ids }),
        });

        const data = await res.json();
        setGames(data);
        setLoading(false); 
    };

    if (stats) fetchGames();
}, [link, stats]);

console.log(game)

    return (
        <>{loading ? <Loading/> 
            :
            <div style={{color:"white"}}>

            {/* <div style={{display:"flex",gap:"10px"}}>
                <h2>#</h2>
                <h2>Image</h2>
                <h2>Name</h2>
                <h2>Score</h2>

            </div> */}

                {game.length == 0 
                    ? <p>No Games Here</p>
                    : 
                        <>
                            <StatsCard game={game} stats = {stats}/>
                            <br />
                        </>
                        
                    
                } 
                
            </div>
        }
        
        </>
    )



}