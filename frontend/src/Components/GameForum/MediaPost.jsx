import { useState } from 'react';
import React from 'react';
import { useParams , useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';

export function MediaPost() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    }

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('media', file);
        formData.append('title', 'your title here');

        await fetch(`http://localhost:3000/game/${id}/addmediapost`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: formData
        })
        navigate(`/game/${id}/forum`);
    }

    return (
        <div>
            <input 
                type="file" 
                accept="image/*,video/*"
                onChange={handleFileChange}
            />
            {preview && <img src={preview} style={{ width: "200px" }} />}
            <button onClick={handleSubmit}>Submit</button>
        </div>
    )
}