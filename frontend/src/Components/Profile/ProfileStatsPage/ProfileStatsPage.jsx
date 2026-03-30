import { useState } from "react";
import { StatsStructure } from "../ProfileStatsPage/StatsStructure";
import { useSearchParams } from "react-router-dom";

export function ProfileStatsPage() {
    const tabs = [
        { key: "allgames",       label:  "All Games" },
        { key: "playing",        label:  "playing" },
        { key: "played",         label:  "played" },
        { key: "onhold",         label:  "On Hold" },
        { key: "wanttoplay",     label:  "Want to Play" },
        { key: "dontwanttoplay", label:  "Don't Want to Play" },
    ];

    const [searchParams] = useSearchParams();
    const tabParam = searchParams.get("tab");
    
    const [activeLink, setActiveLink] = useState(
        tabs[Number(tabParam)]?.key ?? "allgames"
    );

    return (
        <>
            <div style={{ backgroundColor:"#111", padding:"20px", marginTop:"40px", borderRadius:"20px", display:"flex", justifyContent:"center" }}>
                <ul style={{ color:"white", display:"flex", justifyContent:"space-between", width:"80%", listStyle:"none", fontSize:"25px", cursor:"pointer", margin:0, padding:0 }}>
                    {tabs.map(tab => (
                        <li
                            key={tab.key}
                            onClick={() => setActiveLink(tab.key)}
                            style={{
                                borderBottom: activeLink === tab.key ? "2px solid lightblue" : "2px solid transparent",
                                paddingBottom: "4px"
                            }}
                        >
                            {tab.label}
                        </li>
                    ))}
                </ul>
            </div>

            <StatsStructure link={activeLink} />
        </>
    );
}