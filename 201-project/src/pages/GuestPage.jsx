import React, { useState } from "react";

const GuestPage = () => {
	const [tasks, setTasks] = useState([]);
	const [newTaskName, setNewTaskName] = useState("");
	const [newTaskDescription, setNewTaskDescription] = useState("");
	const [taskCreated, setTaskCreated] = useState(false);
	const [isDisabled, setIsDisabled] =useState(false);
	const [completeActionCompleted, setCompleteActionCompleted] = useState(false);
	const [deleteActionCompleted, setDeleteActionCompleted] = useState(false);
		
	const addTask = () => {
		if (!newTaskName.trim()) return;
		const newTask = {
			name: newTaskName,
			description: newTaskDescription,
			completed: false
		};
		setTasks([...tasks, newTask]);
		setNewTaskName("");
		setNewTaskDescription("");
		setTaskCreated(true);
		setIsDisabled(true);
	};
	
	const completeTask = (index) => {
		const updatedTasks = [...tasks];
		updatedTasks[index].completed = true;
		setTasks(updatedTasks);
		if (!completeActionCompleted) setCompleteActionCompleted(true);
	};
	
	const deleteTask = (index) => {
		const updatedTasks = tasks.filter((_, i) => i != index);
		setTasks(updatedTasks);
		if (!deleteActionCompleted) setDeleteActionCompleted(true);
	};
	
	return (
		<div className="dashboard-container">
			<h2 className="dashboard-title">Guest Tutorial</h2>
			
			<div className="dashboard-container" style={{ background: "#fff8" }}>
				<h3>Create New Task</h3>
				<input
					type = "text"
					placeholder="Task Name"
					value={newTaskName}
					onChange={(e) => setNewTaskName(e.target.value)}
				/>
				<br />
				<input
					type="text"
					placeholder="Task Description"
					value={newTaskDescription}
					onChange={(e) => setNewTaskDescription(e.target.value)}
				/>
				<br />
				<div className="add-task-wrapper">
					<button
						className="dashboard-button"
						onClick={addTask}
						disabled={isDisabled}
						style={{ 
							opacity: isDisabled ? 0.5 : 1,
							cursor: isDisabled ? "not-allowed" : "pointer",
						}}
						>Add Task
					</button>
					
					{!taskCreated && (
						<>
							<img src="/arrow.gif" className="tutorial-image" />
							<span className="tutorial-text">Try creating a task!</span>
						</>
					)}
					
					{taskCreated && (
						<>
							<img src="/greenCheck.png" className="complete-image" />
							<span className="complete-text">Task created successfully!</span>
							
							<button
								className="dashboard-button"
								onClick={() => {
									setNewTaskName("");
									setNewTaskDescription("");
									setTaskCreated(false);
									setIsDisabled(false);
									setCompleteActionCompleted(false);
									setDeleteActionCompleted(false);
								}}
							>Reset
							</button>
						</>
					)}
				</div>
			</div>
			
			{tasks.map((task, index) => (
				<div className="card" key={index}>
					<p><strong>{task.name}</strong></p>
					<p>{task.description}</p>
					<p>Status: {task.completed ? "Completed" : "Incomplete"}</p>
					<div className="card-actions">
						{!task.completed && (
							<button className="complete-btn" onClick={() => completeTask(index)}>Complete</button>
						)}
						<button className="delete-btn" onClick={() => deleteTask(index)}>Delete</button>
					</div>
				</div>
			))}
			
			<div className="add-task-wrapper">
				{!completeActionCompleted && (
					<>
						<img src="/emptyBox.png" className="tutorial-image" />
						<span className="tutorial-text">Complete a task!</span>
					</>
				)}
			
				{completeActionCompleted && (
					<>
						<img src="/greenCheck.png" className="complete-image" />
						<span className="complete-text">Task completed successfully!</span>
					</>
				)}
				
				{!deleteActionCompleted && (
					<>
						<img src="/emptyBox.png" className="tutorial-image" />
						<span className="tutorial-text">Delete a task!</span>
					</>
				)}
				
				{deleteActionCompleted && (
					<>
						<img src="/greenCheck.png" className="complete-image" />
						<span className="complete-text">Task deleted successfully!</span>
					</>
				)}
			</div>
		</div>
	);
};

export default GuestPage;