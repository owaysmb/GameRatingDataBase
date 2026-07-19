import { useState, useContext } from "react"
import { login } from "../LoginPage/auth"
import { LoginForm } from "../LoginPage/LoginForm"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../../context/AuthContext"

export function Login() {
    const navigate = useNavigate();
    const [lockUntil, setLockUntil] = useState(null);
    const { login: authLogin } = useContext(AuthContext);

    const isLocked = lockUntil ? new Date(lockUntil) > new Date() : false;
    const getLockMessage = (expiresAt) => {
        if (!expiresAt) return "";
        const diffMs = new Date(expiresAt) - new Date();
        const minutes = Math.max(0, Math.ceil(diffMs / 60000));
        return `Too many attempts. Try again in ${minutes} minutes.`;
    };
    const lockMessage = isLocked ? getLockMessage(lockUntil) : "";

    const handleSubmit = async (data)=>{
        if (isLocked) {
            alert(lockMessage || "Login temporarily locked. Please wait.");
            return;
        }

        const res = await login(data)

        if (res.message === "Login successful") {
            const userData = await authLogin();
            navigate(`/${userData.username}/profile`);
            return;
        }

        if (res.message === "Wrong Fields") {
            alert("Invalid input. Please check your email or password fields.");
            return;
        }

        if (res.message === "Wrong password") {
            alert("Wrong password. Please check your password field.");
            return;
        }

        if (res.message === "Too many attempts, try again later" || res.message === "Account locked") {
            setLockUntil(res.lockUntil);
            const expiresAt = res.lockUntil ? new Date(res.lockUntil) : null;
            const mins = expiresAt ? Math.max(0, Math.ceil((expiresAt - new Date()) / 60000)) : 0;
            alert(`Too many attempts. Try again in ${mins} minutes.`);
            return;
        }

        if (res.message === "User not found") {
            alert("User not found. Please sign up or check your email.");
            return;
        }

        alert("Login failed. Please try again.");
    }

    return (<LoginForm onSubmit={handleSubmit} disabled={isLocked} lockMessage={lockMessage} />)
}
