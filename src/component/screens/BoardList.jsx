import React from 'react';
import { useNavigate } from 'react-router-dom';

const BoardList = ({ boards, isShared = false }) => {
  const navigate = useNavigate();

  if (!boards || boards.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 text-center border-2 border-dashed border-gray-200/70 shadow-inner">
        <div className="animate-float mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center shadow-inner mb-4">
          <svg 
            className="w-10 h-10 text-gray-400" 
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
        </div>
        <h3 className="text-2xl font-bold text-gray-700 mb-2">No boards found</h3>
        <p className="text-gray-500 text-lg">Create a new board to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            className="group relative bg-white/90 backdrop-blur-sm rounded-3xl border-2 border-gray-200/70 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-800 truncate pr-3">
                  {board.name}
                </h3>
                <svg 
                  className="w-6 h-6 text-gray-400 group-hover:text-blue-500 flex-shrink-0 mt-1 transition-all duration-300 group-hover:translate-x-1" 
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
                <div className="mt-4 flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    board.role === 'editor' 
                      ? 'bg-blue-100 text-blue-800 shadow-sm' 
                      : 'bg-purple-100 text-purple-800 shadow-sm'
                  } transition-all duration-300 group-hover:scale-105`}>
                    {board.role === 'editor' ? 'Editor' : 'Viewer'}
                  </span>
                  <span className="ml-3 text-sm text-gray-500 truncate">
                    Shared by {board.userPhoneNumber}
                  </span>
                </div>
              )}
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"></div>
          </div>
        );
      })}
    </div>
  );
};

export default BoardList;