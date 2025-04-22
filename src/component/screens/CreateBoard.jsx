import React, { useState } from 'react';
import { useBoard } from '../../board/BoardContext';
import Notification from '../../ui/Notification'; // Add this component

const CreateBoard = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
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
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Create New Board</h2>
      {error && <Notification message={error} type="error" />}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Board name"
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={!name.trim() || loading}
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
      </form>
    </div>
  );
};

export default CreateBoard;