import React, { useState, useEffect } from "react";
import TaskDashboard from "../components/TaskDashboard";
import RoomDashboard from "../components/RoomDashboard";

import { db } from "../firebase";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from "firebase/firestore";

const RoomPage = () => {
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showAddRoom, setShowAddRoom] = useState(false);
    const [roomForm, setRoomForm] = useState({ name: "", leader: "" });

    const roomCollection = collection(db, "rooms");

    const fetchRooms = async () => {
        const querySnapshot = await getDocs(roomCollection);
        const roomData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRooms(roomData);
    };

    useEffect(() => { fetchRooms(); }, []);

    const createRoom = async () => {
        if (!roomForm.name || !roomForm.leader) return;
        await addDoc(roomCollection, roomForm);
        setRoomForm({ name: "", leader: "" });
        setShowAddRoom(false);
        fetchRooms();
    };

    const updateRoom = async (room) => {
        const updatedName = prompt("Edit room name:", room.name);
        if (!updatedName) return;
        const roomRef = doc(db, "rooms", room.id);
        await updateDoc(roomRef, { name: updatedName });
        fetchRooms();
    };

    const deleteRoom = async (roomId) => {
        await deleteDoc(doc(db, "rooms", roomId));
        setSelectedRoom(null);
        fetchRooms();
    };

    return (
        <>
            {!selectedRoom ? (
                <div className="dashboard-container">
                    <h2 className="dashboard-title">Room Dashboard</h2>
                    <button className="dashboard-button" onClick={() => setShowAddRoom(!showAddRoom)}>+ Add Room</button>

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
                                placeholder="Leader Email"
                                value={roomForm.leader}
                                onChange={(e) => setRoomForm({ ...roomForm, leader: e.target.value })}
                            /><br />
                            <button onClick={createRoom}>Create</button>
                            <button onClick={() => setShowAddRoom(false)}>Cancel</button>
                        </div>
                    )}

                    <RoomDashboard
                        rooms={rooms}
                        onSelectRoom={setSelectedRoom}
                        updateRoom={updateRoom}
                        deleteRoom={deleteRoom}
                    />

                </div>
            ) : (
                <TaskDashboard room={selectedRoom} goBack={() => setSelectedRoom(null)} />
            )}
        </>
    );
};

export default RoomPage;
