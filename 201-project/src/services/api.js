// API service to handle REST API calls
const API_BASE_URL = 'http://localhost:8080/api';

// Auth APIs
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login?email=${email}&password=${password}`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Invalid credentials');
  }
  return response.json();
};

export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  return response.json();
};

// Room APIs
export const getAllRooms = async () => {
  const response = await fetch(`${API_BASE_URL}/rooms`);
  if (!response.ok) {
    throw new Error('Failed to fetch rooms');
  }
  return response.json();
};

export const getRoomsByLeader = async (email) => {
  const response = await fetch(`${API_BASE_URL}/rooms/leader/${email}`);
  if (!response.ok) {
    throw new Error('Failed to fetch rooms led by user');
  }
  return response.json();
};

export const getRoomsByMember = async (email) => {
  const response = await fetch(`${API_BASE_URL}/rooms/member/${email}`);
  if (!response.ok) {
    throw new Error('Failed to fetch rooms user is member of');
  }
  return response.json();
};

export const getRoomById = async (roomId) => {
  const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch room');
  }
  return response.json();
};

export const createRoom = async (roomData) => {
  const response = await fetch(`${API_BASE_URL}/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(roomData),
  });
  if (!response.ok) {
    throw new Error('Failed to create room');
  }
  return response.json();
};

export const updateRoom = async (roomId, roomData) => {
  const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(roomData),
  });
  if (!response.ok) {
    throw new Error('Failed to update room');
  }
  return response.json();
};

export const deleteRoom = async (roomId) => {
  const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete room');
  }
  
  // Handle empty or non-JSON responses
  if (response.status === 204) {
    return null; // No content response
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    return null; // Not JSON, return null
  }
};

export const getRoomMembers = async (roomId) => {
  const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/members`);
  if (!response.ok) {
    throw new Error('Failed to fetch room members');
  }
  return response.json();
};

export const addRoomMember = async (roomId, userEmail) => {
  const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/members?userEmail=${userEmail}`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to add member to room');
  }
  return response.json();
};

export const removeRoomMember = async (roomId, userEmail) => {
  const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/members?userEmail=${userEmail}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to remove member from room');
  }
  return response.json();
};

// Task APIs
export const getTasksByRoomId = async (roomId) => {
  const response = await fetch(`${API_BASE_URL}/tasks/room/${roomId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return response.json();
};

export const createTask = async (taskData) => {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    throw new Error('Failed to create task');
  }
  return response.json();
};

export const updateTask = async (taskId, taskData) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    throw new Error('Failed to update task');
  }
  return response.json();
};

export const deleteTask = async (taskId) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
  
  // Handle empty or non-JSON responses
  if (response.status === 204) {
    return null; // No content response
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    return null; // Not JSON, return null
  }
};

export const getTaskAssignees = async (taskId) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/assignees`);
  if (!response.ok) {
    throw new Error('Failed to fetch task assignees');
  }
  return response.json();
};

export const assignUserToTask = async (taskId, userEmail) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/assignees?userEmail=${userEmail}`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to assign user to task');
  }
  return response.json();
};

export const removeUserFromTask = async (taskId, userEmail) => {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/assignees?userEmail=${userEmail}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to remove user from task');
  }
  return response.json();
}; 