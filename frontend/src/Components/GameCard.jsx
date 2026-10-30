export function GameCard({game,onClick}) {
    return(
        <div 
        onClick={onClick}
        style={{
          cursor: "pointer",
          width: "200px",
          minWidth: "200px"
        }}>
            <div 
            style={{color:"#f5f5f5",width: "200px", transition: "transform 0.2s ease",}} 
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
                {game.cover && (<img src={`https:${game.cover.url.replace("t_thumb", "t_cover_big")}`}
                 alt={game.name} style={{width:"200px",height:"280px",objectFit:"cover",borderRadius:"8px",border:"1px solid #2a2a2a"}} />)}
            
                <h3 style={{fontSize:"15px",margin:"10px 0 6px 0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{game.name}</h3>
                {game.genres &&(<p style={{ fontSize: "13px", color:"#8a8a8a", margin:"0" }}>
                    {game.genres?.length
                    ?game.genres?.map(g => g.name).join(" • "):"Unknown"}
                </p>)}
                
            </div>
        </div>
    )
}