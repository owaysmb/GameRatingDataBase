import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function UsersPage() {
    const [query, setQuery] = useState("")
    const [users, setUsers] = useState([])
    const [searched, setSearched] = useState(false)
    const navigate = useNavigate()

    const handleSearch = async (e) => {
        e.preventDefault()
        if (!query.trim()) return
        try {
            const res = await fetch(`http://localhost:3000/users/search?q=${encodeURIComponent(query)}`)
            const data = await res.json()
            setUsers(data)
            setSearched(true)
        } catch (err) {
            console.log("Failed to search users")
        }
    }

    const inputStyle = {
        width: "400px",
        borderRadius: "40px",
        color: "black",
        height: "30px",
        border: "none",
        outline: "none",
        backgroundColor: "#53d8fb",
        font: "bold",
        padding: "0 15px",
    }

    const userRowStyle = {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        padding: "12px 20px",
        borderBottom: "1px solid #333",
        cursor: "pointer",
        transition: "background 0.2s",
    }

    return (
        <div style={{ color: "#f5f5f5", padding: "40px 80px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1 style={{ marginBottom: "24px", fontSize: "42px", fontWeight: "700" }}>Users</h1>

            <form onSubmit={handleSearch} style={{ marginBottom: "24px" }}>
                <input
                    type="text"
                    placeholder="Search users..."
                    style={{ width: "400px", borderRadius: "8px", color: "#f5f5f5", height: "40px", border: "1px solid #2a2a2a", outline: "none", backgroundColor: "#1f1f1f", padding: "0 12px" }}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </form>

            <div style={{ width: "100%", maxWidth: "700px" }}>
                {searched && users.length === 0 && (
                    <p style={{ textAlign: "center", color: "#8a8a8a" }}>No users found</p>
                )}
                {users.map((u) => (
                    <div
                        key={u._id}
                        style={{ display: "flex", alignItems: "center", gap: "15px", padding: "12px 16px", borderBottom: "1px solid #1f1f1f", cursor: "pointer" }}
                        onClick={() => navigate(`/${u.username}/profile`)}
                    >
                        {u.profilePicture ? (
                            <img src={u.profilePicture} alt={u.username} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
                        ) : (
                            <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "#2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "bold", color: "#f5f5f5" }}>
                                {u.username[0].toUpperCase()}
                            </div>
                        )}
                        <div>
                            <div style={{ fontWeight: 500 }}>{u.username}</div>
                            {u.bio && <div style={{ fontSize: "14px", color: "#8a8a8a" }}>{u.bio}</div>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
