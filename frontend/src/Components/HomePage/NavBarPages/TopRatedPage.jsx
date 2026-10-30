import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import {PagesCard} from "../NavBarPages/FetchPagesCard"



export function TopRatedPage(){
    const navigate = useNavigate("");
    const [TopRated,SetTopRated ] = useState([]);
    
      useEffect(() => { 
        const fetchTopRated = async () => {
            const res = await fetch("http://localhost:3000/api/top-rated-page",{
                credentials: "include"
            })
            const data = await res.json();
            SetTopRated(data);
            console.log(data);
        }
        fetchTopRated()
    }, []);
    



    return(
        <div style={{paddingTop:"90px"}}>
            <h1 className="page-header" style={{color:"#f5f5f5",padding:"40px 80px 0",fontSize:"42px",fontWeight:"700"}}>Top Rated Games</h1>
            <PagesCard games= {TopRated}/>
        </div>
    )
}