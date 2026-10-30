import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../../Loading';
import { StatsCard } from './StatsCard';

export function StatsStructure({link}) {
    const navigate = useNavigate();
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
                        credentials: "include"
                    });
                    if (res.status === 401) {
                        setLoading(false);
                        return;
                    }
    
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

        const res = await fetch("http://localhost:3000/games/batch", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ ids }),
        });

        const data = await res.json();
        setGames(data);
        setLoading(false); 
    };

    if (stats) fetchGames();
}, [link, stats]);


    return (
        <>{loading ? <Loading/> 
            :
        <div style={{color:"#f5f5f5",padding:"20px 80px 40px"}}>
            <button onClick={() => navigate(-1)} style={{background:"none",border:"none",color:"#b3b3b3",fontSize:"16px",cursor:"pointer",marginBottom:"20px"}}>← Back</button>
            <h1 style={{fontSize:"32px",marginBottom:"30px",fontWeight:"700"}}>My Game Library</h1>
            {game.length == 0 
                ? <p style={{color:"#8a8a8a"}}>No Games Here</p>
                : 
                <div style={{backgroundColor:"#151515",padding:"20px",borderRadius:"10px",border:"1px solid #2a2a2a"}}>
                    <StatsCard game={game} stats = {stats}/>
                    <br />
                </div>
            } 
        </div>
        }
        </>
    )



}