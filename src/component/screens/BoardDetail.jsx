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

  // Memoize the effective board ID to prevent recalculations
  const effectiveBoardId = useMemo(() => {
    return currentBoard?.boardId?._id || currentBoard?._id || paramBoardId;
  }, [currentBoard, paramBoardId]);

  // Stabilized data fetching
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
      // Only clear if navigating away from this board
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
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="p-4">Loading board details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="p-4 text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  if (!currentBoard && !isInitialLoad) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="p-4">Board not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/home')}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Delete Board
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">{currentBoard.name}</h1>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Board Owner</h2>
            <p>{currentBoard.userPhoneNumber}</p>
          </div>

          <ShareBoard boardId={effectiveBoardId} />
        </div>

        <TodoList boardId={effectiveBoardId} />
      </div>
    </div>
  );
};

export default React.memo(BoardDetail);