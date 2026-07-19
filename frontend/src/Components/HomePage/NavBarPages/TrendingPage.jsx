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
       <PagesCard games={Trending}/>
    )
}