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
            <div style={{ backgroundColor:"#151515", padding:"16px", marginTop:"110px", borderRadius:"10px", display:"flex", justifyContent:"center", border:"1px solid #2a2a2a" }}>
                <ul style={{ color:"#f5f5f5", display:"flex", justifyContent:"space-between", width:"90%", listStyle:"none", fontSize:"18px", cursor:"pointer", margin:0, padding:0, flexWrap:"wrap", gap:"12px" }}>
                    {tabs.map(tab => (
                        <li
                            key={tab.key}
                            onClick={() => setActiveLink(tab.key)}
                            style={{
                                borderBottom: activeLink === tab.key ? "2px solid #8b5cf6" : "2px solid transparent",
                                paddingBottom: "4px",
                                color: activeLink === tab.key ? "#f5f5f5" : "#b3b3b3"
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