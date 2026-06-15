import { useParams } from "react-router-dom";

export function DeletePosts() {
    
    const user = JSON.parse(localStorage.getItem("user"))
    const { id } = useParams();
    const token = localStorage.getItem("token")

    const handleDelete = async (postID) => {
        const res = await fetch(`http://localhost:3000/game/${id}/deletepost/${postID}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (res.ok) window.location.reload();

    };
    return handleDelete;
    
}