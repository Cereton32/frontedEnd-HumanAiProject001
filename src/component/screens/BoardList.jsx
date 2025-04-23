import React from 'react';
import { useNavigate } from 'react-router-dom';

const BoardList = ({ boards, isShared = false }) => {
  const navigate = useNavigate();

  if (!boards || boards.length === 0) {
    return (
      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-200">
        <svg 
          className="w-12 h-12 mx-auto text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="1.5" 
            d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
          />
        </svg>
        <h3 className="mt-3 text-lg font-medium text-gray-700">No boards found</h3>
        <p className="mt-1 text-gray-500">Create a new board to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {boards.map((board) => {
        const boardId = board.boardId?._id || board._id || board.boardId;
        if (!boardId) {
          console.error('Invalid board data:', board);
          return null;
        }
        
        return (
          <div
            key={boardId}
            onClick={() => navigate(`/board/${boardId}`)}
            className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative p-5">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-800 truncate pr-2">
                  {board.name}
                </h3>
                <svg 
                  className="w-5 h-5 text-gray-400 group-hover:text-blue-500 flex-shrink-0 mt-0.5 transition-colors duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </div>
              
              {isShared && (
                <div className="mt-3 flex items-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    board.role === 'editor' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {board.role === 'editor' ? 'Editor' : 'Viewer'}
                  </span>
                  <span className="ml-2 text-sm text-gray-500 truncate">
                    Shared by {board.userPhoneNumber}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BoardList;