import { createContext, useContext } from 'react';

export const BoardContext = createContext();

export const useBoard = () => {
  const context = useContext(BoardContext);
  
  return context;
};