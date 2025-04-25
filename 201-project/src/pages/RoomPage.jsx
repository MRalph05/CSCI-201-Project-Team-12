import React, { useState } from "react";
import RoomDashboard from "../components/RoomDashboard";
import TaskDashboard from "../components/TaskDashboard";

const RoomPage = () => {
  const [rooms] = useState([
    { id: 1, name: "Room A", leader: "alice@example.com" },
    { id: 2, name: "Room B", leader: "bob@example.com" }
  ]);
  const [selectedRoom, setSelectedRoom] = useState(null);

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
