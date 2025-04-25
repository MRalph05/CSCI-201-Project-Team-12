import React, { useState, useEffect } from "react";
import "../dashboard.css";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot
} from "firebase/firestore";

const TaskDashboard = ({ room }) => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });

  const roomTaskCollection = collection(db, "rooms", room.id, "tasks");

  useEffect(() => {
    const unsubscribe = onSnapshot(roomTaskCollection, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(fetched);
    });
    return () => unsubscribe();
  }, [room.id]);

  const handleAssign = async (taskId) => {
    const taskRef = doc(db, "rooms", room.id, "tasks", taskId);
    const task = tasks.find(t => t.id === taskId);
    const updatedAssigned = [...(task.assigned || []), formData];
    await updateDoc(taskRef, { assigned: updatedAssigned });
    setFormData({ name: "", email: "" });
    setShowForm(null);
  };

  const handleComplete = async (taskId) => {
    await deleteDoc(doc(db, "rooms", room.id, "tasks", taskId));
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
                  <li key={idx}>
                    {typeof person === 'string' ? person : `${person.name} (${person.email})`}
                  </li>
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