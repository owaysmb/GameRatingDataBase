import { useEffect, useState } from "react"
import {PagesCard} from "../NavBarPages/FetchPagesCard"



export function TrendingPage(){

    const [Trending,SetTrending ] = useState([]);
    const token = localStorage.getItem("token");
    
      useEffect(() => { 
        const fetchTrending = async () => {
            const res = await fetch("http://localhost:3000/api/trending-page",{
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            })
            const data = await res.json();
            SetTrending(data);
            console.log(data);
        }
        fetchTrending()
    }, []);
 
    return(
       <PagesCard games={Trending}/>
    )
}