const API_URL = 'https://backend-server-for-humanaiproject001.onrender.com/api';

// const apiUrl = import.meta.env.VITE_API_URL;

// const API_URL = apiUrl+'/api'

const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include'
  };

  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API_URL}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong');
    error.status = response.status;
    throw error;
  }

  return data;
};

export const ensureUserExists = async (phoneNumber) => {
  try {
    await apiRequest(`/users/${phoneNumber}`);
  } catch (error) {
    if (error.status === 404) {
      await apiRequest('/users', 'POST', { phoneNumber });
    } else {
      throw error;
    }
  }
};

export const createUser = async (phoneNumber) => {
  try {
    return await apiRequest('/users', 'POST', { phoneNumber });
  } catch (error) {
    if (error.status === 400 && error.message.includes('already exists')) {
      return { phoneNumber };
    }
    throw error;
  }
};

export const getUser = async (phoneNumber) => {
  try {
    return await apiRequest(`/users/${phoneNumber}`);
  } catch (error) {
    if (error.status === 404) {
      return await createUser(phoneNumber);
    }
    throw error;
  }
};

export const createBoard = (boardData) => apiRequest('/boards', 'POST', boardData);

// In api.js
export const getBoard = (boardId) => {
    const id = typeof boardId === 'object' ? boardId._id || boardId : boardId;
    if (!id) throw new Error('Board ID is required');
    return apiRequest(`/boards/${id}`);
  };

export const updateBoard = (boardId, updates) => {
  const idString = typeof boardId === 'object' ? boardId._id || boardId : boardId;
  return apiRequest(`/boards/${idString}`, 'PUT', updates);
};

export const deleteBoard = (boardId) => {
  const idString = typeof boardId === 'object' ? boardId._id || boardId : boardId;
  return apiRequest(`/boards/${idString}`, 'DELETE');
};

export const getUserBoards = async (phoneNumber) => {
  try {
    return await apiRequest(`/boards/user/${phoneNumber}`);
  } catch (error) {
    if (error.status === 404) {
      await createUser(phoneNumber);
      return await apiRequest(`/boards/user/${phoneNumber}`);
    }
    throw error;
  }
};

export const addRole = (boardId, roleData) => {
  const idString = typeof boardId === 'object' ? boardId._id || boardId : boardId;
  return apiRequest(`/boards/${idString}/roles`, 'POST', roleData);
};

export const removeRole = (boardId, userPhoneNumber) => {
  const idString = typeof boardId === 'object' ? boardId._id || boardId : boardId;
  return apiRequest(`/boards/${idString}/roles/${userPhoneNumber}`, 'DELETE');
};

export const addTodo = (boardId, todo) => {
  const idString = typeof boardId === 'object' ? boardId._id || boardId : boardId;
  return apiRequest(`/boards/${idString}/todos`, 'POST', todo);
};

export const updateTodo = (boardId, todoId, updates) => {
  const idString = typeof boardId === 'object' ? boardId._id || boardId : boardId;
  return apiRequest(`/boards/${idString}/todos/${todoId}`, 'PUT', updates);
};

export const deleteTodo = (boardId, todoId) => {
  const idString = typeof boardId === 'object' ? boardId._id || boardId : boardId;
  return apiRequest(`/boards/${idString}/todos/${todoId}`, 'DELETE');
};