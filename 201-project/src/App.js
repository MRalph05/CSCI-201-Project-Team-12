import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import RoomPage from "./pages/RoomPage";
import TaskPage from "./pages/TaskPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import GuestPage from "./pages/GuestPage";
import "./dashboard.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by looking at localStorage
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <nav className="navbar">
        {isLoggedIn ? (
          <>
            <NavLink to="/rooms" className={({ isActive }) => isActive ? "active" : ""}>Rooms</NavLink>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={({ isActive }) => isActive ? "active" : ""}>Login</NavLink>
            <NavLink to="/register" className={({ isActive }) => isActive ? "active" : ""}>Register</NavLink>
			<NavLink to="/guest" className={({ isActive }) => isActive ? "active" : ""}>Guest</NavLink>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/rooms" /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/rooms" /> : <RegisterPage setIsLoggedIn={setIsLoggedIn} />} />
		<Route path="/guest" element={<GuestPage />} />
        <Route path="/rooms" element={isLoggedIn ? <RoomPage /> : <Navigate to="/login" />} />
        <Route path="/tasks/:roomId" element={isLoggedIn ? <TaskPage /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={isLoggedIn ? "/rooms" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
