import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBoard } from '../../board/BoardContext';
import TodoList from './TodoList';
import ShareBoard from './ShareBoard';

const BoardDetail = () => {
  const { boardId: paramBoardId } = useParams();
  const navigate = useNavigate();
  const { 
    currentBoard, 
    getBoardDetails, 
    deleteBoard,
    loading,
    error,
    clearCurrentBoard
  } = useBoard();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const effectiveBoardId = useMemo(() => {
    return currentBoard?.boardId?._id || currentBoard?._id || paramBoardId;
  }, [currentBoard, paramBoardId]);

  useEffect(() => {
    if (!paramBoardId) {
      navigate('/home');
      return;
    }

    const fetchData = async () => {
      try {
        setIsInitialLoad(true);
        await getBoardDetails(paramBoardId);
      } catch (err) {
        console.error('Failed to load board:', err);
      } finally {
        setIsInitialLoad(false);
      }
    };

    fetchData();

    return () => {
      if (!window.location.pathname.startsWith(`/board/${paramBoardId}`)) {
        clearCurrentBoard();
      }
    };
  }, [paramBoardId]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this board?')) {
      try {
        await deleteBoard(paramBoardId);
        navigate('/home');
      } catch (error) {
        console.error('Failed to delete board:', error);
      }
    }
  };

  if (isInitialLoad && !currentBoard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center">
        <div className="max-w-4xl w-full mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md mx-auto text-center">
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-700">Loading board details</h3>
            <p className="text-gray-500 mt-2">Getting everything ready for you</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center">
        <div className="max-w-4xl w-full mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md mx-auto">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">Something went wrong</h3>
            <p className="text-red-500 text-center">{error}</p>
            <button 
              onClick={() => navigate('/home')}
              className="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentBoard && !isInitialLoad) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center">
        <div className="max-w-4xl w-full mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md mx-auto text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Board not found</h3>
            <p className="text-gray-500 mb-6">The board you're looking for doesn't exist or was deleted</p>
            <button 
              onClick={() => navigate('/home')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Browse your boards
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center px-5 py-2.5 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-x-1 text-gray-700"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Boards
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              className="flex items-center px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Delete Board
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 transition-all duration-500 hover:shadow-2xl">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{currentBoard.name}</h1>
              <div className="flex items-center text-gray-500">
                <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <span>Created by {currentBoard.userPhoneNumber}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <ShareBoard boardId={effectiveBoardId} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <TodoList boardId={effectiveBoardId} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(BoardDetail);