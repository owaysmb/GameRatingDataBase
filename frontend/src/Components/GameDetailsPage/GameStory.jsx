

export function GameStory({game}) {

    return(
        <>
        <div style={{display:"flex",textAlign:"start",flexDirection:"column",padding:"30px",backgroundColor:"#111",marginTop:"40px",borderRadius:"10px"}}>
            <h2 style={{padding:"20px", color:"white"}} >Game Story / description</h2>
            <div style={{padding:"20px", color:"white", textAlign:"start",display:"flex",gap:"300px"}}>
                
                <p style={{fontSize:"20px", marginTop:"20px",width:"1500px"}}>{game.summary ? game.summary : "Summary not available for this game."}</p>

                <div style={{display:"flex",flexDirection:"column",gap:"40px"}}>
                    <div style={{width:"200px", height:"50px", backgroundColor:"rgba(255,255,255,0.1)", borderRadius:"10px", display:"flex", justifyContent:"center", alignItems:"center"}}>Add To List</div>
                    <div style={{width:"200px", height:"50px", backgroundColor:"rgba(255,255,255,0.1)", borderRadius:"10px", display:"flex", justifyContent:"center", alignItems:"center"}}>Review</div>
                </div>

            </div>
        </div>
            
        </>
    )
}