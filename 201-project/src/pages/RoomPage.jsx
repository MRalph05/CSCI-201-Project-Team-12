import React, { useState, useEffect } from "react";
import RoomDashboard from "../components/RoomDashboard";
import InvitationList from "../components/InvitationList";
import RoomDetails from "../components/RoomDetails";
import { 
    getAllRooms,
    getRoomsByLeader,
    getRoomsByMember,
    createRoom,
    updateRoom,
    deleteRoom
} from "../services/api";
import { 
    Container,
    Grid,
    Typography,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    Alert
} from '@mui/material';

const RoomPage = () => {
    const [rooms, setRooms] = useState([]);
    const [showAddRoom, setShowAddRoom] = useState(false);
    const [roomForm, setRoomForm] = useState({ name: "", leaderEmail: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedRoomId, setSelectedRoomId] = useState(null);

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
        if (!window.confirm("Are you sure you want to delete this room? This action cannot be undone.")) {
            return;
        }
        
        try {
            setIsLoading(true);
            await deleteRoom(roomId);
            await fetchRooms();
            if (selectedRoomId === roomId) {
                setSelectedRoomId(null);
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Failed to delete room:", error);
            alert("Failed to delete room. Please try again.");
            setIsLoading(false);
        }
    };

    const handleViewRoom = (roomId) => {
        setSelectedRoomId(roomId);
    };

    const handleCloseRoomDetails = () => {
        setSelectedRoomId(null);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Room Dashboard
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            {/* Invitation List section */}
            <InvitationList onInvitationResponded={fetchRooms} />
            
            <Grid container spacing={3}>
                <Grid item xs={12} md={selectedRoomId ? 6 : 12}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h5">
                            Your Rooms
                        </Typography>
                        <Button 
                            variant="contained" 
                            color="primary"
                            onClick={() => setShowAddRoom(true)}
                        >
                            Create Room
                        </Button>
                    </Box>
                    
                    {isLoading ? (
                        <Box display="flex" justifyContent="center" p={3}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <RoomDashboard
                            rooms={rooms}
                            onEditRoom={handleUpdateRoom}
                            onDeleteRoom={handleDeleteRoom}
                            onViewRoom={handleViewRoom}
                        />
                    )}
                </Grid>
                
                {selectedRoomId && (
                    <Grid item xs={12} md={6}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h5">
                                Room Details
                            </Typography>
                            <Button 
                                variant="outlined"
                                onClick={handleCloseRoomDetails}
                            >
                                Close
                            </Button>
                        </Box>
                        
                        <RoomDetails 
                            roomId={selectedRoomId} 
                            onRoomUpdated={fetchRooms}
                        />
                    </Grid>
                )}
            </Grid>
            
            {/* Create Room Dialog */}
            <Dialog open={showAddRoom} onClose={() => setShowAddRoom(false)}>
                <DialogTitle>Create New Room</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Room Name"
                        type="text"
                        fullWidth
                        value={roomForm.name}
                        onChange={(e) => setRoomForm({...roomForm, name: e.target.value})}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowAddRoom(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreateRoom} color="primary" disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} /> : "Create"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default RoomPage;
