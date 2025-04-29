import React from "react";
import { useNavigate } from "react-router-dom";
import "../dashboard.css";

const RoomDashboard = ({ rooms, updateRoom, deleteRoom }) => {
  const navigate = useNavigate();
  
  const viewTasks = (roomId) => {
    navigate(`/tasks/${roomId}`);
  };
  
  return (
    <div className="dashboard-container">
      {rooms.map((room) => (
        <div className="card" key={room.id}>
          <div>
            <p><strong>{room.name}</strong></p>
            <p>Leader: {room.leaderEmail}</p>
          </div>
          <div className="card-actions">
            <button
              className="complete-btn"
              onClick={() => viewTasks(room.id)}
            >
              View Tasks
            </button>
            <button
              className="assign-btn"
              onClick={() => updateRoom(room)}
            >
              Edit
            </button>
            <button
              className="edit-btn"
              onClick={() => deleteRoom(room.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomDashboard;
