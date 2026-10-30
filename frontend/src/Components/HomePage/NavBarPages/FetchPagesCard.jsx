import { useNavigate } from "react-router-dom";

export function PagesCard({games}) {
    
    const navigate = useNavigate(); 

    function release_date(g) {
    return(
        <>
            {g.first_release_date
            ? <div>{new Date(g.first_release_date * 1000).toLocaleDateString()}</div>
            : <div>Unknown</div>}
        </>
        
    )
}

const thStyle = {
    textAlign: "left",
    padding: "12px 10px",
    borderBottom: "1px solid #2a2a2a",
}

const tdStyle = {
    textAlign: "left",
    padding: "12px 10px",
    verticalAlign: "middle",
}
    return(
        <div className="page-content" style={{color :"#f5f5f5",padding:"20px 80px 40px",overflowX:"auto",minHeight:"60vh"}}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"15px",minWidth:"700px" }}>
                <thead>
                    <tr style={{color:"#8a8a8a"}}>
                        <th style={thStyle}>#</th>
                        <th style={thStyle}>Image</th>
                        <th style={thStyle}>Game Title</th>
                        <th style={thStyle}>Released Date</th>
                        <th style={thStyle}>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {games && games.map((g,i)=>(
                        <tr key={g.id} style={{ borderBottom:"1px solid #1f1f1f" }}>
                            <td style={tdStyle}>{i + 1}</td>
                            <td style={tdStyle}>
                                {g.cover?.url
                                    ? <img src={`https:${g.cover.url.replace("t_thumb","t_cover_big")}`} style={{ width:60, height:80, objectFit:"cover", borderRadius:"6px", border:"1px solid #2a2a2a" }} />
                                    : <div style={{ width:60, height:80, background:"#1f1f1f", border:"1px solid #2a2a2a", borderRadius:"6px" }} />
                                }
                            </td>
                                
                                <td style={{ ...tdStyle,fontWeight:500 ,cursor: "pointer"}} onClick={()=>{navigate(`/game/${g.id}`)}} >{g.name}</td>
                                <td style={{...tdStyle,color:"#b3b3b3"}}>{release_date(g)}</td>
                                <td style={{...tdStyle,color:"#b3b3b3"}}> {g.rating ? Math.round(g.rating) : "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}