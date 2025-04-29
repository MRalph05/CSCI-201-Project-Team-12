import React, { useState, useEffect } from "react";
import RoomDashboard from "../components/RoomDashboard";
import { 
    getAllRooms,
    getRoomsByLeader,
    getRoomsByMember,
    createRoom,
    updateRoom,
    deleteRoom
} from "../services/api";

const RoomPage = () => {
    const [rooms, setRooms] = useState([]);
    const [showAddRoom, setShowAddRoom] = useState(false);
    const [roomForm, setRoomForm] = useState({ name: "", leaderEmail: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRooms = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const currentUserEmail = localStorage.getItem("userEmail");
            if (!currentUserEmail) {
                setError("You must be logged in to view rooms");
                setIsLoading(false);
                return;
            }
            
            // Get rooms where the user is leader or member
            const leadRooms = await getRoomsByLeader(currentUserEmail);
            const memberRooms = await getRoomsByMember(currentUserEmail);
            
            // Combine and remove duplicates (in case user is both leader and member)
            const combinedRooms = [...leadRooms];
            
            // Add member rooms that aren't already in the list (avoiding duplicates)
            memberRooms.forEach(memberRoom => {
                if (!combinedRooms.some(room => room.id === memberRoom.id)) {
                    combinedRooms.push(memberRoom);
                }
            });
            
            setRooms(combinedRooms);
            setIsLoading(false);
        } catch (error) {
            console.error("Failed to fetch rooms:", error);
            setError("Failed to load rooms. Please try again later.");
            setIsLoading(false);
        }
    };

    useEffect(() => { 
        fetchRooms(); 
    }, []);

    const handleCreateRoom = async () => {
        if (!roomForm.name) {
            alert("Please enter a room name");
            return;
        }
        
        try {
            setIsLoading(true);
            // Get current user's email from localStorage
            const currentUserEmail = localStorage.getItem("userEmail");
            if (!currentUserEmail) {
                alert("You must be logged in to create a room");
                return;
            }
            
            // Use the provided leader email if available, otherwise use current user
            const leaderEmail = roomForm.leaderEmail.trim() || currentUserEmail;
            
            // Create the room with the specified leader
            await createRoom({
                name: roomForm.name,
                leaderEmail: leaderEmail
            });
            
            await fetchRooms();
            setRoomForm({ name: "", leaderEmail: "" });
            setShowAddRoom(false);
            setIsLoading(false);
        } catch (error) {
            console.error("Failed to create room:", error);
            alert("Failed to create room. Please try again.");
            setIsLoading(false);
        }
    };

    const handleUpdateRoom = async (room) => {
        const updatedName = prompt("Edit room name:", room.name);
        if (!updatedName) return;
        
        try {
            setIsLoading(true);
            await updateRoom(room.id, { ...room, name: updatedName });
            await fetchRooms();
            setIsLoading(false);
        } catch (error) {
            console.error("Failed to update room:", error);
            alert("Failed to update room. Please try again.");
            setIsLoading(false);
        }
    };

    const handleDeleteRoom = async (roomId) => {
        if (!window.confirm("Are you sure you want to delete this room?")) {
            return;
        }
        
        try {
            setIsLoading(true);
            await deleteRoom(roomId);
            await fetchRooms();
            setIsLoading(false);
        } catch (error) {
            console.error("Failed to delete room:", error);
            alert("Failed to delete room. Please try again.");
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
            <h2 className="dashboard-title">Room Dashboard</h2>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                <button className="dashboard-button" onClick={() => setShowAddRoom(!showAddRoom)}>+ Add Room</button>
            </div>

            {showAddRoom && (
                <div>
                    <input
                        type="text"
                        placeholder="Room Name"
                        value={roomForm.name}
                        onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                    /><br />
                    <input
                        type="text"
                        placeholder="Leader Email (optional - defaults to you)"
                        value={roomForm.leaderEmail}
                        onChange={(e) => setRoomForm({ ...roomForm, leaderEmail: e.target.value })}
                    /><br />
                    <button onClick={handleCreateRoom}>Create</button>
                    <button onClick={() => setShowAddRoom(false)}>Cancel</button>
                </div>
            )}

            <RoomDashboard
                rooms={rooms}
                updateRoom={handleUpdateRoom}
                deleteRoom={handleDeleteRoom}
            />
        </div>
    );
};

export default RoomPage;
