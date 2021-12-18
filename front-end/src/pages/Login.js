import { useState } from "react";
import { useHistory } from "react-router-dom";

export const LogInPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const history = useHistory();

    const handleLoginAttempt = async () => {
        history.push("/");
    }

    return (
        <div className="content-container">
            <h1>Login</h1>
            { error && <div className="fail">{error}</div>}
            <input
                type="email"
                placeholder="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <button onClick={handleLoginAttempt}>Login</button>
            <button onClick={e => history.push("/forgot-password")}>Forgot Password?</button>
            <button onClick={e => history.push("/signup")}>Sign Up</button>
        </div>
    )
}