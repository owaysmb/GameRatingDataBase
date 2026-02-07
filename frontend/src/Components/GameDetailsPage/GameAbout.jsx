

export function GameAbout({game}) {
    const parastyle = {
        "fontSize":"15px",
        "padding":"5px"
    }
    const columnStyle = {
        width: "200px",
        display: "grid",
        alignItems: "flex-start",
    };

    return(
        <>
        {/* container of platforms and about details */}
            <div style={{display:"flex",gap:"80px",padding:"80px"}}>
                {/* platforms */}
                <div style={{color:"white"}}>
                    <h1 style={{color:"white",margin:"10px"}}>Platforms:</h1>
                    {game.platforms && game.platforms.map(p => (
                        <span key={p.id} 
                        style={{
                            display:"flex",
                            flexDirection:"column",
                            backgroundColor:"#111",
                            padding:"5px",
                            margin:"5px",
                            width:"200px",
                            borderRadius:"10px",
                            textAlign:"center",
                        }}>{p.name}</span>
                    ))}
                </div>

                {/* about the game */}
                <div style={{backgroundColor:"#111", padding:"10px", margin:"10px", borderRadius:"20px",width:"70%",height:"550px"}}>
                    {/* the first part */}
                    <div style={{height:"40%",display:"flex",alignItems:"Start",justifyContent:"space-around",color:"white"}}>
                        <div style={{columnStyle}}>
                            <h2>Main Publishers</h2>
                            {game.involved_companies
                                ?.filter(c => c.publisher)
                                .map((c, i) => (
                                <div key={i} style={parastyle}>{c.company?.name}</div>
                                ))}
                        </div>

                        <div style={columnStyle}>
                            <h2>Main Developers</h2>
                            {game.involved_companies
                                ?.filter(c => c.developer)
                                .map((c, i) => (
                                <div key={i} style={parastyle}>{c.company?.name}</div>
                                ))}
                        </div>
                        
                        <div style={columnStyle}>
                            <h2>Genres</h2>
                            {game.genres?.map(g => (
                                <div key={g.id} style={parastyle}>{g.name}</div>
                            ))}
                        </div>
                        <div style={columnStyle}>
                            <h2>Game Modes</h2>
                            {game.game_modes?.map(gm => (
                                <div key={gm.id} style={parastyle}>{gm.name}</div>
                            ))}
                        </div>
                    </div>
                    <hr/>
                    {/* the second part */}
                    <div style={{height:"50%",display:"flex",alignItems:"Start",justifyContent:"space-around",color:"white"}}>
                        <div style={columnStyle}>
                            <h2>Series</h2>
                            <div style={parastyle}>{game.collection ? game.collection.name : game.name}</div>
                        </div>
                        <div style={columnStyle}>
                            <h2>Themes</h2>
                            {game.themes?.map(t => (
                                <div key={t.id} style={parastyle}>{t.name}</div>
                            ))}
                        </div >
                        <div style={columnStyle}>
                            <h2>Game Engine</h2>
                            {game.game_engines?.map(ge =>(
                                <div key={ge.id} style={columnStyle}> {ge.name} </div>
                            ))}
                        </div>
                        <div style={columnStyle}>
                            <h2>Time To Beat</h2>
                            <div style={parastyle}>N/A</div>
                        </div>
                        
                    </div>


                </div>




            </div>
        </>
    )
}