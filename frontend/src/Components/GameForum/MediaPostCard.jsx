import reactLogo from '../../assets/react.svg'
import { useParams ,useNavigate} from "react-router-dom";
import { use, useEffect, useState } from "react";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ShareIcon from '@mui/icons-material/Share';
import { MdDelete } from "react-icons/md";


export function MediaPostCard({post,deletePost}) {

    const user = JSON.parse(localStorage.getItem("user"))
    const [MediaPosts, setMediaPosts] = useState([]);
    const { id } = useParams();
    const token = localStorage.getItem("token")



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

                
                    <div style={{display:"flex",alignItems:"center",gap:"20px",hustifyContent:"start",width:"100%",height:"10px"}}>
                        <img src={reactLogo} style={{cursor:"pointer",width:"20px"}} />
                        <p>{post.userId?.username}</p>
                        {post.userId?._id === user?._id && (
                            <MdDelete onClick={() => deletePost(post._id)} />
                        )}
                    </div>

                    <div key={post._id} style={{display:"flex",flexDirection:"column",gap:"10px",alignItems:"start",width:"100%"}}>
                        <h3>{post.title}</h3>

                        <h3>
                            <img 
                                src={post.mediaUrl} 
                                style={{ width: "100%", borderRadius: "10px" }} 
                            />
                        </h3>

                        <p style={{color:"grey"}}>{post.text}</p>
                        <div style={{display:"flex",gap:"20px",alignItems:"center"}}>
                            <ThumbUpIcon />
                            {post.likes}
                            <ThumbDownIcon />
                            {post.disLikes}
                            <ShareIcon />
                        </div>
                    </div>
                

            </div>


      </div>  
    )

}