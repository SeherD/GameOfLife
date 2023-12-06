import React, { createContext, useReducer, useContext } from 'react';

   // Initial state for players
   const initialState = {
     players: [],
     username,
     
   };

   // Create context
   const PlayerContext = createContext();

   // Define reducer function
   const playerReducer = (state, action) => {
     switch (action.type) {
       case 'SET_PLAYERS':
         return { ...state, players: action.payload };
       // Add more cases as needed
       default:
         return state;
     }
   };

   // Create context provider
   export const PlayerProvider = ({ children }) => {
     const [state, dispatch] = useReducer(playerReducer, initialState);

     return (
       <PlayerContext.Provider value={{ state, dispatch }}>
         {children}
       </PlayerContext.Provider>
     );
   };

   // Custom hook to use the context
   export const usePlayerContext = () => {
     const context = useContext(PlayerContext);
     if (!context) {
       throw new Error('usePlayerContext must be used within a PlayerProvider');
     }
     return context;
   };