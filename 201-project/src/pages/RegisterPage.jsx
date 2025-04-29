import React, { useState } from "react";
import { registerUser } from "../services/api";
import "../dashboard.css";

const RegisterPage = ({ setIsLoggedIn }) => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        // Validate input
        const { firstName, lastName, email, password, confirmPassword } = formData;
        
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }
        
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        
        try {
            setIsLoading(true);
            setError(null);
            
            // Send registration request
            const userData = {
                firstName,
                lastName,
                email,
                password
            };
            
            const user = await registerUser(userData);
            
            // Store user email in localStorage
            localStorage.setItem("userEmail", user.email);
            
            // Update auth state
            setIsLoggedIn(true);
            
            setIsLoading(false);
        } catch (error) {
            console.error("Registration failed:", error);
            setError("Registration failed. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Register</h2>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleRegister} className="auth-form">
                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter your first name"
                        disabled={isLoading}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter your last name"
                        disabled={isLoading}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        disabled={isLoading}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        disabled={isLoading}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        disabled={isLoading}
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="dashboard-button"
                    disabled={isLoading}
                >
                    {isLoading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
};

export default RegisterPage; 