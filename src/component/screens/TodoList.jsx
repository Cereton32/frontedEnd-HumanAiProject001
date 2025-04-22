import React, { useState } from 'react';
import { useBoard } from '../../board/BoardContext';
import TodoItem from '../../ui/TodoItem';

const TodoList = ({ boardId }) => {
  const [newTodoName, setNewTodoName] = useState('');
  const [newTodoDesc, setNewTodoDesc] = useState('');
  const { currentBoard, addTodo, loading } = useBoard();

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodoName.trim()) return;
    
    try {
      await addTodo(boardId, {
        name: newTodoName,
        description: newTodoDesc
      });
      setNewTodoName('');
      setNewTodoDesc('');
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Todos</h2>
      
      <form onSubmit={handleAddTodo} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
          <input
            type="text"
            value={newTodoName}
            onChange={(e) => setNewTodoName(e.target.value)}
            placeholder="Todo name"
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <input
            type="text"
            value={newTodoDesc}
            onChange={(e) => setNewTodoDesc(e.target.value)}
            placeholder="Description (optional)"
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            disabled={!newTodoName.trim() || loading}
          >
            {loading ? 'Adding...' : 'Add Todo'}
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {currentBoard?.todos?.length > 0 ? (
          currentBoard.todos.map((todo) => (
            <TodoItem 
              key={todo._id} 
              todo={todo} 
              boardId={boardId} 
            />
          ))
        ) : (
          <p className="text-gray-500">No todos yet</p>
        )}
      </div>
    </div>
  );
};

export default TodoList;