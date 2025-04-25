import React from "react";
import TaskDashboard from "../components/TaskDashboard";

const TaskPage = () => {
  const dummyRoom = { id: "test-room", name: "Dummy Room" };
  return <TaskDashboard room={dummyRoom} />;
};

export default TaskPage;