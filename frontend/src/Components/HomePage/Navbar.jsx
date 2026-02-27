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
        off:{
            height: "40px",
            width:"80%",
            transition: "height 2s",
            transition: "all 0.8s ease",
            borderRadius:"20px",
            alignItems:"start",
            padding:"10px",
            position:"absolute"
        },
        on:{
            transition: "all 0.8s ease",
            height:"280px",
            alignItems:"start",
            padding:"10px",
            borderRadius:"20px",
            width:"80%",
            position:"absolute"
        },
    }
    function styleclicked(){
        return clicked ? styles.on : styles.off
    }

  useEffect(() => {
        if (visibleItems && clicked) {
            setItemsToShow(0)
            const timers = []
            
            Items.forEach((_, index) => {
                const timer = setTimeout(() => {
                    setItemsToShow(index + 1)
                }, index * 300)
                timers.push(timer)
            })
            
            return () => timers.forEach(timer => clearTimeout(timer))
        } else {
            setItemsToShow(0)
        }
    }, [visibleItems, clicked])


function ShowItems(){
    if(clicked){
        setVisibleItems(true)
    }
}

    function ShowCategoriesAfterClick() {
        return (
            
    <div style={{
        
        marginTop: "20px",
        display:"flex",
        gap:"20px",
        justifyContent:"space-evenly",
        width:"100%",

        }}>
    
      {Items.map((x,index) => {
        const isVisible = index < itemsToShow
        return (
        <div key={x.label} 
            style={{ backgroundColor: x.bgColor, 
            color: x.textColor ,
            width:"150px",height:"150px",
            borderRadius:"10px",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-30px)', 
            transition: 'all 0.4s ease',
        }}>
            <div style={{display:"flex",justifyContent:"center",padding:"10px"}}>{x.label}</div>
            <div 
            style={{
                display:"flex",
                flexDirection:"column",
                alignItems:"start",
                height:"70%",
                justifyContent:"space-around",
                padding:"10px",
                }}>
                    {x.links.map((i)=>(<div >{i}</div>))}
          </div>
        </div>
      )})}  
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
            navigate("/profile")
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
                <PersonOutlinedIcon fontSize="large" sx={{backgroundColor:"transparent",color:"white",cursor:"pointer"}} onClick={handleLogin}/>
                </>
            )
        }else{
            return(
                <>
                {/* {navigate("/profile")} */}
                <div style={{display:"flex",alignContent:"center"}}>
                    <PersonOutlinedIcon fontSize="large" sx={{backgroundColor:"transparent",color:"green",cursor:"pointer"}}  onClick={handleLogin}/>
                    <button style={{backgroundColor:"lightblue",borderRadius:"10px",cursor:"pointer"}} onClick={handleLogout} >Logout</button>
                </div>
                </>
            )
            
        }
    }
   
    return(
        <>
        <div style={{display:"flex",justifyContent:"center",padding:"2rem"}}>
            
            <div style={{...styleclicked(),display: "flex", flexDirection: "column",   padding: "10px",backgroundColor:"black"}} onTransitionEnd={ShowItems} >
            <div style={{display: "flex",justifyContent: "space-between",width: "100%",}}> 
                 <DehazeRoundedIcon onClick={onClick} sx={{color:"white",backgroundColor:"transparent",fontSize:"30px",cursor:"pointer"}}/>
                 <img src={reactLogo} alt="logo" style={{cursor:"pointer"}} onClick={()=>navigate("/")} /> 
                 <form onSubmit={handleSearch}>
                   <input 
                   type="text" 
                   placeholder="  Search.." 
                   style={{width:"400px" , backgroundColor:"black",borderRadius:"40px",color:"white",height:"30px"}}
                   onChange={(e)=>setSearch(e.target.value)}
                   value={search}
                   /> 
                 </form>
                  
                {/* <PersonOutlinedIcon fontSize="large" sx={{backgroundColor:"transparent",color:"white",cursor:"pointer"}} onClick={CheckLogin}/> */}
                <ProfilePictureNavbar/>
            </div>
             {visibleItems  && <ShowCategoriesAfterClick/>} 
        </div>  
        </div>
          
        </>
    )
}


