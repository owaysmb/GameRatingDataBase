import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ProfileCover } from "./ProfileCover";
import {ProfileStats} from "./ProfileStats"
import { ProfileReviews } from "./ProfileReviews";
import {ProfileFavorite} from "../Profile/ProfileFavorite"
import {ProfileForums} from "../Profile/ProfileForums"
export function ProfilePage() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate()
    const handleLogout = () => {
    logout()
    navigate("/login")
}
    return (
        <div style={{padding:"80px",color:"white"}}>
            {/* <h1>Welcome, {user?.username} </h1>
            <p>Email: {user?.email}</p>  
            <button onClick={handleLogout}>Logout</button> */}
            <ProfileCover/>
            <hr />
            <ProfileStats/>
            <br />
            <ProfileFavorite/>
            <br />
            <ProfileReviews/>
            <br />
            <ProfileForums/>
            
        </div>
    )
}