import { useEffect, useState, useContext } from 'react';
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

export function ProfileForums() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [forumIds, setForumIds] = useState([]);
    const [games, setGames] = useState([]);
    const { user } = useContext(AuthContext);
    const {id} = useParams();

    useEffect(() => {
        const fetchForums = async () => {
            try {
                const res = await fetch(`http://localhost:3000/game/${id}/get-forum`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    console.error("Failed to load forum data");
                    return;
                }

                const data = await res.json();
                const ids = data.forum?.Forums || [];
                setForumIds(ids);
            } catch (err) {
                console.error("Forum fetch error", err);
            }
        };

        fetchForums();
    }, [token]);

    useEffect(() => {
        const fetchGames = async () => {
            if (!forumIds.length) return;

            try {
                const res = await fetch("http://localhost:3000/games/batch", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
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
    }, [forumIds, token]);

    return (
        <>
            <h1>{user?.username}'s Forums:</h1>

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