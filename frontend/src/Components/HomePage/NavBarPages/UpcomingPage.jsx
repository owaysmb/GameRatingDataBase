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
        <div style={{paddingTop:"90px"}}>
            <h1 style={{color:"#f5f5f5",padding:"40px 80px 0",fontSize:"42px",fontWeight:"700"}}>Upcoming Games</h1>
            <PagesCard games = {Upcoming}/>
        </div>
    )
}