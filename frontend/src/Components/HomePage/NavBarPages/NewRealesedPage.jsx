import { useEffect, useState } from "react"
import {PagesCard} from "../NavBarPages/FetchPagesCard"



export function NewReleasedPage(){

    const [NewReleased,SetNewReleased ] = useState([]);
    
      useEffect(() => { 
        const fetchNewReleased = async () => {
            const res = await fetch("http://localhost:3000/api/new-released-page",{
                credentials: "include"
            })
            const data = await res.json();
            SetNewReleased(data);
            console.log(data);
        }
        fetchNewReleased()
    }, []);
 
    return(
        <div style={{paddingTop:"90px"}}>
            <h1 style={{color:"#f5f5f5",padding:"40px 80px 0",fontSize:"42px",fontWeight:"700"}}>Recently Released Games</h1>
            <PagesCard games= {NewReleased}/>
        </div>
    )
}