import { useState } from "react";
import {LinkPost} from "../GameForum/LinkPost";
import { MediaPost } from "../GameForum/MediaPost";
import { TextPost } from "../GameForum/TextPost";

export function CreatePost() {

    const [postType, setPostType] = useState(null);

    return(
        <>
            {/* main div of the create post page */}
            <div style={{
                width: "90%",
                margin: "0 auto",
                
                padding: "20px",
                borderRadius: "10px",
                marginTop:"60px"
            }}>
                
                <h1 style={{color:"white", marginTop:"20px"}}>Create a Post</h1>
                <br />
                <ul style={{color:"white",
                    fontSize:"28px",
                    marginTop:"20px", 
                    display:"flex", 
                    gap:"30px",
                    justifyContent:"space-around",
                        listStyleType:"none",
                        marginRight:"80px",
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        padding: "20px",
                        borderRadius: "20px",
                        
                        }}>
                    <li onClick={() => setPostType("text")}>📝 Text</li>
                    <li onClick={() => setPostType("media")}>🖼 Image / Video</li>
                    <li onClick={() => setPostType("link")}>🔗 Link</li>

                    

                </ul>
            </div>
                    {(postType === "text" || postType === null) && <TextPost />}
                    {postType === "media" && <MediaPost />}
                    {postType === "link" && <LinkPost />}
        </>
    )

}