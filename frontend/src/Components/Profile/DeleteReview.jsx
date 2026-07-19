import { useParams } from "react-router-dom";

export function DeleteReviews() {

    const handleDelete = async (reviewId) => {
        console.log(reviewId)
        const res = await fetch(`http://localhost:3000/deletereview/${reviewId}`, {
            method: "DELETE",
            credentials: "include"
        });

        return res.ok;

    };
    return handleDelete;
    
}