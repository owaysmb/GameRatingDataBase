

import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function ProfileStats() {
        const token = localStorage.getItem("token");
        const [stats,SetStats] = useState(0);
        const navigate = useNavigate()


        const tabIndex = {
            playing: 1,
            played: 2,
            onhold: 3,
            wanttoplay: 4,
            dontwanttoplay: 5,
        };

        useEffect(()=>{
            const fetchStats = async ()=>{
                    const res = await fetch("http://localhost:3000/getstats",{
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    });
    
                    const statsData = await res.json();
                    SetStats(statsData)
                    
                }
            fetchStats();
        },[])
console.log(stats)
        const statsStyle = {
            width:"300px",
            display:"flex",
            alignItems:"center",
            justifyContent:"space-between",
            fontSize:"30px",
            height:"50px",
            cursor:"pointer"
        }

    return(
        <>
            <h1 onClick={()=>navigate("/profile/stats")} style={{cursor:"pointer",width:"200px"}}>Statistics :</h1>
            <div style={{display:"flex",gap:"300px",padding:"30px",backgroundColor:"#111",borderRadius:"20px"}}>
                <div>
                    <div style={statsStyle} onClick={() => navigate(`/profile/stats?tab=${tabIndex.playing}`)} ><h3>Playing :</h3> <span>{stats?.playing?.length}</span></div>
                    <h1  style={statsStyle} onClick={() => navigate(`/profile/stats?tab=${tabIndex.played}`)}><h3>Played : </h3> <span>{stats?.played?.length}</span> </h1>
                    <h1  style={statsStyle} onClick={() => navigate(`/profile/stats?tab=${tabIndex.onhold}`)}><p>on-hold :</p>  <span>{stats?.OnHold?.length}</span></h1> 
                </div>
                <div>
                    <h1  style={statsStyle} onClick={() => navigate(`/profile/stats?tab=${tabIndex.wanttoplay}`)}> <p>want to play :</p>  <span>{stats?.WantToPlay?.length}</span></h1>
                   <h1  style={statsStyle} onClick={() => navigate(`/profile/stats?tab=${tabIndex.dontwanttoplay}`)}> <p>Dont want to play :</p>  <span>{stats?.DontWantToPlay?.length}</span></h1>
                    
                </div>

                <div>
                    <h1>Total Games :</h1>
                    <h1>Total Hours Played :</h1>
                </div>
                
            </div>
        </>
    )
}