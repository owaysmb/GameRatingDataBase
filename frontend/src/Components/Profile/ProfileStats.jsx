

import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function ProfileStats({ profileUser, isOwnProfile }) {
        const [stats,SetStats] = useState(0);
        const navigate = useNavigate()
        const { username } = useParams();
        const [TotalHours , SetTotalHours] = useState(0);
        const tabIndex = {
            playing: 1,
            played: 2,
            onhold: 3,
            wanttoplay: 4,
            dontwanttoplay: 5,
        };

        useEffect(()=>{
            const fetchStats = async ()=>{
                    const res = await fetch(`http://localhost:3000/getstats?userId=${profileUser._id}`,{
                        credentials: "include"
                    });

                    const statsData = await res.json();
                    SetStats(statsData)

                }
            fetchStats();
        },[profileUser._id])


useEffect(()=>{
     const handleGetProgress = async ()=>{
        const GetProgress = await fetch(`http://localhost:3000/getprogress?userId=${profileUser._id}`,{
            credentials: "include",
        })
        const data = await GetProgress.json();
        SetTotalHours(data.UserProgress?.Progress.TotalHours)

    }
    handleGetProgress();
},[profileUser._id])


        const statsStyle = {
            width:"260px",
            display:"flex",
            alignItems:"center",
            justifyContent:"space-between",
            fontSize:"18px",
            height:"40px",
            cursor:"pointer",
            color:"#f5f5f5",
            margin:"8px 0"
        }




    return(
        <>
            <h1 onClick={()=>navigate(`/${username}/profile/stats`)} style={{cursor:"pointer",width:"200px",color:"#f5f5f5",fontSize:"28px"}}>Statistics</h1>
            <div style={{display:"flex",gap:"40px",padding:"24px",backgroundColor:"#151515",borderRadius:"10px",border:"1px solid #2a2a2a",flexWrap:"wrap"}}>
                <div>
                    <div style={statsStyle} onClick={() => navigate(`/${username}/profile/stats?tab=${tabIndex.playing}`)} ><span>Playing</span> <span style={{color:"#8a8a8a"}}>{stats?.playing?.length || 0}</span></div>
                    <div style={statsStyle} onClick={() => navigate(`/${username}/profile/stats?tab=${tabIndex.played}`)}><span>Played</span> <span style={{color:"#8a8a8a"}}>{stats?.played?.length || 0}</span> </div>
                    <div style={statsStyle} onClick={() => navigate(`/${username}/profile/stats?tab=${tabIndex.onhold}`)}><span>On Hold</span>  <span style={{color:"#8a8a8a"}}>{stats?.OnHold?.length || 0}</span></div>
                </div>
                <div>
                    <div style={statsStyle} onClick={() => navigate(`/${username}/profile/stats?tab=${tabIndex.wanttoplay}`)}> <span>Want to Play</span>  <span style={{color:"#8a8a8a"}}>{stats?.WantToPlay?.length || 0}</span></div>
                   <div style={statsStyle} onClick={() => navigate(`/${username}/profile/stats?tab=${tabIndex.dontwanttoplay}`)}> <span>Don't Want to Play</span>  <span style={{color:"#8a8a8a"}}>{stats?.DontWantToPlay?.length || 0}</span></div>

                </div>

                <div style={{color:"#f5f5f5"}}>
                    <h2 style={{margin:"10px 0",fontSize:"20px"}}>Total Games: {stats?.allgames?.length || 0}</h2>
                    <h2 style={{margin:"10px 0",fontSize:"20px"}}>Total Hours Played: {TotalHours || 0}</h2>
                </div>

            </div>
        </>
    )
}
