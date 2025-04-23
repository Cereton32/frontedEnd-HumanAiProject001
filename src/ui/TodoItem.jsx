import React from 'react';
import { useBoard } from '../board/BoardContext';

const TodoItem = ({ todo, boardId }) => {
  const { updateTodo, deleteTodo, currentBoard } = useBoard();
  
  const handleTogglePriority = async () => {
    try {
      await updateTodo(boardId, todo._id, { isPriority: !todo.isPriority });
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this todo?')) {
      try {
        await deleteTodo(boardId, todo._id);
      } catch (error) {
        console.error('Failed to delete todo:', error);
      }
    }
  };

  const isEditor = currentBoard?.roles?.some(
    r => r.userPhoneNumber === currentBoard.userPhoneNumber && 
    (r.role === 'editor' || r.userPhoneNumber === currentBoard.userPhoneNumber)
  );

  return (
    <div className={`
      relative p-4 mb-3 rounded-xl shadow-sm transition-all duration-300 
      ${todo.isPriority ? 
        'bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-amber-400' : 
        'bg-white border border-gray-100 hover:border-gray-200'}
      hover:shadow-md transform hover:-translate-y-0.5
    `}>
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className={`
            text-lg font-semibold mb-1 truncate
            ${todo.isPriority ? 'text-amber-700' : 'text-gray-800'}
          `}>
            {todo.name}
          </h3>
          {todo.description && (
            <p className="text-sm text-gray-500 line-clamp-2">{todo.description}</p>
          )}
        </div>
        
        {isEditor && (
          <div className="flex gap-2">
            <button
              onClick={handleTogglePriority}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                ${todo.isPriority ? 
                  'bg-amber-100 text-amber-700 hover:bg-amber-200 shadow-sm' : 
                  'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                flex items-center gap-1
              `}
            >
              {todo.isPriority ? (
                <>
                  <span className="text-amber-500">★</span> Priority
                </>
              ) : (
                <>
                  <span className="text-gray-400">☆</span> Normal
                </>
              )}
            </button>
            <button
              onClick={handleDelete}
              className="
                px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs 
                font-medium hover:bg-red-100 transition-colors duration-200
                flex items-center gap-1
              "
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>

      {todo.isPriority && (
        <div className="absolute top-2 right-2">
          <div className="animate-pulse bg-amber-400/20 rounded-full p-1.5">
            <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;