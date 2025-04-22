import React from 'react';
import { useNavigate } from 'react-router-dom';

const BoardList = ({ boards, isShared = false }) => {
  const navigate = useNavigate();

  if (!boards || boards.length === 0) {
    return <p className="text-gray-500">No boards found</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {boards.map((board) => {
        // Ensure we're using the correct ID structure
        const boardId = board.boardId?._id || board._id || board.boardId;
        if (!boardId) {
          console.error('Invalid board data:', board);
          return null;
        }
        
        return (
          <div
            key={boardId}
            onClick={() => navigate(`/board/${boardId}`)}
            className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition"
          >
            <h3 className="font-medium">{board.name}</h3>
            {isShared && (
              <p className="text-sm text-gray-500 mt-1">
                {board.role === 'editor' ? 'Editor' : 'Viewer'}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BoardList;