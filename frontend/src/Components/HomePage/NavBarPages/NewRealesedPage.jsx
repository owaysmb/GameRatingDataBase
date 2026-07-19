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
        <>
        <PagesCard games= {NewReleased}/>
        </>
    )
}