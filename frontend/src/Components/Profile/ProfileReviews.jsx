import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { DeleteReviews } from './DeleteReview';

export function ProfileReviews({ profileUser, isOwnProfile }) {
    const [Reviews, SetReviews] = useState([]);
    const [game, setGames] = useState([]);
    const navigate = useNavigate();
    const deleteReview = DeleteReviews();

    const fetchReviews = async () => {
        try {
            const resReviews = await fetch(`http://localhost:3000/getreview?userId=${profileUser._id}`, {
                credentials: "include"
            });
            const data = await resReviews.json();
            const reviews = Array.isArray(data.reviews) ? data.reviews : [];
            SetReviews(reviews);
            if (!reviews.length) {
                setGames([]);
            }
        } catch (error) {
            console.error("Failed to load reviews:", error);
            SetReviews([]);
            setGames([]);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [profileUser._id]);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const ids = Reviews.map(r => r.gameId).filter(Boolean);
                if (!ids.length) {
                    setGames([]);
                    return;
                }

                const res = await fetch("http://localhost:3000/games/batch", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ ids }),
                });
                const data = await res.json();
                const gamesWithReviews = Reviews.map(r => {
                    const gameData = data.find(g => String(g.id) === String(r.gameId));
                    return { ...gameData, review: r.review, reviewId: r.reviewId };
                });

                setGames(gamesWithReviews);
            } catch (error) {
                console.error("Failed to load review games:", error);
                setGames([]);
            }
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
            <h1 style={{color:"#f5f5f5",fontSize:"28px"}}>{profileUser?.username}'s Reviews</h1>

            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))",gap:"16px",padding:"20px",backgroundColor:"#151515",borderRadius:"10px",border:"1px solid #2a2a2a"}}>
                {game?.map(g => (
                    <div key={g.reviewId} style={{display:"flex",flexDirection:"column",backgroundColor:"#1f1f1f",border:"1px solid #2a2a2a",borderRadius:"10px",overflow:"hidden"}}>
                        <div style={{position:"relative"}}>
                            {g.cover
                                ? <img src={g.cover} alt={g.name} style={{width:"100%",height:"200px",objectFit:"cover",cursor:"pointer"}} onClick={() => navigate(`/game/${g.id}`)} />
                                : <div style={{width:"100%",height:"200px",backgroundColor:"#1f1f1f",display:"flex",alignItems:"center",justifyContent:"center",color:"#8a8a8a"}}>No Image</div>
                            }
                            {isOwnProfile && <MdDelete onClick={() => handleDeleteClick(g.reviewId)} style={{fontSize:"22px",cursor:"pointer",color:"#ec4899",position:"absolute",top:"8px",right:"8px",background:"rgba(10,10,10,0.7)",borderRadius:"50%",padding:"4px"}} />}
                        </div>
                        <div style={{padding:"12px",display:"flex",flexDirection:"column",gap:"8px"}}>
                            <h2 style={{fontSize:"16px",color:"#f5f5f5",margin:0,cursor:"pointer"}} onClick={() => navigate(`/game/${g.id}`)}>{g.name}</h2>
                            <p style={{color:"#b3b3b3",fontSize:"14px",margin:0,whiteSpace:"pre-wrap"}}>{g.review}</p>
                        </div>
                    </div>
                ))}
            </div>

        </>
    );
}