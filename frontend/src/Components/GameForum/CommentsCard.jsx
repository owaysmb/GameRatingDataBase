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
        fontSize: "24px",
        color: "white",
        cursor: "pointer"
    }

    return (
        <div style={{
            backgroundColor: "rgba(63, 19, 57, 0.5)",
            padding: "16px",
            borderRadius: "10px",
            width: "40%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
        }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <p style={{ fontSize: "18px", margin: 0 }}>{comment?.userId?.username}</p>
                </div>
                {comment.userId?._id === user?._id && (
                    <MdDelete onClick={() => deleteComment(comment._id)} style={{ fontSize: "24px", cursor: "pointer" }} />
                )}
            </div>
            <p style={{ color: "grey", margin: 0 }}>{comment.text}</p>
            <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <ThumbUpIcon style={iconsStyle} onClick={() => handleLike(true)} />
                {likeCount}
                <ThumbDownIcon style={iconsStyle} onClick={() => handleLike(false)} />
                {dislikeCount}
                <ShareIcon style={iconsStyle} />
            </div>
        </div>
    )
}
