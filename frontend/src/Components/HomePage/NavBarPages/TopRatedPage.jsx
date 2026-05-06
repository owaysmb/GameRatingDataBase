import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import {PagesCard} from "../NavBarPages/FetchPagesCard"



export function TopRatedPage(){
    const navigate = useNavigate("");
    const [TopRated,SetTopRated ] = useState([]);
    const token = localStorage.getItem("token");
    
      useEffect(() => { 
        const fetchTopRated = async () => {
            const res = await fetch("http://localhost:3000/api/top-rated-page",{
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            })
            const data = await res.json();
            SetTopRated(data);
            console.log(data);
        }
        fetchTopRated()
    }, []);
    



    return(
        <>
            <PagesCard games= {TopRated}/>
        </>
    )
}