import reactLogo from '../../assets/react.svg'
import { useParams ,useNavigate} from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ShareIcon from '@mui/icons-material/Share';
import { MdDelete } from "react-icons/md";
import { FaComments } from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";

export function LinkPostCard({post,deletePost}) {

    const { user } = useContext(AuthContext);
    const [likeCount, setLikeCount] = useState(post?.likes?.length ?? 0);
    const [dislikeCount, setDislikeCount] = useState(post?.disLikes?.length ?? 0);
    const navigate = useNavigate();
    const {id} = useParams();

    useEffect(() => {
        setLikeCount(post?.likes?.length ?? 0);
        setDislikeCount(post?.disLikes?.length ?? 0);
    }, [post?.likes, post?.disLikes]);

    const handleLike = async (value) => {
        if (!post?._id) return;

        if (!user) {
            alert("Please log in to like or dislike posts.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/post-like", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ postId: post._id, like: value }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to update post like");
            }

            setLikeCount(data?.post?.likes?.length ?? likeCount);
            setDislikeCount(data?.post?.disLikes?.length ?? dislikeCount);
        } catch (error) {
            console.error("Like request failed:", error);
        }
    };

    const handleComments = () => {
        navigate(`/game/${id}/forum/${post._id}/comments`, {
            state: { post }
        });
    };

    const iconsStyle = {
        fontSize:"30px",
        color:"white",
        cursor:"pointer"
    }

    return(
    <div style={{
        display:"flex",
        flexDirection:"column",
        gap:"20px",
        marginTop:"20px",
        alignItems:"center",
    }}>

            <div style={{
                display:"flex",
                flexDirection:"column",
                gap:"20px",
                marginTop:"20px",
                alignItems:"center",
                backgroundColor:"rgba(63, 19, 57, 0.7)",
                padding:"20px",
                borderRadius:"10px",
                width:"40%",
                margin:"0 auto",
            }}>

                <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
                    <div style={{display:"flex",alignItems:"center",gap:"20px"}}>
                        <img src={reactLogo} style={{cursor:"pointer",width:"20px"}} />
                        <p style={{fontSize:"30px"}}>{post.userId?.username}</p>
                    </div>
                    {post.userId?._id === user?._id && (
                        <MdDelete onClick={() => deletePost(post._id)} style={{fontSize:"30px"}}/>
                    )}
                </div>

                <div key={post._id} style={{display:"flex",flexDirection:"column",gap:"10px",alignItems:"start",width:"100%"}}>
                    <h3>{post.title}</h3>
                    <h3><a href={post.linkUrl} target="_blank" rel="noopener noreferrer" style={{color:"#00d9ff"}}>{post.linkUrl}</a></h3>
                    <p style={{color:"grey"}}>{post.text}</p>
                    <div style={{display:"flex",gap:"20px",alignItems:"center"}}>
                        <ThumbUpIcon style={iconsStyle} onClick={() => handleLike(true)} />
                        {likeCount}
                        <ThumbDownIcon style={iconsStyle} onClick={() => handleLike(false)} />
                        {dislikeCount}
                        <FaComments style={iconsStyle} onClick={handleComments}/>
                        <ShareIcon style={iconsStyle}/>
                    </div>
                </div>


            </div>

      </div>
    )

}
