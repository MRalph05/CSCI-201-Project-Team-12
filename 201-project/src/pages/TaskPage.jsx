import React from "react";
import TaskDashboard from "../components/TaskDashboard";

const TaskPage = () => {
  const dummyRoom = { id: 999, name: "Dummy Room" };
  return <TaskDashboard room={dummyRoom} />;
};

export default TaskPage;
