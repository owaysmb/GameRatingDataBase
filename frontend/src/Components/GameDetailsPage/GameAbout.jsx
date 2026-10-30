
import { useNavigate } from "react-router-dom";

export function GameAbout({game}) {
    const navigate = useNavigate();
    const parastyle = {
        "fontSize":"14px",
        "color":"#b3b3b3",
        "margin":"4px 0"
    }
    const columnStyle = {
        width: "200px",
        display: "flex",
        flexDirection: "column",
        gap: "6px"
    };

    return(
        <>
            <div style={{display:"flex",flexWrap:"wrap",gap:"40px",padding:"20px 80px 40px"}}>
                <div style={{color:"#f5f5f5"}}>
                    <h1 style={{color:"#f5f5f5",margin:"10px 0 16px 0",fontSize:"28px"}}>Platforms</h1>
                    {game.platforms && game.platforms.map(p => (
                        <div key={p.id} 
                        style={{
                            backgroundColor:"#151515",
                            border:"1px solid #2a2a2a",
                            padding:"8px 12px",
                            margin:"6px 0",
                            width:"200px",
                            borderRadius:"8px",
                            textAlign:"left",
                            color:"#b3b3b3"
                        }}>{p.name}</div>
                    ))}
                </div>

                <div style={{backgroundColor:"#151515", border:"1px solid #2a2a2a", padding:"24px", borderRadius:"10px",flex:"1 1 700px"}}>
                    <div style={{display:"flex",flexWrap:"wrap",gap:"40px",alignItems:"flex-start",color:"#f5f5f5"}}>
                        <div style={columnStyle}>
                            <h2 style={{margin:"0 0 10px 0",fontSize:"18px"}}>Main Publishers</h2>
                            {game.involved_companies
                                ?.filter(c => c.publisher)
                                .map((c, i) => (
                                <div key={i} style={parastyle}>{c.company?.name}</div>
                                ))}
                            {(!game.involved_companies?.some(c=>c.publisher)) && <div style={parastyle}>N/A</div>}
                        </div>

                        <div style={columnStyle}>
                            <h2 style={{margin:"0 0 10px 0",fontSize:"18px"}}>Main Developers</h2>
                            {game.involved_companies
                                ?.filter(c => c.developer)
                                .map((c, i) => (
                                <div key={i} style={parastyle}>{c.company?.name}</div>
                                ))}
                            {(!game.involved_companies?.some(c=>c.developer)) && <div style={parastyle}>N/A</div>}
                        </div>
                        
                        <div style={columnStyle}>
                            <h2 style={{margin:"0 0 10px 0",fontSize:"18px"}}>Genres</h2>
                            {game.genres?.map(g => (
                                <div key={g.id} style={parastyle}>{g.name}</div>
                            ))}
                        </div>
                        <div style={columnStyle}>
                            <h2 style={{margin:"0 0 10px 0",fontSize:"18px"}}>Game Modes</h2>
                            {game.game_modes?.map(gm => (
                                <div key={gm.id} style={parastyle}>{gm.name}</div>
                            ))}
                        </div>
                    </div>
                    <hr style={{border:"none",borderTop:"1px solid #2a2a2a",margin:"24px 0"}}/>
                    <div style={{display:"flex",flexWrap:"wrap",gap:"40px",alignItems:"flex-start",color:"#f5f5f5"}}>
                        <div style={columnStyle}>
                            <h2 style={{margin:"0 0 10px 0",fontSize:"18px"}}>Series</h2>
                            <div style={parastyle}>{game.collection ? game.collection.name : game.name}</div>
                        </div>
                        <div style={columnStyle}>
                            <h2 style={{margin:"0 0 10px 0",fontSize:"18px"}}>Themes</h2>
                            {game.themes?.map(t => (
                                <div key={t.id} style={parastyle}>{t.name}</div>
                            ))}
                        </div >
                        <div style={columnStyle}>
                            <h2 style={{margin:"0 0 10px 0",fontSize:"18px"}}>Game Engine</h2>
                            {game.game_engines?.map(ge =>(
                                <div key={ge.id} style={parastyle}> {ge.name} </div>
                            ))}
                        </div>
                        <div style={columnStyle}>
                            <h2 style={{margin:"0 0 10px 0",fontSize:"18px"}}>Time To Beat</h2>
                            <div style={parastyle}>N/A</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}