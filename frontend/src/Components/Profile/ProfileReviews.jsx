import { useState } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { DeleteReviews } from './ProfileStatsPage/DeleteReview';

export function ProfileReviews() {
    const token = localStorage.getItem("token");
    const [Reviews, SetReviews] = useState([]);
    const [game, setGames] = useState([]);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const deleteReview = DeleteReviews();

    const fetchReviews = async () => {
        const resReviews = await fetch("http://localhost:3000/getreview", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await resReviews.json();
        SetReviews(data.reviews);
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    useEffect(() => {
        const fetchGames = async () => {
            const res = await fetch("http://localhost:3000/games/batch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ids: Reviews.map(r => r.gameId) }),
            });
            const data = await res.json();
            const gamesWithReviews = Reviews.map(r => {
                const gameData = data.find(g => String(g.id) === r.gameId);
                return { ...gameData, review: r.review, reviewId: r.reviewId };
            });

            setGames(gamesWithReviews);
        };

        if (Reviews?.length > 0) fetchGames();
    }, [Reviews]);

    const handleDeleteClick = async (reviewId) => {
        const success = await deleteReview(reviewId);
        if (success) {
            setGames(prev => prev.filter(g => g.reviewId !== reviewId));
        }
    };
    return (
        <>
            <h1>{user?.username}'s Reviews : </h1>

            <div style={{display:"flex",gap:"20px",padding:"30px",backgroundColor:"#111",borderRadius:"20px",justifyContent:"space-around",textAlign:"center",flexWrap:"wrap"}}>
                {game?.map(g => (
                    <div key={g.reviewId} style={{flexDirection:"column",alignItems:"center",width:"250px",cursor:"pointer",backgroundColor:"#333",padding:"10px",borderRadius:"10px"}}>
                        <div style={{display:"flex",alignItems:"start",justifyContent:"space-between"}}>
                            {g.cover
                                ? <img src={g.cover} alt={g.name} style={{width:"150px",height:"200px",objectFit:"cover",borderRadius:"8px"}} onClick={() => navigate(`/game/${g.id}`)} />
                                : <div style={{width:"150px",height:"200px",backgroundColor:"#333",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",color:"#666"}}>No Image</div>
                            }
                           <MdDelete onClick={() => handleDeleteClick(g.reviewId)} style={{fontSize:"30px",cursor:"pointer"}} />
                        </div>

                        <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:"250px",cursor:"pointer"}}>
                            <h2 style={{fontSize:"20px",textAlign:"center",color:"white"}}>{g.name}</h2>
                            <p style={{color:"lightblue",fontSize:"20px"}}>{g.review}</p>
                        </div>
                    </div>
                ))}
            </div>

        </>
    );
}