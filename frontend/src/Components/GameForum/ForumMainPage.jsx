import { useParams ,useNavigate} from "react-router-dom";
import { use, useEffect, useState, useContext } from "react";
import { CreatePost } from "../GameForum/CreatePost";
import { TextPostCard } from "../GameForum/TextPostCard";
import { LinkPostCard } from "../GameForum/LinkPostCard";
import { MediaPostCard } from "../GameForum/MediaPostCard";
import { DeletePosts } from './DeletePosts';
import { Pagination } from "../Pagination";
import { AuthContext } from "../../../context/AuthContext";

const getImageUrl = (imageId, size) =>
  `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`;

export function ForumMainPage() {

  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [forum, setForum] = useState(null);
  const [ForumButtonClicked, setForumButtonClicked] = useState(false);
  const [currentPage , setCurrentPage] = useState(1);
  const [postPerPage,serPostPerPage] = useState(10)
  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;


  const deletePost = DeletePosts();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(`http://localhost:3000/game/${id}`);
        const data = await res.json();
        setGame(data);
      } catch (err) {
        console.error("Failed to load game", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:3000/game/${id}/getposts`, {
      credentials: "include"
    })
    .then(res => res.json())
    .then(data => setPosts(data))
  }, [id])

  const toggleForumMembership = async () => {
    if (!user) {
      alert("Please log in to join the forum.");
      return;
    }
    const nextValue = !ForumButtonClicked;
    setForumButtonClicked(nextValue);

    try {
      const res = await fetch(`http://localhost:3000/game/${id}/join-forum`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ gameId: id, forumJoined: nextValue })
      });

      if (!res.ok) {
        setForumButtonClicked(ForumButtonClicked);
        console.error("Failed to update forum membership");
        return;
      }

      const data = await res.json();
      console.log(data.message);
    } catch (err) {
      setForumButtonClicked(ForumButtonClicked);
      console.error("Join forum error", err);
    }
  };


  const currentPosts = posts.slice(firstPostIndex,lastPostIndex);

  useEffect(() => {
    const fetchForum = async () => {
      try {
        const res = await fetch(`http://localhost:3000/game/${id}/get-forum`, {
          credentials: "include"
        });

        if (!res.ok) {
          console.error("Failed to load forum data");
          return;
        }

        const data = await res.json();
        setForum(data.forum || null);
        console.log("Forum data", data);
        if (data.forum && data.forum.Forums.includes(id)) {
          setForumButtonClicked(true);
        } else {
          setForumButtonClicked(false);
        }
      } catch (err) {
        console.error("Forum fetch error", err);
      }
    };

    fetchForum();
  }, [id]);

  if (loading) return <p style={{ color: "white" }}>Loading...</p>;
  if (!game) return <p style={{ color: "white" }}>Could not load game details.</p>;

  const backgroundImage = game.artworks?.[0]?.image_id
    ? getImageUrl(game.artworks[0].image_id, "1080p")
    : null;

  const coverImage = game.artworks?.[0]?.image_id
    ? getImageUrl(game.artworks[0].image_id, "1080p")
    : game.cover?.image_id 
    ? getImageUrl(game.cover.image_id, "cover_big")
    : null;


  const ForumButtonStyle = {
    backgroundColor: "green",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s ease",
  }

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
             src={coverImage || ""}
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
        
        <button style={ForumButtonClicked ? ForumButtonStyle : buttonstyle} onClick={toggleForumMembership}>
          {ForumButtonClicked ? "Joined" : "Join Forum"}
        </button>
        {user ? (
          <button style={buttonstyle} onClick={() => navigate(`/game/${id}/forum/create-post`)}>
            Create Post
          </button>
        ) : (
          <button style={{...buttonstyle, opacity: 0.5, cursor: "not-allowed"}} onClick={() => alert("Please log in to create a post.")}>
            Create Post
          </button>
        )}
      </div>
      <br />
      {currentPosts.map(post => {
        if (post.type === "text") return <TextPostCard key={post._id} post={post} deletePost={deletePost} />
        if (post.type === "link") return <LinkPostCard key={post._id} post={post} deletePost={deletePost} />
        if (post.type === "media") return <MediaPostCard key={post._id} post={post} deletePost={deletePost} />
      })}

      <Pagination totalPosts={posts.length} postPerPage={postPerPage} setCurrentPage={setCurrentPage}/>

    </>
  );
}