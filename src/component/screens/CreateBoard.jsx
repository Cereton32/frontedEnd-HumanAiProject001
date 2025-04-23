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
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 transition-all duration-500 hover:shadow-3xl hover:-translate-y-1">
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mr-4 shadow-inner">
          <svg 
            className="w-7 h-7 text-blue-600 animate-bounce" 
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
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Create New Board
        </h2>
      </div>
      
      {error && <Notification message={error} type="error" />}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Enter board name"
            className={`w-full px-6 py-4 text-lg text-gray-800 bg-gray-50/70 rounded-2xl border-2 ${
              isFocused ? 'border-blue-400 shadow-md' : 'border-gray-200'
            } focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-transparent transition-all duration-300`}
            disabled={loading}
          />
          {isFocused && (
            <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-full transform origin-left scale-x-0 animate-input-focus"></div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={!name.trim() || loading}
          className={`w-full px-8 py-4 rounded-2xl font-bold text-white transition-all duration-500 transform hover:scale-[1.02] ${
            !name.trim() || loading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl shadow-lg'
          } flex items-center justify-center`}
        >
          {loading ? (
            <>
              <svg 
                className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="animate-pulse">Creating Board...</span>
            </>
          ) : (
            <>
              <svg 
                className="w-6 h-6 mr-3 animate-pulse" 
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
              <span className="text-shadow">Create Board</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateBoard;