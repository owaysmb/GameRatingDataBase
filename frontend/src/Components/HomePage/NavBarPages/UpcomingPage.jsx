import { useEffect, useState } from "react"
import {PagesCard} from "../NavBarPages/FetchPagesCard"



export function UpcomingPage(){

    const [Upcoming,SetUpcoming ] = useState([]);
    
      useEffect(() => { 
        const fetchUpcoming= async () => {
            const res = await fetch("http://localhost:3000/api/Upcoming-page",{
                credentials: "include"
            })
            const data = await res.json();
            SetUpcoming(data);
            console.log(data);
        }
        fetchUpcoming()
    }, []);
 
    return(
        <PagesCard games = {Upcoming}/>
    )
}