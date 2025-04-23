import React, { useState } from 'react';
import { useBoard } from '../../board/BoardContext';
import Notification from '../../ui/Notification';

const CreateBoard = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const { createBoard, loading } = useBoard();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!name.trim()) {
      setError('Board name cannot be empty');
      return;
    }
    
    try {
      await createBoard(name);
      setName('');
    } catch (error) {
      setError(error.message || 'Failed to create board. Please try again.');
      console.error('Failed to create board:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
          <svg 
            className="w-6 h-6 text-blue-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Create New Board</h2>
      </div>
      
      {error && <Notification message={error} type="error" />}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter board name"
            className={`w-full px-5 py-3 text-gray-700 bg-gray-50 rounded-xl border-2 ${
              isFocused ? 'border-blue-400' : 'border-gray-200'
            } focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent transition-all duration-200`}
            disabled={loading}
          />
          {isFocused && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transform origin-left scale-x-0 animate-input-focus"></div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={!name.trim() || loading}
          className={`w-full px-6 py-3.5 rounded-xl font-medium text-white transition-all duration-300 ${
            !name.trim() || loading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg'
          } flex items-center justify-center`}
        >
          {loading ? (
            <>
              <svg 
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Board...
            </>
          ) : (
            <>
              <svg 
                className="w-5 h-5 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M12 4v16m8-8H4" 
                />
              </svg>
              Create Board
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateBoard;