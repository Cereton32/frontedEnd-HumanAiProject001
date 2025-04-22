// AuthContext.js
import { createContext, useContext } from 'react';

// Create Context
export const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
