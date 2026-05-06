import { useEffect, useState } from "react"
import {PagesCard} from "../NavBarPages/FetchPagesCard"



export function NewReleasedPage(){

    const [NewReleased,SetNewReleased ] = useState([]);
    const token = localStorage.getItem("token");
    
      useEffect(() => { 
        const fetchNewReleased = async () => {
            const res = await fetch("http://localhost:3000/api/new-released-page",{
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            })
            const data = await res.json();
            SetNewReleased(data);
            console.log(data);
        }
        fetchNewReleased()
    }, []);
 
    return(
        <>
        <PagesCard games= {NewReleased}/>
        </>
    )
}