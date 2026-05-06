

export function PagesCard({games}) {
    
    function release_date(g) {
    return(
        <>
            {g.first_release_date
            ? <div>{new Date(g.first_release_date * 1000).toDateString() }</div>
            : <div> Unknown </div>}
        </>
        
    )
}

const thStyle = {
    textAlign: "left",
    padding: "10px",
    borderBottom: "15px solid #eee",
}

const tdStyle = {
    textAlign: "left",
    padding: "10px",
    verticalAlign: "middle",
}
    return(
        <div style={{color :" white",padding:"100px"}}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"30px" }}>
                <thead>
                    <tr style={{color:"lightblue"}}>
                        <th style={thStyle}>#</th>
                        <th style={thStyle}>Image</th>
                        <th style={thStyle}>Game Title</th>
                        <th style={thStyle}>Released Date</th>
                        <th style={{thStyle , marginLeft:"10px"}}>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((g,i)=>(
                        <tr key={g.id} style={{ borderBottom:"1px solid #eee" }}>
                            <td style={tdStyle} >{i + 1}</td>
                            <td style={{padding:"10px"}} style={tdStyle}>
                                {g.cover.url
                                    ? <img src={g.cover.url} style={{ width:100, height:120, objectFit:"cover" }} />
                                    : <div style={{ width:40, height:55, background:"#eee" }} />
                                }
                            </td>
                                
                                <td style={{ ...tdStyle,fontWeight:500 ,cursor: "pointer" ,padding:"10px"}} onClick={()=>{navigate(`/game/${g.id}`)}} >{g.name}</td>
                                <td style={{...tdStyle}}>{release_date(g)}</td>
                                <td style={{...tdStyle,textAlign:"center" }}> {g.rating ? Math.round(g.rating) : "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}