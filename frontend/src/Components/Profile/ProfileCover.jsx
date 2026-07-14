import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../../context/AuthContext";

export function ProfileCover() {
    const { user, updateUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(user?.profilePicture || "");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        setPreview(user?.profilePicture || "");
    }, [user?.profilePicture]);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setUploading(true);
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await fetch('http://localhost:3000/file-upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.json();

            if (response.ok && result.user) {
                updateUser(result.user);
                setPreview(result.user.profilePicture || "");
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    return (
        <div style={{
            width: "100%",
            padding: "32px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, rgba(0,217,255,0.16), rgba(102,0,255,0.18))",
            border: "1px solid rgba(0,217,255,0.25)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.28)"
        }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
                    <div style={{ position: "relative", cursor: "pointer" }} onClick={handleAvatarClick}>
                        <input ref={fileInputRef} type="file" name="image" onChange={handleFileChange} accept="image/*" style={{ display: "none" }} />
                        {preview ? (
                            <img src={preview} alt="profile" style={{ width: "170px", height: "170px", objectFit: "cover", borderRadius: "50%", border: "3px solid #00d9ff" }} />
                        ) : (
                            <div style={{ width: "170px", height: "170px", borderRadius: "50%", background: "linear-gradient(135deg, #00d9ff, #6b5cff)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "56px", fontWeight: 700 }}>
                                {user?.username?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                        )}
                        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "14px", fontWeight: 600 }}></div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        <div>
                            <h1 style={{ margin: 0, fontSize: "34px", color: "#f7fbff" }}>{user?.username || "Player"}</h1>
                            <p style={{ margin: "6px 0 0", color: "#9fb4d6", maxWidth: "520px" }}>{user?.bio || "Add a short bio to tell people more about your taste in games."}</p>
                        </div>

                        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                            <button onClick={() => navigate('/profile/settings')} style={{ background: "linear-gradient(135deg, #00d9ff, #6b5cff)", color: "white", border: "none", padding: "10px 16px", borderRadius: "999px", cursor: "pointer", fontWeight: 700 }}>
                                Settings
                            </button>
                            <button onClick={() => navigate('/profile/edit')} style={{ background: "transparent", color: "#00d9ff", border: "1px solid #00d9ff", padding: "10px 16px", borderRadius: "999px", cursor: "pointer", fontWeight: 700 }}>
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ minWidth: "220px", padding: "18px 20px", borderRadius: "16px", background: "rgba(6,12,30,0.65)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <p style={{ margin: 0, color: "#8cb8ff", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Rank</p>
                    <h3 style={{ margin: "6px 0 0", color: "#f7fbff" }}>Legendary Master</h3>
                    <p style={{ margin: "10px 0 0", color: "#9fb4d6" }}>Last online: just now</p>
                </div>
            </div>
        </div>
    )
}