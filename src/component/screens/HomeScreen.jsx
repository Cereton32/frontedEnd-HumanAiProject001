import React, { useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useBoard } from '../../board/BoardContext';
import { useNavigate } from 'react-router-dom';
import BoardList from './BoardList';
import CreateBoard from './CreateBoard';
import { createUser } from '../../board/api';

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12 pt-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {user.phoneNumber.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Welcome back</h1>
              <p className="text-gray-600">{user.phoneNumber}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Logout
          </button>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className={`bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-lg shadow-md transform transition-all duration-500 ${error ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error.includes('User not found') ? 'Initializing your account...' : error}</span>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-12 animate-fade-in-up">
              <CreateBoard />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Your Boards</h2>
                </div>
                <BoardList boards={boards} />
              </div>

              {sharedBoards.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Shared With You</h2>
                  </div>
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