import { useParams } from "react-router-dom";

export function DeleteReviews() {

    const token = localStorage.getItem("token")

    const handleDelete = async (reviewId) => {
        console.log(reviewId)
        const res = await fetch(`http://localhost:3000/deletereview/${reviewId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return res.ok;

    };
    return handleDelete;
    
}