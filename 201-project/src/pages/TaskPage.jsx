import React, { useState, useEffect } from "react";
import TaskDashboard from "../components/TaskDashboard";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomById } from "../services/api";

const TaskPage = () => {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const { roomId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        if (!roomId) {
          navigate("/rooms");
          return;
        }
        
        const roomData = await getRoomById(roomId);
        setRoom(roomData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching room:", error);
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId, navigate]);

  const goBack = () => {
    navigate("/rooms");
  };

  if (loading) {
    return <div className="dashboard-container">Loading room...</div>;
  }

  if (!room) {
    return <div className="dashboard-container">Room not found!</div>;
  }

  return <TaskDashboard room={room} goBack={goBack} />;
};

export default TaskPage;