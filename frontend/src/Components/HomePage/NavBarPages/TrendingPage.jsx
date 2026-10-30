import { useEffect, useState } from "react"
import {PagesCard} from "../NavBarPages/FetchPagesCard"



export function TrendingPage(){

    const [Trending,SetTrending ] = useState([]);
    
      useEffect(() => { 
        const fetchTrending = async () => {
            const res = await fetch("http://localhost:3000/api/trending-page",{
                credentials: "include"
            })
            const data = await res.json();
            SetTrending(data);
            console.log(data);
        }
        fetchTrending()
    }, []);
 
    return(
        <div style={{paddingTop:"90px"}}>
            <h1 style={{color:"#f5f5f5",padding:"40px 80px 0",fontSize:"42px",fontWeight:"700"}}>Trending Games</h1>
            <PagesCard games={Trending}/>
        </div>
    )
}