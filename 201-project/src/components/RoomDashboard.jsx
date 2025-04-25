import React from "react";
import "../dashboard.css";

const RoomDashboard = ({ rooms, onSelectRoom }) => {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Room Dashboard</h2>
      {rooms.map((room) => (
        <div className="card" key={room.id}>
          <div>
            <p><strong>{room.name}</strong></p>
            <p>Leader: {room.leader}</p>
          </div>
          <div className="card-actions">
            <button className="dashboard-button" onClick={() => onSelectRoom(room)}>
              View Tasks
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomDashboard;