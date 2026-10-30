import { useContext, useState, useEffect } from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ShareIcon from '@mui/icons-material/Share';
import { MdDelete } from 'react-icons/md';
import { DeleteComments } from './DeleteComments';
import { AuthContext } from "../../../context/AuthContext";

export function CommentsCard({ post, comment }) {

    const { user } = useContext(AuthContext);
    const deleteComment = DeleteComments();
    const [likeCount, setLikeCount] = useState(comment?.likes?.length ?? 0);
    const [dislikeCount, setDislikeCount] = useState(comment?.disLikes?.length ?? 0);

    useEffect(() => {
        setLikeCount(comment?.likes?.length ?? 0);
        setDislikeCount(comment?.disLikes?.length ?? 0);
    }, [comment?.likes, comment?.disLikes]);

    const handleLike = async (value) => {
        if (!comment?._id) return;

        if (!user) {
            alert("Please log in to like or dislike comments.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/comment-like", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ commentId: comment._id, like: value }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to update comment like");
            }

            setLikeCount(data?.comment?.likes?.length ?? likeCount);
            setDislikeCount(data?.comment?.disLikes?.length ?? dislikeCount);
        } catch (error) {
            console.error("Like request failed:", error);
        }
    };

    const iconsStyle = {
        fontSize: "22px",
        color: "#b3b3b3",
        cursor: "pointer"
    }

    return (
        <div style={{
            backgroundColor: "#151515",
            border:"1px solid #2a2a2a",
            padding: "16px",
            borderRadius: "10px",
            width: "60%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
        }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <p style={{ fontSize: "16px", margin: 0, color:"#f5f5f5" }}>{comment?.userId?.username}</p>
                </div>
                {comment.userId?._id === user?._id && (
                    <MdDelete onClick={() => deleteComment(comment._id)} style={{ fontSize: "24px", cursor: "pointer", color:"#ec4899" }} />
                )}
            </div>
            <p style={{ color: "#b3b3b3", margin: 0 }}>{comment.text}</p>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", color:"#b3b3b3" }}>
                <ThumbUpIcon style={iconsStyle} onClick={() => handleLike(true)} />
                {likeCount}
                <ThumbDownIcon style={iconsStyle} onClick={() => handleLike(false)} />
                {dislikeCount}
                <ShareIcon style={iconsStyle} />
            </div>
        </div>
    )
}
