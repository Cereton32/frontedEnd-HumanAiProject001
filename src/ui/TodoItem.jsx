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
    <div className={`p-3 border rounded flex justify-between items-center ${todo.isPriority ? 'bg-yellow-50 border-yellow-200' : ''}`}>
      <div>
        <h3 className={`font-medium ${todo.isPriority ? 'text-yellow-700' : ''}`}>
          {todo.name}
        </h3>
        {todo.description && (
          <p className="text-sm text-gray-600">{todo.description}</p>
        )}
      </div>
      
      {isEditor && (
        <div className="flex gap-2">
          <button
            onClick={handleTogglePriority}
            className={`px-2 py-1 rounded text-sm ${todo.isPriority ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}
          >
            {todo.isPriority ? '★ Priority' : '☆ Normal'}
          </button>
          <button
            onClick={handleDelete}
            className="px-2 py-1 bg-red-100 text-red-600 rounded text-sm hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default TodoItem;