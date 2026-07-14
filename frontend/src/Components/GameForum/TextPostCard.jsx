import reactLogo from '../../assets/react.svg'
import { useParams ,useNavigate} from "react-router-dom";
import { use, useEffect, useState } from "react";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ShareIcon from '@mui/icons-material/Share';
import { MdDelete } from "react-icons/md";


export function TextPostCard({post,deletePost}) {

    const user = JSON.parse(localStorage.getItem("user"))
    const token = localStorage.getItem("token")
    const [likeCount, setLikeCount] = useState(post?.likes?.length ?? 0);
    const [dislikeCount, setDislikeCount] = useState(post?.disLikes?.length ?? 0);

    useEffect(() => {
        setLikeCount(post?.likes?.length ?? 0);
        setDislikeCount(post?.disLikes?.length ?? 0);
    }, [post?.likes, post?.disLikes]);

    const handleLike = async (value) => {
        if (!token || !post?._id) return;

        try {
            const response = await fetch("http://localhost:3000/post-like", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ postId: post._id, like: value}),
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

                
                    <div style={{display:"flex",alignItems:"center",gap:"20px",justifyContent:"start",width:"100%",height:"10px"}}>
                        <img src={reactLogo} style={{cursor:"pointer",width:"20px"}} />
                        <p>{post.userId?.username}</p>
                        {post.userId?._id === user?._id && (
                           <MdDelete onClick={() => deletePost(post._id)} />
                        )}
                    </div>

                    <div key={post._id} style={{display:"flex",flexDirection:"column",gap:"10px",alignItems:"start",width:"100%"}}>
                        <h3 style={{}}>{post.title}</h3>
                        <p style={{color:"grey"}}>{post.text}</p>
                        <div style={{display:"flex",gap:"20px",alignItems:"center"}}>
                            <ThumbUpIcon onClick={() => handleLike(true)} />
                            {likeCount}
                            <ThumbDownIcon onClick={() => handleLike(false)} />
                            {dislikeCount}
                            <ShareIcon />
                        </div>
                    </div>
                

            </div>
      </div>  
    )

}