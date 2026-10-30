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
    backgroundColor: "#8b5cf6",
    color: "#f5f5f5",
    padding: "10px 20px",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  }

  const buttonstyle = {
    padding: "10px 20px",
    backgroundColor: "#1f1f1f",
    color: "#f5f5f5",
    border: "1px solid #2a2a2a",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  }


  return (
    <>
    {/* cover and background section */}
      <div
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
          width: "90%",
          height: "400px",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          display: "flex",
          justifyContent: "start",
          alignItems: "end",
          margin: "0 auto",
          borderRadius: "10px",
          marginTop:"110px"
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
                borderRadius: "8px",
                 width: "120px",height:"120px", 
                 objectFit:"cover",
                 border:"1px solid #2a2a2a",
                 backgroundColor:"#151515"
                }}
          /> 
        )}
        <p style={{ fontSize: "32px", color: "#f5f5f5",backgroundColor: "rgba(10,10,10,0.7)", padding: "10px 16px", borderRadius: "8px" }}>{game.name}</p>
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