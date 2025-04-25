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

const TaskDashboard = ({ room, goBack }) => {
    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "" });
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newTask, setNewTask] = useState({ name: "", description: "" });
    const [editingTask, setEditingTask] = useState(null);
    const [editTaskForm, setEditTaskForm] = useState({ name: "", description: "" });

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
        const assigned = task.assigned || [];

        const alreadyAssigned = assigned.some(p =>
            typeof p === 'string' ? p === formData.name : p.email === formData.email
        );
        if (alreadyAssigned) return alert("This person is already assigned to the task.");

        const updatedAssigned = [...assigned, formData];
        await updateDoc(taskRef, { assigned: updatedAssigned });
        setFormData({ name: "", email: "" });
        setShowForm(null);
    };

    const handleRemoveAssigned = async (taskId, index) => {
        const taskRef = doc(db, "rooms", room.id, "tasks", taskId);
        const task = tasks.find(t => t.id === taskId);
        const updatedAssigned = [...(task.assigned || [])];
        updatedAssigned.splice(index, 1);
        await updateDoc(taskRef, { assigned: updatedAssigned });
    };

    const handleCreateTask = async () => {
        if (!newTask.name || !newTask.description) return;
        await addDoc(roomTaskCollection, { ...newTask, assigned: [] });
        setNewTask({ name: "", description: "" });
        setShowCreateForm(false);
    };

    const handleComplete = async (taskId) => {
        await deleteDoc(doc(db, "rooms", room.id, "tasks", taskId));
    };

    const handleEditTask = (task) => {
        setEditingTask(task.id);
        setEditTaskForm({ name: task.name, description: task.description });
    };

    const saveTaskEdits = async (taskId) => {
        const taskRef = doc(db, "rooms", room.id, "tasks", taskId);
        await updateDoc(taskRef, { ...editTaskForm });
        setEditingTask(null);
        setEditTaskForm({ name: "", description: "" });
    };

    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Tasks for {room.name}</h2>
            <button className="dashboard-button" onClick={goBack}>← Back to Rooms</button>
            <button className="dashboard-button" onClick={() => setShowCreateForm(!showCreateForm)}>+ Create Task</button>

            {showCreateForm && (
                <div className="dashboard-container" style={{ background: "#fff8" }}>
                    <h3>Create New Task</h3>
                    <input
                        type="text"
                        placeholder="Task Name"
                        value={newTask.name}
                        onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                    />
                    <br />
                    <input
                        type="text"
                        placeholder="Description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                    <br />
                    <button className="dashboard-button" onClick={handleCreateTask}>Submit</button>
                    <button className="delete-btn" onClick={() => setShowCreateForm(false)}>Cancel</button>
                </div>
            )}

            {tasks.map((task) => (
                <div className="card" key={task.id}>
                    <div>
                        {editingTask === task.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editTaskForm.name}
                                    onChange={(e) => setEditTaskForm({ ...editTaskForm, name: e.target.value })}
                                />
                                <input
                                    type="text"
                                    value={editTaskForm.description}
                                    onChange={(e) => setEditTaskForm({ ...editTaskForm, description: e.target.value })}
                                />
                                <button onClick={() => saveTaskEdits(task.id)}>Save</button>
                                <button onClick={() => setEditingTask(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <p><strong>{task.name}</strong></p>
                                <p>{task.description}</p>
                                <div>
                                    <strong>Assigned:</strong>
                                    <ul>
                                        {(task.assigned || []).map((person, idx) => (
                                            <li key={idx}>
                                                {typeof person === 'string' ? person : `${person.name} (${person.email})`}
                                                <button onClick={() => handleRemoveAssigned(task.id, idx)}>❌</button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="card-actions">
                        <button className="complete-btn" onClick={() => handleComplete(task.id)}>Complete</button>
                        <button className="assign-btn" onClick={() => setShowForm(task.id)}>Assign</button>
                        {editingTask !== task.id && (
                            <button className="edit-btn" onClick={() => handleEditTask(task)}>Edit</button>
                        )}
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