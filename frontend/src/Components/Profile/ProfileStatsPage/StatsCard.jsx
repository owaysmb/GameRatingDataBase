import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Progress({g,initialProgress}) {
    const [counter,setCounter] = useState(initialProgress || 0)
    const FirstRender = useRef(true);


        useEffect(() => {
        setCounter(initialProgress || 0);
        FirstRender.current = true;
    }, [initialProgress]);


        useEffect(() => {
        
        if (FirstRender.current) {
            FirstRender.current = false;
            return;
        }
        
        const timeout = setTimeout(() => {
            fetch(`http://localhost:3000/progress`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ newProgress: counter, game: g.id })
            });
        }, 800);

        return () => clearTimeout(timeout);
    }, [counter]);
            

    const maxHours = typeof g?.timeToBeat === 'object' && g?.timeToBeat !== null ? (g?.timeToBeat?.normally || g?.timeToBeat?.completely || g?.timeToBeat?.hastily || 40) : (typeof g?.timeToBeat === 'number' ? g?.timeToBeat : 40);
    const addHours = () => setCounter(p => p < maxHours  ? p + 1 : maxHours);
    const subHours = () => setCounter(p => p > 0 ? p - 1 : 0);
   
    return(
        <>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"6px",color:"#b3b3b3"}}>
            <button onClick={subHours} style={{width:"24px",height:"24px",borderRadius:"50%",color:"#f5f5f5",backgroundColor:"#1f1f1f",border:"1px solid #2a2a2a"}}>-</button>
            <div style={{minWidth:"60px",textAlign:"center"}}>{counter} / {maxHours}</div>
            <button onClick={addHours} style={{width:"24px",height:"24px",borderRadius:"50%",color:"#f5f5f5",backgroundColor:"#8b5cf6",border:"1px solid #2a2a2a"}}>+</button>
        </div>
        </>
    )
}






export function StatsCard({game,stats}) {
    const navigate = useNavigate()
    const [progressMap, setProgressMap] = useState({});

     useEffect(() => {
        const fetchProgress = async () => {
            try {
                const res = await fetch("http://localhost:3000/getprogress", {
                    credentials: "include"
                });
                if (res.ok) {
                    const data = await res.json();
                    setProgressMap(data.UserProgress?.Progress ?? {});
                } else {
                    setProgressMap({});
                }
            } catch (e) {
                // ignore
            }
        };
        fetchProgress();
    }, []);


    function findStats(gameId) {
        for (const [k, v] of Object.entries(stats)) {
            if (k !== "allgames" && k !== "_id" && k !== "userId" && k !== "__v" && k !== "createdAt" && k !== "updatedAt") {
                if (Array.isArray(v) && v.includes(String(gameId))) { 
                    return <td style={{textAlign:"center", color:"#b3b3b3"}}>{k}</td>;
                }
            }
        }
        return <td style={{textAlign:"center", color:"#8a8a8a"}}>-</td>;
    }

    return(
        <>
            <div style={{overflowX:"auto"}}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"16px" }}>


                    <thead style={{ width:"100%", borderCollapse:"collapse", fontSize:"14px"}}>
                        <tr style={{ color:"#8a8a8a"}}>
                            <th style={{ width:"30px", textAlign:"left" }}>#</th>
                            <th style={{ width:"60px", textAlign:"left" }}>Image</th>
                            <th style={{ textAlign:"left" }}>Game Title</th>
                            <th style={{ width:"80px", textAlign:"center" }}>Score</th>
                            <th style={{ width:"150px", textAlign:"center" }}>Status</th>
                            <th style={{ width:"150px", textAlign:"center" }}>Progress</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                    {(game || []).map((g, i) => (
                        <tr key={g.id} style={{ borderBottom:"1px solid #1f1f1f" }}>
                                <td style={{color:"#f5f5f5"}}>{i + 1}</td>
                                <td style={{padding:"10px"}}>
                                    {g.cover
                                        ? <img src={g.cover} style={{ width:60, height:80, objectFit:"cover", borderRadius:"4px" }} />
                                        : <div style={{ width:60, height:80, background:"#1f1f1f" }} />
                                    }
                                </td>
                                <td style={{ fontWeight:500 ,cursor: "pointer" ,padding:"10px", color:"#f5f5f5"}} onClick={()=>{navigate(`/game/${g.id}`)}} >{g.name}</td>
                                <td style={{ textAlign:"center", color:"#b3b3b3" }}> {g.rating ? Math.round(g.rating) : "-"}</td>
                                {findStats(g.id)}
                                <td><Progress g={g} initialProgress={progressMap[String(g.id)] ?? 0} /></td>
                        </tr>
                    ))}
                    </tbody>
                    
                </table>
            </div>
        </>
    )
}