
// here is the details information of the game and speceifications



export function GameCard({game,onClick}) {
    return(
        <div 
        onClick={onClick}
        style={{
        backgroundColor: "#111",
        borderRadius: "12px",
        padding: "12px",
        color: "white",
        cursor: "pointer",
      }}>
            {
                    <div style={{color:"white",width: "300px" , backgroundColor:"#111",padding:"20px",borderRadius:"40px",transition: "transform 0.3s ease",}} 
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
                        {game.cover && (<img src={`https:${game.cover.url.replace("t_thumb", "t_cover_big")}`}
                         alt={game.name} style={{width:"100%",height:"220px",objectFit:"cover",borderRadius:"8px"}} />)}
                    
                    <h3>{game.name}</h3>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                </div>
                {game.genres &&(<p style={{ fontSize: "13px", opacity: 0.8 }}>
                    {game.genres?.length
                    ?game.genres?.map(g => g.name).join(" • "):"Unknown"}
                </p>)}
                
                </div>
                
            }
        </div>
    )
}