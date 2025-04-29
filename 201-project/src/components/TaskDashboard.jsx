import React, { useState, useEffect } from "react";
import "../dashboard.css";
import {
    getTasksByRoomId,
    getTaskAssignees,
    assignUserToTask,
    removeUserFromTask,
    createTask,
    updateTask,
    deleteTask
} from "../services/api";

const TaskDashboard = ({ room, goBack }) => {
    const [tasks, setTasks] = useState([]);
    const [assignees, setAssignees] = useState({});
    const [showForm, setShowForm] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "" });
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newTask, setNewTask] = useState({ name: "", description: "" });
    const [editingTask, setEditingTask] = useState(null);
    const [editTaskForm, setEditTaskForm] = useState({ name: "", description: "" });
    const [isLoading, setIsLoading] = useState(false);

    // Fetch tasks when the room changes
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setIsLoading(true);
                const tasksData = await getTasksByRoomId(room.id);
                setTasks(tasksData);
                
                // Fetch assignees for each task
                const assigneesMap = {};
                for (const task of tasksData) {
                    const assigneeData = await getTaskAssignees(task.id);
                    assigneesMap[task.id] = assigneeData;
                }
                setAssignees(assigneesMap);
                
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching tasks:", error);
                setIsLoading(false);
            }
        };
        
        fetchTasks();
    }, [room.id]);

    const handleAssign = async (taskId) => {
        try {
            await assignUserToTask(taskId, formData.email);
            
            // Update the assignees list
            const updatedAssignees = await getTaskAssignees(taskId);
            setAssignees({
                ...assignees,
                [taskId]: updatedAssignees
            });
            
            setFormData({ name: "", email: "" });
            setShowForm(null);
        } catch (error) {
            console.error("Error assigning task:", error);
            alert("Failed to assign user to task.");
        }
    };

    const handleRemoveAssigned = async (taskId, userEmail) => {
        try {
            await removeUserFromTask(taskId, userEmail);
            
            // Update the assignees list
            const updatedAssignees = await getTaskAssignees(taskId);
            setAssignees({
                ...assignees,
                [taskId]: updatedAssignees
            });
        } catch (error) {
            console.error("Error removing assignment:", error);
            alert("Failed to remove user from task.");
        }
    };

    const handleCreateTask = async () => {
        if (!newTask.name || !newTask.description) return;
        
        try {
            const currentUserEmail = localStorage.getItem("userEmail");
            if (!currentUserEmail) {
                alert("You must be logged in to create a task");
                return;
            }
            
            const taskData = {
                roomId: room.id,
                name: newTask.name,
                description: newTask.description,
                creatorEmail: currentUserEmail,
                completed: false
            };
            
            await createTask(taskData);
            
            // Refresh tasks
            const tasksData = await getTasksByRoomId(room.id);
            setTasks(tasksData);
            
            setNewTask({ name: "", description: "" });
            setShowCreateForm(false);
        } catch (error) {
            console.error("Error creating task:", error);
            alert("Failed to create task.");
        }
    };

    const handleComplete = async (taskId) => {
        try {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                await updateTask(taskId, { ...task, completed: true });
                
                // Refresh tasks
                const tasksData = await getTasksByRoomId(room.id);
                setTasks(tasksData);
            }
        } catch (error) {
            console.error("Error completing task:", error);
            alert("Failed to complete task.");
        }
    };
    
    const handleDelete = async (taskId) => {
        try {
            await deleteTask(taskId);
            
            // Refresh tasks
            const tasksData = await getTasksByRoomId(room.id);
            setTasks(tasksData);
        } catch (error) {
            console.error("Error deleting task:", error);
            alert("Failed to delete task.");
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task.id);
        setEditTaskForm({ name: task.name, description: task.description });
    };

    const saveTaskEdits = async (taskId) => {
        try {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                await updateTask(taskId, { 
                    ...task, 
                    name: editTaskForm.name, 
                    description: editTaskForm.description 
                });
                
                // Refresh tasks
                const tasksData = await getTasksByRoomId(room.id);
                setTasks(tasksData);
            }
            
            setEditingTask(null);
            setEditTaskForm({ name: "", description: "" });
        } catch (error) {
            console.error("Error updating task:", error);
            alert("Failed to update task.");
        }
    };

    if (isLoading) {
        return <div className="dashboard-container">Loading tasks...</div>;
    }

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
                                        {(assignees[task.id] || []).map((email, idx) => (
                                            <li key={idx}>
                                                {email}
                                                <button onClick={() => handleRemoveAssigned(task.id, email)}>❌</button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="card-actions">
                        <button className="complete-btn" onClick={() => handleComplete(task.id)}>Complete</button>
                        <button className="delete-btn" onClick={() => handleDelete(task.id)}>Delete</button>
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