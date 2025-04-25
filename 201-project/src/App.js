import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import RoomPage from "./pages/RoomPage";
import TaskPage from "./pages/TaskPage";
import "./dashboard.css";

function App() {
  return (
    <Router>
      <nav className="navbar">
        <NavLink to="/rooms" className={({ isActive }) => isActive ? "active" : ""}>Rooms</NavLink>
        <NavLink to="/tasks" className={({ isActive }) => isActive ? "active" : ""}>Tasks</NavLink>
      </nav>
      <Routes>
        <Route path="/rooms" element={<RoomPage />} />
        <Route path="/tasks" element={<TaskPage />} />
      </Routes>
    </Router>
  );
}

export default App;
