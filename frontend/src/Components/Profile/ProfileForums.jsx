import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

export function ProfileForums({ profileUser, isOwnProfile }) {
    const navigate = useNavigate();
    const [forumIds, setForumIds] = useState([]);
    const [games, setGames] = useState([]);

    useEffect(() => {
        const fetchForums = async () => {
            try {
                const res = await fetch(`http://localhost:3000/profile/${profileUser.username}/forums`, {
                    credentials: "include"
                });

                if (!res.ok) {
                    console.error("Failed to load forum data");
                    return;
                }

                const data = await res.json();
                setForumIds(data.forums || []);
            } catch (err) {
                console.error("Forum fetch error", err);
            }
        };

        fetchForums();
    }, [profileUser.username]);

    useEffect(() => {
        const fetchGames = async () => {
            if (!forumIds.length) {
                setGames([]);
                return;
            }

            try {
                const res = await fetch("http://localhost:3000/games/batch", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ ids: forumIds }),
                });

                const data = await res.json();
                const gamesWithForums = forumIds.map(id => {
                    const gameData = data.find(g => String(g.id) === String(id));
                    return { ...gameData, forumId: id };
                }).filter(Boolean);

                setGames(gamesWithForums);
            } catch (err) {
                console.error("Games batch fetch error", err);
            }
        };

        fetchGames();
    }, [forumIds]);

    return (
        <>
            <h1>{profileUser?.username}'s Forums:</h1>

            <div style={{display:"flex",gap:"20px",padding:"30px",backgroundColor:"#111",borderRadius:"20px",justifyContent:"space-around",textAlign:"center",flexWrap:"wrap"}}>
                {games.length === 0 ? (
                    <p style={{ color: "#aaa" }}>No joined forums yet.</p>
                ) : (
                    games.map((game) => (
                        <div key={game.forumId} style={{ display:"flex", flexDirection:"column", alignItems:"center", width:"150px" ,cursor:"pointer"}} onClick={() => navigate(`/game/${game.id}`)}>
                            {game.cover ? (
                                <img src={game.cover} alt={game.name} style={{width:"150px", height:"200px", objectFit:"cover", borderRadius:"8px"}} />
                            ) : null}
                            <div style={{ fontSize:"14px", textAlign:"center", color:"white" }}>{game.name || "Unknown game"}</div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}
