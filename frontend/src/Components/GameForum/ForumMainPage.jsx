import { useParams ,useNavigate} from "react-router-dom";
import { use, useEffect, useState } from "react";
import { CreatePost } from "../GameForum/CreatePost";
import { TextPostCard } from "../GameForum/TextPostCard";
import { LinkPostCard } from "../GameForum/LinkPostCard";
import { MediaPostCard } from "../GameForum/MediaPostCard";
import { DeletePosts } from './DeletePosts';

const getImageUrl = (imageId, size) =>
  `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`;

export function ForumMainPage() {

  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const deletePost = DeletePosts();

  useEffect(() => {
    fetch(`http://localhost:3000/game/${id}`)
      .then(res => res.json())
      .then(data => {
        setGame(data);
        setLoading(false);
        console.log(data);
      });
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:3000/game/${id}/getposts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res => res.json())
    .then(data => setPosts(data))
  }, [id])


  if (loading || !game) return <p style={{ color: "white" }}>Loading...</p>;

  const backgroundImage = game.artworks?.[0]?.image_id
    ? getImageUrl(game.artworks[0].image_id, "1080p")
    : null;

  const coverImage = game.artworks?.[0]?.image_id
    ? getImageUrl(game.artworks[0].image_id, "1080p")
    : game.cover?.image_id 
    ? getImageUrl(game.cover.image_id, "cover_big")
    : null;


  const buttonstyle = {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  }
  return (
    <>
    {/* cover and background section */}
      <div
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
          width: "90%",
          height: "500px",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          display: "flex",
          justifyContent: "start",
          alignItems: "end",
          margin: "0 auto",
          borderRadius: "10px",
          marginTop:"60px"
        }}
      >
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "30px",
        }}>
            { (
          <img
             src={game.cover}
            alt={game.name}
            style={{ 
                borderRadius: "40px",
                 width: "150px",height:"150px", 
                 objectFit:"cover",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)" ,
                  backgroundColor:"rgba(0,0,0,0.5)",
                  padding:"10px"

                }}
          /> 
        )}
        <p style={{ fontSize: "40px", color: "white",backgroundColor: "rgba(0, 0, 0, 0.5)", padding: "10px", borderRadius: "10px" }}>{game.name}</p>
        </div>
      </div>

        {/* join , create post  */}

      <div style={{
        display: "flex",
        justifyContent: "end",
        gap: "20px",
        marginTop: "20px",
        width: "90%",
      }}>
        <button style={buttonstyle}>Join Forum</button>
        <button style={buttonstyle} onClick={() => navigate(`/game/${id}/forum/create-post`)}>
          Create Post
        </button>
      </div>
      <br />
      {posts.map(post => {
        if (post.type === "text") return <TextPostCard key={post._id} post={post} deletePost={deletePost} />
        if (post.type === "link") return <LinkPostCard key={post._id} post={post} deletePost={deletePost} />
        if (post.type === "media") return <MediaPostCard key={post._id} post={post} deletePost={deletePost} />
      })}


    </>
  );
}