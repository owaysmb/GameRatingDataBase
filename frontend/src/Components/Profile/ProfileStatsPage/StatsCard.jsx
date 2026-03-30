import { useState } from "react";



export function StatsCard({game,stats}) {


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

function progress(g) {
    const [counter,setCounter] = useState(0)

    const addHours = ()=>{
        setCounter(p => p = p+1)
    }

    const subHours = ()=>{
        setCounter(p => p > 0? p = p-1 : p = 0)
    }
    return(
        <>
        <div style={{display:"flex",gap:"10px",alignItems:"center",justifyContent:"center"}}>
            <button onClick={subHours} style={{width:"30px",height:"30px",borderRadius:"50%",color:"white",backgroundColor:"red"}}>-</button>
            <div>{counter} / {g?.timeToBeat?.normally? g?.timeToBeat?.normally : "-"}</div>
            <button onClick={addHours} style={{width:"30px",height:"30px",borderRadius:"50%",color:"white",backgroundColor:"green"}}>+</button>
        </div>
        </>
    )
}


    return(
        <>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"20px" }}>

            <br />

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
                        <td>
                            {g.cover
                                ? <img src={g.cover} style={{ width:100, height:120, objectFit:"cover" }} />
                                : <div style={{ width:40, height:55, background:"#eee" }} />
                            }
                        </td>
                            <td style={{ fontWeight:500 }}>{g.name}</td>
                            <td style={{ textAlign:"center" }}> {g.rating ? Math.round(g.rating) : "-"}</td>
                            {findStats(g.id)}
                            <td>{progress(g)}</td>
                    </tr>
                ))}
            </tbody>
            
        </table>
            
            
        </>
    )
}