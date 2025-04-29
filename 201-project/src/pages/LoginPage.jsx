import React, { useState } from "react";
import { loginUser } from "../services/api";
import "../dashboard.css";

const LoginPage = ({ setIsLoggedIn }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }
        
        try {
            setIsLoading(true);
            setError(null);
            const user = await loginUser(email, password);
            
            // Store user email in localStorage
            localStorage.setItem("userEmail", user.email);
            
            // Update auth state
            setIsLoggedIn(true);
            
            setIsLoading(false);
        } catch (error) {
            console.error("Login failed:", error);
            setError("Invalid email or password. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Login</h2>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleLogin} className="auth-form">
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        disabled={isLoading}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        disabled={isLoading}
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="dashboard-button"
                    disabled={isLoading}
                >
                    {isLoading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default LoginPage; 