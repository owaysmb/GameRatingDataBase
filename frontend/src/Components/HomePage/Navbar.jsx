import React, { useState, useEffect } from "react"
import { useContext } from "react";
import reactLogo from '../../assets/react.svg'
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
// ICONS
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import DehazeRoundedIcon from '@mui/icons-material/DehazeRounded';

export function NavbarButton(){
    const [clicked,setClicked] = useState(false)
    const [itemsToShow, setItemsToShow] = useState(0)
    const [visibleItems,setVisibleItems] = useState(false)
    const [search , setSearch] = useState("")
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const Items = [
        {label:"New Releases",color:"white",bgColor:"#02010a",textColor: "#fff",links:["1","2","3"]},
        {label:"Top Rated",color:"white",bgColor:"#00002b",textColor: "#fff",links:["1","2","3"]},
        {label:"Categories",color:"white",bgColor:"#13003d",textColor: "#fff",links:["1","2","3"]},
        {label:"Forums",color:"white",bgColor:"#210051",textColor: "#fff",links:["1","2","3"]},
        {label:"Browse",color:"white",bgColor:"#2b0056",textColor: "#fff",links:["1","2","3"]},
        {label:"Reviews",color:"white",bgColor:"#320261",textColor: "#fff",links:["1","2","3"]},
    ]
    
    
    function onClick(){
        setClicked(prev => !prev);
        if (clicked) {
            setVisibleItems(false);
        }
    }
    const styles = {
        off: {
            height: "64px",
            width: "92%",
            maxWidth: "1200px",
            transition: "all 0.3s ease",
            borderRadius: "10px",
            padding: "0 16px",
            position: "absolute",
            alignItems: "center",
            zIndex: 1000,
            backgroundColor: "#151515",
            border: "1px solid #2a2a2a",
        },
        on: {
            transition: "all 0.3s ease",
            height: "340px",
            alignItems: "start",
            padding: "0 16px",
            borderRadius: "10px",
            width: "92%",
            maxWidth: "1200px",
            position: "absolute",
            zIndex: 1000,
            backgroundColor: "#151515",
            border: "1px solid #2a2a2a",
        },
    };
    function styleclicked(){
        return clicked? styles.on : styles.off
    }

//   useEffect(() => {
//         if (visibleItems && clicked) {
//             setItemsToShow(0)
//             const timers = []
            
//             Items.forEach((_, index) => {
//                 const timer = setTimeout(() => {
//                     setItemsToShow(index + 1)
//                 }, index * 300)
//                 timers.push(timer)
//             })
            
//             return () => timers.forEach(timer => clearTimeout(timer))
//         } else {
//             setItemsToShow(0)
//         }
//     }, [visibleItems, clicked])

    const ListStyle = {
        cursor:"pointer",
        listStyle: "none",
        color: "#b3b3b3",
        fontSize: "15px",
    }
function ShowItems(){
    if(clicked){
        setVisibleItems(true)
    }
}

function closeNavbar() {
    setClicked(false);
    setVisibleItems(false);
}

    function ShowCategoriesAfterClick() {
        return (
            
    // <div style={{
        
    //     marginTop: "20px",
    //     display:"flex",
    //     gap:"20px",
    //     justifyContent:"space-evenly",
    //     width:"100%",

    //     }}>
    
    //   {Items.map((x,index) => {
    //     const isVisible = index < itemsToShow
    //     return (
    //     <div key={x.label} 
    //         style={{ backgroundColor: x.bgColor, 
    //         color: x.textColor ,
    //         width:"150px",height:"150px",
    //         borderRadius:"10px",
    //         opacity: isVisible ? 1 : 0,
    //         transform: isVisible ? 'translateY(0)' : 'translateY(-30px)', 
    //         transition: 'all 0.4s ease',
    //     }}>
    //         <div style={{display:"flex",justifyContent:"center",padding:"10px"}}>{x.label}</div>
    //         <div 
    //         style={{
    //             display:"flex",
    //             flexDirection:"column",
    //             alignItems:"start",
    //             height:"70%",
    //             justifyContent:"space-around",
    //             padding:"10px",
    //             }}>
    //                 {x.links.map((i)=>(<div >{i}</div>))}
    //       </div>
    //     </div>
    //   )})}  
    // </div>
    
    <div style={{color:"#f5f5f5",fontSize:"16px",display:"flex",justifyContent:"space-between",width:"100%",padding:"20px 0",flexWrap:"wrap",gap:"20px",overflowX:"auto"}}>
        {/* Discover */}
        <ul style={{display:"grid",gap:"8px",margin:0,padding:0}}>
            <h2 style={{margin:"0 0 8px 0",fontSize:"16px",color:"#f5f5f5"}}>Discover</h2>
            <li onClick={()=> {navigate("/top-rated-page"); closeNavbar()}}  style={{...ListStyle}} onMouseEnter={(e)=>e.currentTarget.style.color="#ec4899"} onMouseLeave={(e)=>e.currentTarget.style.color="#b3b3b3"}>Top Games</li>
            <li onClick={()=> {navigate("/new-released-page"); closeNavbar()}} style={{...ListStyle}} onMouseEnter={(e)=>e.currentTarget.style.color="#ec4899"} onMouseLeave={(e)=>e.currentTarget.style.color="#b3b3b3"}>New Released</li>
            <li onClick={()=> {navigate("/trending-page"); closeNavbar()}}     style={{...ListStyle}} onMouseEnter={(e)=>e.currentTarget.style.color="#ec4899"} onMouseLeave={(e)=>e.currentTarget.style.color="#b3b3b3"}>Trending Games</li>
            <li onClick={()=> {navigate("/Upcoming-page"); closeNavbar()}}     style={{...ListStyle}} onMouseEnter={(e)=>e.currentTarget.style.color="#ec4899"} onMouseLeave={(e)=>e.currentTarget.style.color="#b3b3b3"}>Upcoming Games</li>
        </ul>
        {/* Database */}
        <ul style={{display:"grid",gap:"8px",margin:0,padding:0}}>
            <h2 style={{margin:"0 0 8px 0",fontSize:"16px",color:"#f5f5f5"}}>Database</h2>
            <li style={ListStyle} onMouseEnter={(e)=>e.currentTarget.style.color="#ec4899"} onMouseLeave={(e)=>e.currentTarget.style.color="#b3b3b3"}>Advanced Search</li>
            <li style={ListStyle} onMouseEnter={(e)=>e.currentTarget.style.color="#ec4899"} onMouseLeave={(e)=>e.currentTarget.style.color="#b3b3b3"}>Platforms</li>
            <li style={ListStyle} onMouseEnter={(e)=>e.currentTarget.style.color="#ec4899"} onMouseLeave={(e)=>e.currentTarget.style.color="#b3b3b3"}>Events</li>
        </ul >
        {/* Community */}
        <ul style={{display:"grid",gap:"8px",margin:0,padding:0}}>
            <h2 style={{margin:"0 0 8px 0",fontSize:"16px",color:"#f5f5f5"}}>Community</h2>
            <li style={ListStyle} onMouseEnter={(e)=>e.currentTarget.style.color="#ec4899"} onMouseLeave={(e)=>e.currentTarget.style.color="#b3b3b3"} >Forums</li>
            <li onClick={()=> {navigate("/users"); closeNavbar()}} style={ListStyle} onMouseEnter={(e)=>e.currentTarget.style.color="#ec4899"} onMouseLeave={(e)=>e.currentTarget.style.color="#b3b3b3"} >Users</li>
        </ul>
        {/* Help */}
        <ul style={{display:"grid",gap:"8px",margin:0,padding:0}}>
            <h2 style={{margin:"0 0 8px 0",fontSize:"16px",color:"#f5f5f5"}}>Help</h2>
            <li style={ListStyle} onMouseEnter={(e)=>e.currentTarget.style.color="#ec4899"} onMouseLeave={(e)=>e.currentTarget.style.color="#b3b3b3"}>Contact</li>
            <li style={ListStyle} onMouseEnter={(e)=>e.currentTarget.style.color="#ec4899"} onMouseLeave={(e)=>e.currentTarget.style.color="#b3b3b3"}>About GRDB</li>
            <li style={ListStyle} onMouseEnter={(e)=>e.currentTarget.style.color="#ec4899"} onMouseLeave={(e)=>e.currentTarget.style.color="#b3b3b3"}>API Documentation</li>
            <li style={ListStyle} onMouseEnter={(e)=>e.currentTarget.style.color="#ec4899"} onMouseLeave={(e)=>e.currentTarget.style.color="#b3b3b3"}>Social Media</li>
        </ul>
    </div>


  );
    }
    

    const handleSearch = async (e)=>{
        e.preventDefault();
        const res = await fetch(`http://localhost:3000/search/${search}`);
        const data = await res.json();

        if (data.length > 0) {
            navigate(`/game/${data[0].id}`);
            setSearch("")
        }else{
            console.log("game id not found ")
            return <h1>No such a game with this name</h1>
        }
        
    }

    const handleLogin = ()=>{
        if(!user){
            navigate("/login")
        }else{
            navigate(`/${user.username}/profile`)
        }
        
    }
    
    const handleLogout = () => {
        logout()
        navigate("/login")
    }
    function ProfilePictureNavbar() {

        if(!user){
            return(
                <>
                <PersonOutlinedIcon fontSize="large" sx={{backgroundColor:"transparent",color:"#f5f5f5",cursor:"pointer"}} onClick={()=>{handleLogin();closeNavbar()}}/>
                </>
            )
        }else{
            return(
                <>
                {/* {navigate("/profile")} */}
                <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                    <PersonOutlinedIcon fontSize="large" sx={{backgroundColor:"transparent",color:"#f5f5f5",cursor:"pointer"}}  onClick={()=> {handleLogin();closeNavbar()}}/>
                    <button style={{backgroundColor:"#1f1f1f",color:"#f5f5f5",border:"1px solid #2a2a2a",borderRadius:"6px",cursor:"pointer",padding:"6px 10px"}} onClick={handleLogout} >Logout</button>
                </div>
                </>
            )
            
        }
    }
   
    return(
        <>
        <div style={{display:"flex",justifyContent:"center",padding:"1rem 1.5rem"}}>
            
            <div style={{...styleclicked(),display: "flex", flexDirection: "column",   padding: "0 16px",backgroundColor:"#151515"}} onTransitionEnd={ShowItems} >
            <div style={{display: "flex",justifyContent: "space-between",width: "100%", alignItems:"center", height:"64px", gap:"12px", flexWrap:"nowrap"}}> 
                 <DehazeRoundedIcon onClick={onClick} sx={{color:"#f5f5f5",backgroundColor:"transparent",fontSize:"28px",cursor:"pointer"}}/>
                 <img src={reactLogo} alt="logo" style={{cursor:"pointer"}} onClick={()=>{navigate("/");closeNavbar()}} /> 
                 <form onSubmit={handleSearch}>
                   <input 
                   type="text" 
                   placeholder="Search games..." 
                   style={{width:"clamp(200px, 40vw, 320px)",borderRadius:"8px",color:"#f5f5f5",height:"36px",border:"1px solid #2a2a2a",outline:"none",backgroundColor:"#1f1f1f",padding:"0 12px"}}
                   onChange={(e)=>{setSearch(e.target.value);}}
                   value={search}
                   /> 
                 </form>
                   
                <ProfilePictureNavbar/>
            </div>
             {visibleItems  && <ShowCategoriesAfterClick/>} 
        </div>  
        </div>
          
        </>
    )
}


