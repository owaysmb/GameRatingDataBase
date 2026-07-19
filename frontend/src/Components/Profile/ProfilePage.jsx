import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { ProfileCover } from "./ProfileCover";
import {ProfileStats} from "./ProfileStats"
import { ProfileReviews } from "./ProfileReviews";
import {ProfileFavorite} from "../Profile/ProfileFavorite"
import {ProfileForums} from "../Profile/ProfileForums"
export function ProfilePage() {
    const { user: currentUser } = useContext(AuthContext);
    const { username } = useParams();
    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`http://localhost:3000/profile/${username}`, {
                    credentials: "include"
                });
                if (res.ok) {
                    const data = await res.json();
                    setProfileUser(data);
                }
            } catch (err) {
                console.error("Failed to load profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [username]);

    if (loading) return <p style={{color:"white",padding:"80px"}}>Loading...</p>;
    if (!profileUser) return <p style={{color:"white",padding:"80px"}}>User not found.</p>;

    const isOwnProfile = currentUser?._id === profileUser?._id;

    return (
        <div style={{padding:"80px",color:"white"}}>
            <ProfileCover profileUser={profileUser} isOwnProfile={isOwnProfile} />
            <hr />
            <ProfileStats profileUser={profileUser} isOwnProfile={isOwnProfile}/>
            <br />
            <ProfileFavorite profileUser={profileUser} isOwnProfile={isOwnProfile}/>
            <br />
            <ProfileReviews profileUser={profileUser} isOwnProfile={isOwnProfile}/>
            <br />
            <ProfileForums profileUser={profileUser} isOwnProfile={isOwnProfile}/>

        </div>
    )
}
