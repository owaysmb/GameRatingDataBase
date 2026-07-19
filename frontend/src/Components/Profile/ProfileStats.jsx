

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
            <h1 onClick={()=>navigate(`/${username}/profile/stats`)} style={{cursor:"pointer",width:"200px"}}>Statistics :</h1>
            <div style={{display:"flex",gap:"300px",padding:"30px",backgroundColor:"#111",borderRadius:"20px"}}>
                <div>
                    <div style={statsStyle} onClick={() => navigate(`/${username}/profile/stats?tab=${tabIndex.playing}`)} ><h3>Playing :</h3> <span>{stats?.playing?.length}</span></div>
                    <h1  style={statsStyle} onClick={() => navigate(`/${username}/profile/stats?tab=${tabIndex.played}`)}><h3>Played : </h3> <span>{stats?.played?.length}</span> </h1>
                    <h1  style={statsStyle} onClick={() => navigate(`/${username}/profile/stats?tab=${tabIndex.onhold}`)}><p>on-hold :</p>  <span>{stats?.OnHold?.length}</span></h1>
                </div>
                <div>
                    <h1  style={statsStyle} onClick={() => navigate(`/${username}/profile/stats?tab=${tabIndex.wanttoplay}`)}> <p>want to play :</p>  <span>{stats?.WantToPlay?.length}</span></h1>
                   <h1  style={statsStyle} onClick={() => navigate(`/${username}/profile/stats?tab=${tabIndex.dontwanttoplay}`)}> <p>Dont want to play :</p>  <span>{stats?.DontWantToPlay?.length}</span></h1>

                </div>

                <div>
                    <h1>Total Games : {stats?.allgames?.length}</h1>
                    <h1>Total Hours Played : {TotalHours}</h1>
                </div>

            </div>
        </>
    )
}
