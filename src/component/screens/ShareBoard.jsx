import React, { useState } from 'react';
import { useBoard } from '../../board/BoardContext';

const ShareBoard = ({ boardId }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('viewer');
  const { currentBoard, shareBoard, removeAccess, loading } = useBoard();

  const handleShare = async (e) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    
    try {
      await shareBoard(boardId, phoneNumber, role);
      setPhoneNumber('');
    } catch (error) {
      console.error('Failed to share board:', error);
    }
  };

  const handleRemoveAccess = async (userPhoneNumber) => {
    if (window.confirm(`Remove access for ${userPhoneNumber}?`)) {
      try {
        await removeAccess(boardId, userPhoneNumber);
      } catch (error) {
        console.error('Failed to remove access:', error);
      }
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Share Board</h2>
      
      <form onSubmit={handleShare} className="flex gap-2 mb-4">
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="User phone number"
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={!phoneNumber.trim() || loading}
        >
          {loading ? 'Sharing...' : 'Share'}
        </button>
      </form>

      {currentBoard?.roles?.length > 1 && (
        <div>
          <h3 className="font-medium mb-2">Shared With</h3>
          <ul className="space-y-2">
            {currentBoard.roles
              .filter(role => role.userPhoneNumber !== currentBoard.userPhoneNumber)
              .map((role) => (
                <li key={role.userPhoneNumber} className="flex justify-between items-center">
                  <span>
                    {role.userPhoneNumber} ({role.role})
                  </span>
                  <button
                    onClick={() => handleRemoveAccess(role.userPhoneNumber)}
                    className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ShareBoard;