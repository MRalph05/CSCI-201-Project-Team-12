import React, { useState, useEffect } from "react";
import RoomDashboard from "../components/RoomDashboard";
import TaskDashboard from "../components/TaskDashboard";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const RoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      const querySnapshot = await getDocs(collection(db, "rooms"));
      const roomData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRooms(roomData);
    };
    fetchRooms();
  }, []);

  return (
    <>
      {!selectedRoom ? (
        <RoomDashboard rooms={rooms} onSelectRoom={setSelectedRoom} />
      ) : (
        <TaskDashboard room={selectedRoom} />
      )}
    </>
  );
};

export default RoomPage;