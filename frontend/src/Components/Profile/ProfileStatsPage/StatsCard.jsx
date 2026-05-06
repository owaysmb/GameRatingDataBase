import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Progress({g,initialProgress}) {
    const [counter,setCounter] = useState(0)
    const FirstRender = useRef(true);
    const token = localStorage.getItem("token");


        useEffect(() => {
        setCounter(initialProgress);
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
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ newProgress: counter, game: g.id })
            });
        }, 800);

        return () => clearTimeout(timeout);
    }, [counter]);
            

    
    const addHours = () => setCounter(p => p < g?.timeToBeat?.normally  ? p + 1 : g?.timeToBeat?.normally);
    const subHours = () => setCounter(p => p > 0 ? p - 1 : 0);
   
    return(
        <>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
            <button onClick={subHours} style={{width:"30px",height:"30px",borderRadius:"50%",color:"white",backgroundColor:"red"}}>-</button>
            <div >{counter} / {g?.timeToBeat?.normally ? g?.timeToBeat?.normally : "-"}</div>
            <button onClick={addHours} style={{width:"30px",height:"30px",borderRadius:"50%",color:"white",backgroundColor:"green"}}>+</button>
        </div>
        </>
    )
}






export function StatsCard({game,stats}) {
    const navigate = useNavigate()
    const token = localStorage.getItem("token");
    const [progressMap, setProgressMap] = useState({});

     useEffect(() => {
        const fetchProgress = async () => {
            const res = await fetch("http://localhost:3000/getprogress", {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setProgressMap(data.UserProgress?.Progress ?? {});
            console.log(data)
        };
        fetchProgress();
    }, []);


    function findStats(gameId) {
        for (const [k, v] of Object.entries(stats)) {
            if (k !== "allgames" && k !== "_id" && k !== "userId" && k !== "__v" && k !== "createdAt" && k !== "updatedAt") {
                if (Array.isArray(v) && v.includes(String(gameId))) { 
                    return <td style={{textAlign:"center"}}>{k}</td>;
                }
            }
        }
        return <td>-</td>;
    }

    return(
        <>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"20px" }}>


            <thead style={{ width:"100%", borderCollapse:"collapse", fontSize:"13px"}}>
                <tr style={{ fontSize:"30px"}}>
                    <th style={{ width:"30px" }}>#</th>
                    <th style={{ width:"60px" }}>Image</th>
                    <th style={{ textAlign:"left" }}>Game Title</th>
                    <th style={{ width:"80px", textAlign:"center" }}>Score</th>
                    <th style={{ width:"150px", textAlign:"center" }}>Status</th>
                    <th style={{ width:"150px", textAlign:"center" }}>Progress</th>
                </tr>
            </thead>
            
            <tbody>
            {game.map((g, i) => (
                    <tr key={g.id} style={{ borderBottom:"1px solid #eee" }}>
                        <td>{i + 1}</td>
                        <td style={{padding:"10px"}}>
                            {g.cover
                                ? <img src={g.cover} style={{ width:100, height:120, objectFit:"cover" }} />
                                : <div style={{ width:40, height:55, background:"#eee" }} />
                            }
                        </td>
                            <td style={{ fontWeight:500 ,cursor: "pointer" ,padding:"10px"}} onClick={()=>{navigate(`/game/${g.id}`)}} >{g.name}</td>
                            <td style={{ textAlign:"center" }}> {g.rating ? Math.round(g.rating) : "-"}</td>
                            {findStats(g.id)}
                            <td><Progress g={g} initialProgress={progressMap[String(g.id)] ?? 0} /></td>
                    </tr>
                ))}
            </tbody>
            
        </table>
            
            
        </>
    )
}