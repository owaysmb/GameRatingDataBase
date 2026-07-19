import { useParams } from "react-router-dom";

export function DeleteComments() {
    
    const { id } = useParams();

    const handleDelete = async (commentID) => {
        const res = await fetch(`http://localhost:3000/game/${id}/deletecomment/${commentID}`, {
            method: "DELETE",
            credentials: "include"
        });

        if (res.ok) window.location.reload();

    };
    return handleDelete;
    
}