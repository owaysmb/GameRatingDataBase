
// select form
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';



export function Filters(){
    
    const platformsnames = ["PC","Xbox","PS5","Nintendo"]
    const Order = ["Relevent","Name","Release Date","Popularity","Average Rating"]
    return(
<>



    <div style={{display:"flex",gap:"20px",alignItems:"center",justifyContent:"end",paddingTop:"100px"}}> 

           <select name="Order" id="orderselection" 
                style={{ width: '300px',
            padding: '12px',
            fontSize: '16px',
            color: 'white',
            backgroundColor: 'black',
            border: '2px solid #ccc',
            borderRadius: '8px',
            outline: 'none',
            cursor: 'pointer',
            appearance: 'none',}}
                onFocus={(e)=>{e.target.style.borderColor = "rgba(0, 252, 42, 1)"}}
                onBlur={(e) => e.target.style.borderColor = '#f50000ff'}
                >
                <>
                        <option value="">Select your option</option>
                        {Order.map((name,i)=>(
                            <option key={i}>{name}</option>
                        ))}
                    </>
        </select>       



        <select name="Platforms" id="platformselection" 
                style={{ width: '300px',
                        padding: '12px',
                        fontSize: '16px',
                        color: 'white',
                        backgroundColor: 'black',
                        border: '2px solid #ccc',
                        borderRadius: '8px',
                        outline: 'none',
                        cursor: 'pointer',
                        appearance: 'none',}}
                        
                onFocus={(e)=>{e.target.style.borderColor = "rgba(0, 252, 42, 1)"}}
                onBlur={(e) => e.target.style.borderColor = '#f50000ff'}
                >
                    <>
                        <option value="">Select your option</option>
                        {platformsnames.map((name,i)=>(
                            <option key={i}>{name}</option>
                        ))}
                    </>
                
        </select>        
    </div>  
</>
    )
}