import React, { useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useBoard } from '../../board/BoardContext';
import { useNavigate } from 'react-router-dom';
import BoardList from './BoardList';
import CreateBoard from './CreateBoard';
import { createUser } from '../../board/api'; // Import the API function

const HomeScreen = () => {
  const { user, logout } = useAuth();
  const { boards, sharedBoards, loading, error, fetchBoards } = useBoard();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAndCreateUser = async () => {
      if (user) {
        try {

          await fetchBoards();
        } catch (fetchError) {
          console.log('User not found, creating new user...');
          try {
    
            await createUser(user.phoneNumber);
        
            await fetchBoards();
          } catch (createError) {
            console.error('Failed to create user:', createError);
          }
        }
      }
    };

    checkAndCreateUser();
  }, [user, fetchBoards]);

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.phoneNumber}</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </header>

        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error.includes('User not found') ? 'Initializing your account...' : error}
          </div>
        ) : (
          <>
            <CreateBoard />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Your Boards</h2>
                <BoardList boards={boards} />
              </div>

              {sharedBoards.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4">Shared With You</h2>
                  <BoardList boards={sharedBoards} isShared />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;