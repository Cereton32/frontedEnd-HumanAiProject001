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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Task Management</h2>
        <p className="text-sm text-gray-500">Add and organize your tasks</p>
      </div>

      <form onSubmit={handleAddTodo} className="p-6 border-b border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5">
            <input
              type="text"
              value={newTodoName}
              onChange={(e) => setNewTodoName(e.target.value)}
              placeholder="Task title"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
            />
          </div>
          <div className="md:col-span-5">
            <input
              type="text"
              value={newTodoDesc}
              onChange={(e) => setNewTodoDesc(e.target.value)}
              placeholder="Description (optional)"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={loading}
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:shadow-md transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
              disabled={!newTodoName.trim() || loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <span className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add
                </span>
              )}
            </button>
          </div>
        </div>
      </form>

      <div className="p-6">
        {currentBoard?.todos?.length > 0 ? (
          <div className="space-y-3">
            {currentBoard.todos.map((todo) => (
              <TodoItem 
                key={todo._id} 
                todo={todo} 
                boardId={boardId} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-500">No tasks yet</h3>
            <p className="mt-1 text-sm text-gray-400">Add your first task using the form above</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;