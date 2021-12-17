import { useState } from "react";
import { useHistory } from "react-router-dom";

export const SignUpPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const history = useHistory();

    const handleSignUpAttempt = async () => {
        history.push("/");
    }

    return (
        <div class="content-container">
            <h1>Sign Up</h1>
            { error && <div className="fail">{error}</div>}
            <input
                type="email"
                placeholder="email"
                value={email}
                onChange={e => setEmail(e)}
            />
            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={e => setPassword(e)}
            />
            <input
                type="password"
                placeholder="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e)}
            />
            <button onClick={handleSignUpAttempt}>Sign Up</button>
            <button onClick={e => history.push("/login")}>Already have an account? Login</button>
        </div>
    )
}