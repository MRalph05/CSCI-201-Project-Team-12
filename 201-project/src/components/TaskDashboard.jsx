import React, { useState } from "react";
import "../dashboard.css";

const TaskDashboard = ({ room }) => {
  const [tasks, setTasks] = useState([
    { id: 1, name: "Take out trash", description: "Bins by 9PM", assigned: [] },
    { id: 2, name: "Vacuum", description: "Living room & hall", assigned: [] }
  ]);

  const [showForm, setShowForm] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });

  const handleAssign = (taskId) => {
    const updated = tasks.map(task =>
      task.id === taskId
        ? { ...task, assigned: [...(task.assigned || []), formData] }
        : task
    );
    setTasks(updated);
    setFormData({ name: "", email: "" });
    setShowForm(null);
  };

  const handleComplete = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Tasks for {room.name}</h2>
      {tasks.map((task) => (
        <div className="card" key={task.id}>
          <div>
            <p><strong>{task.name}</strong></p>
            <p>{task.description}</p>
            <div>
              <strong>Assigned:</strong>
              <ul>
                {(task.assigned || []).map((person, idx) => (
                  <li key={idx}>{person.name} ({person.email})</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="card-actions">
            <button className="complete-btn" onClick={() => handleComplete(task.id)}>Complete</button>
            <button className="dashboard-button" onClick={() => setShowForm(task.id)}>Assign</button>
          </div>
        </div>
      ))}

      {showForm && (
        <div className="dashboard-container" style={{ background: "#fff8" }}>
          <h3>Assign Roommate to Task</h3>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <br />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <br />
          <button className="dashboard-button" onClick={() => handleAssign(showForm)}>Submit</button>
          <button className="delete-btn" onClick={() => setShowForm(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default TaskDashboard;
