import { useState } from 'react';
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';

export function MediaPost() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('media', file);
        formData.append('title', title || 'Media post');

        await fetch(`http://localhost:3000/game/${id}/addmediapost`, {
            method: "POST",
            credentials: "include",
            body: formData
        });
        navigate(`/game/${id}/forum`);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#0b1020', padding: '40px 20px' }}>
            <div style={{ maxWidth: '780px', margin: '0 auto', background: '#101728', borderRadius: '16px', border: '1px solid #1e2738', overflow: 'hidden' }}>
                <div style={{ padding: '24px 28px', borderBottom: '1px solid #1e2738' }}>
                    <h2 style={{ margin: 0, color: '#f5f7fa', fontSize: '24px' }}>Create Media Post</h2>
                    <p style={{ margin: '6px 0 0', color: '#8a94a6' }}>Share a screenshot or clip with the community.</p>
                </div>

                <form style={{ padding: '28px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        <TextField
                            variant="filled"
                            label="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            InputProps={{ style: { color: '#f5f7fa', background: '#11182b' } }}
                            InputLabelProps={{ style: { color: '#8a94a6' } }}
                            style={{ width: '100%', maxWidth: '700px' }}
                        />

                        <label style={{
                            width: '100%',
                            maxWidth: '700px',
                            minHeight: '220px',
                            border: '1px dashed #2f3a4f',
                            borderRadius: '12px',
                            background: '#0f1628',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            padding: '20px',
                            color: '#8a94a6',
                            textAlign: 'center'
                        }}>
                            <input type="file" accept="image/*,video/*" onChange={handleFileChange} style={{ display: 'none' }} />
                            <div style={{ fontSize: '15px', fontWeight: 600, color: '#f5f7fa' }}>Choose a file to upload</div>
                            <div style={{ fontSize: '13px' }}>PNG, JPG, GIF, MP4 and more supported</div>
                            {preview && (
                                <div style={{ marginTop: '8px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                                    {preview.includes('video') || preview.endsWith('.mp4') ? (
                                        <video src={preview} controls style={{ maxWidth: '100%', maxHeight: '220px', borderRadius: '12px' }} />
                                    ) : (
                                        <img src={preview} alt="preview" style={{ maxWidth: '100%', maxHeight: '220px', borderRadius: '12px', objectFit: 'cover' }} />
                                    )}
                                </div>
                            )}
                        </label>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            style={{
                                background: '#00a8cc',
                                border: 'none',
                                borderRadius: '999px',
                                padding: '12px 20px',
                                color: 'white',
                                fontSize: '16px',
                                cursor: 'pointer',
                                fontWeight: 700,
                                boxShadow: 'none',
                                width: 'fit-content'
                            }}
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}