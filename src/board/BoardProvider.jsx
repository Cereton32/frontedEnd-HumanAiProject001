import React, { useState, useEffect, useCallback } from 'react';
import { BoardContext } from './BoardContext';
import * as api from './api';
import { useAuth } from '../auth/AuthContext';

export const BoardProvider = ({ children }) => {
  const { user } = useAuth();
  const [boards, setBoards] = useState([]);
  const [sharedBoards, setSharedBoards] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBoards = useCallback(async () => {
    if (!user?.phoneNumber) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await api.getUserBoards(user.phoneNumber);
      setBoards(response.createdBoards || []);
      setSharedBoards(response.sharedBoards || []);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch boards:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleApiCall = async (apiCall, successCallback) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      if (successCallback) await successCallback(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createBoard = async (name) => {
    try {
      setLoading(true);
      setError(null);
      const newBoard = await api.createBoard({
        name,
        userPhoneNumber: user.phoneNumber
      });
      await fetchBoards();
      return newBoard;
    } catch (err) {
      setError(err.message);
      if (err.message.includes('User not found')) {
        try {
          await api.ensureUserExists(user.phoneNumber);
          const retryBoard = await api.createBoard({
            name,
            userPhoneNumber: user.phoneNumber
          });
          await fetchBoards();
          return retryBoard;
        } catch (retryError) {
          setError(retryError.message);
          throw retryError;
        }
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getBoardDetails = async (boardId) => {
    if (!boardId) {
      setError('Board ID is required');
      return;
    }
    
    return handleApiCall(
      () => api.getBoard(boardId),
      (board) => {
        if (board) {
         
          const normalizedBoard = {
            ...board,
            _id: board._id || board.boardId?._id || boardId
          };
          setCurrentBoard(normalizedBoard);
        } else {
          setError('Board not found');
        }
      }
    );
  };

  const updateBoard = async (boardId, name) => {
    if (!boardId) {
      setError('Board ID is required');
      return;
    }
    return handleApiCall(
      () => api.updateBoard(boardId, { name }),
      async () => {
        await fetchBoards();
        if (currentBoard?._id === boardId) {
          setCurrentBoard(prev => ({ ...prev, name }));
        }
      }
    );
  };

  const deleteBoard = async (boardId) => {
    if (!boardId) {
      setError('Board ID is required');
      return;
    }
    return handleApiCall(
      () => api.deleteBoard(boardId),
      async () => {
        await fetchBoards();
        if (currentBoard?._id === boardId) {
          setCurrentBoard(null);
        }
      }
    );
  };

  const addTodo = async (boardId, todo) => {
    if (!boardId) {
      setError('Board ID is required');
      return;
    }
    return handleApiCall(
      () => api.addTodo(boardId, todo),
      () => getBoardDetails(boardId)
    );
  };

  const updateTodo = async (boardId, todoId, updates) => {
    if (!boardId || !todoId) {
      setError('Board ID and Todo ID are required');
      return;
    }
    return handleApiCall(
      () => api.updateTodo(boardId, todoId, updates),
      () => getBoardDetails(boardId)
    );
  };

  const deleteTodo = async (boardId, todoId) => {
    if (!boardId || !todoId) {
      setError('Board ID and Todo ID are required');
      return;
    }
    return handleApiCall(
      () => api.deleteTodo(boardId, todoId),
      () => getBoardDetails(boardId)
    );
  };

  const shareBoard = async (boardId, userPhoneNumber, role) => {
    if (!boardId || !userPhoneNumber || !role) {
      setError('Board ID, user phone number, and role are required');
      return;
    }
    return handleApiCall(
      () => api.addRole(boardId, { userPhoneNumber, role }),
      () => getBoardDetails(boardId)
    );
  };

  const removeAccess = async (boardId, userPhoneNumber) => {
    if (!boardId || !userPhoneNumber) {
      setError('Board ID and user phone number are required');
      return;
    }
    return handleApiCall(
      () => api.removeRole(boardId, userPhoneNumber),
      () => getBoardDetails(boardId)
    );
  };

  useEffect(() => {
    if (user?.phoneNumber) {
      fetchBoards();
    }
  }, [user, fetchBoards]);

  return (
    <BoardContext.Provider
      value={{
        boards,
        sharedBoards,
        currentBoard,
        loading,
        error,
        fetchBoards,
        createBoard,
        getBoardDetails,
        updateBoard,
        deleteBoard,
        addTodo,
        updateTodo,
        deleteTodo,
        shareBoard,
        removeAccess,
        clearCurrentBoard: () => setCurrentBoard(null)
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};