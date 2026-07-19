
import { useLocation, useParams } from "react-router-dom";
import { TextPostCard } from "./TextPostCard";
import { MediaPostCard } from "./MediaPostCard";
import { LinkPostCard } from "./LinkPostCard";
import { DeletePosts } from './DeletePosts';
import { useState, useContext } from "react";
import { useEffect } from "react";
import { CommentsCard } from "./CommentsCard";
import { Pagination } from "../Pagination";
import { AuthContext } from "../../../context/AuthContext";

export function Comments() {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const post = location.state?.post;
    const deletePost = DeletePosts();
    const [Comment, setComment] = useState("");
    const {id} = useParams();
    const [AllComments,setAllComments] = useState([]);
    const [currentPage , setCurrentPage] = useState(1);
    const [commentPerPage,sercommentPerPage] = useState(10)
    const lastcommentIndex = currentPage * commentPerPage;
    const firstcommentIndex = lastcommentIndex - commentPerPage;


    const renderPostCard = () => {
        if (!post) {
            return <p>No post selected.</p>;
        }

        switch (post.type) {
            case "media":
                return <MediaPostCard post={post} deletePost={deletePost} />;
            case "link":
                return <LinkPostCard post={post} deletePost={deletePost} />;
            case "text":
            default:
                return <TextPostCard post={post} deletePost={deletePost} />;
        }
    };

    const handlesave = async ()=>{
        if (!user) {
            alert("Please log in to comment.");
            return;
        }
        await fetch(`http://localhost:3000/game/${id}/addcomment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ comment: Comment , postID:post._id , forumId:post.forumId })
         });
        setComment("");
    }

    useEffect(()=>{
        const fetchComment = async ()=>{
            const res = await fetch(`http://localhost:3000/game/${id}/getcomment/${post._id}`, {
            method: "GET",
            credentials: "include"
         })   

         const data = await res.json();
         setAllComments(data ?? []); 
         console.log(data); 
        }
         fetchComment();
    },[Comment])

    const currentComments = AllComments.slice(firstcommentIndex,lastcommentIndex);

    return (
        <>
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
                {renderPostCard()}

                {user ? (
                    <>
                        <input
                            type="text"
                            placeholder="Join the conversation"
                            value={Comment}
                            onChange={(e) => setComment(e.target.value)}
                            style={{ height: "50px", width: "700px", borderRadius: "40px" }}
                        />
                        <button onClick={(e) => {e.preventDefault(); handlesave();}} >Comment</button>
                    </>
                ) : (
                    <p style={{ color: "grey", fontSize: "14px" }}>
                        <span style={{ color: "#00d9ff", cursor: "pointer" }} onClick={() => window.location.href = "/login"}>Log in</span> to join the conversation.
                    </p>
                )}
            </div>

            {currentComments.map((c) => (
                <div key={c._id} style={{display:"grid"}} >
                    <CommentsCard post={post} comment={c}  />
                    <br />
                </div>
                
            ))}

            <Pagination totalPosts={AllComments.length} postPerPage={commentPerPage} setCurrentPage={setCurrentPage} />

        </>
        



    );
}
