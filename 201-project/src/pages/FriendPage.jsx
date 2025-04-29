import React, { useState, useEffect } from "react";
import { getFriends, addFriend, removeFriend } from "../services/api";
import "../dashboard.css";

const FriendPage = () => {
    const [friends, setFriends] = useState([]);
    const [newFriendEmail, setNewFriendEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        // Get the current user's email from localStorage
        const email = localStorage.getItem("userEmail");
        if (email) {
            setUserEmail(email);
            fetchFriends(email);
        } else {
            setError("Please log in to manage friends");
        }
    }, []);

    const fetchFriends = async (email) => {
        try {
            setIsLoading(true);
            setError(null);
            const friendsData = await getFriends(email);
            setFriends(friendsData);
            setIsLoading(false);
        } catch (error) {
            console.error("Failed to fetch friends:", error);
            setError("Failed to load friends. Please try again later.");
            setIsLoading(false);
        }
    };

    const handleAddFriend = async () => {
        if (!newFriendEmail || !userEmail) {
            alert("Please enter a valid email address");
            return;
        }

        try {
            setIsLoading(true);
            await addFriend(userEmail, newFriendEmail);
            await fetchFriends(userEmail);
            setNewFriendEmail("");
            setIsLoading(false);
        } catch (error) {
            console.error("Failed to add friend:", error);
            alert("Failed to add friend. Please try again.");
            setIsLoading(false);
        }
    };

    const handleRemoveFriend = async (friendEmail) => {
        if (!window.confirm(`Are you sure you want to remove ${friendEmail} from your friends?`)) {
            return;
        }

        try {
            setIsLoading(true);
            await removeFriend(userEmail, friendEmail);
            await fetchFriends(userEmail);
            setIsLoading(false);
        } catch (error) {
            console.error("Failed to remove friend:", error);
            alert("Failed to remove friend. Please try again.");
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="dashboard-container">Loading...</div>;
    }

    if (error) {
        return <div className="dashboard-container">Error: {error}</div>;
    }

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Friends</h2>
            
            <div className="card">
                <h3>Add New Friend</h3>
                <input
                    type="email"
                    placeholder="Friend's Email"
                    value={newFriendEmail}
                    onChange={(e) => setNewFriendEmail(e.target.value)}
                />
                <button className="dashboard-button" onClick={handleAddFriend}>Add Friend</button>
            </div>
            
            <h3>Your Friends</h3>
            {friends.length === 0 ? (
                <p>You don't have any friends yet. Add some friends to get started!</p>
            ) : (
                friends.map((friendEmail, index) => (
                    <div className="card" key={index}>
                        <div>
                            <p>{friendEmail}</p>
                        </div>
                        <div className="card-actions">
                            <button 
                                className="delete-btn" 
                                onClick={() => handleRemoveFriend(friendEmail)}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default FriendPage; 