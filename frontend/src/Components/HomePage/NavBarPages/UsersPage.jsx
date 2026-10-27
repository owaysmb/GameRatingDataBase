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
        <div style={{ color: "white", padding: "100px 40px 40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1 style={{ marginBottom: "30px" }}>Users</h1>

            <form onSubmit={handleSearch} style={{ marginBottom: "30px" }}>
                <input
                    type="text"
                    placeholder="Search users..."
                    style={inputStyle}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </form>

            <div style={{ width: "100%", maxWidth: "700px" }}>
                {searched && users.length === 0 && (
                    <p style={{ textAlign: "center", color: "#888" }}>No users found</p>
                )}
                {users.map((u) => (
                    <div
                        key={u._id}
                        style={userRowStyle}
                        onClick={() => navigate(`/${u.username}/profile`)}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#222"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                        {u.profilePicture ? (
                            <img src={u.profilePicture} alt={u.username} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
                        ) : (
                            <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "#444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "bold" }}>
                                {u.username[0].toUpperCase()}
                            </div>
                        )}
                        <div>
                            <div style={{ fontWeight: 500 }}>{u.username}</div>
                            {u.bio && <div style={{ fontSize: "14px", color: "#888" }}>{u.bio}</div>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
