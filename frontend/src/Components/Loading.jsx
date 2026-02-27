import { useEffect, useState } from "react";



export function Loading() {
    const [Loading,setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (Loading) return <p style={{fontSize:"30px",color:"white"}}> Loading... </p>
}