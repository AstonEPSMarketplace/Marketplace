"use client"
import React, { createContext, useContext, useState } from 'react';

// Create a context with a default value
const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [global, setGlobal] = useState({
    render: "market",
    user: {id: 240046440, fname: "Jack", lname: "Stewart"},
    isCookie: false,
    closePopup: false,
    refreshAttempt: false,
  });

  return (
    <GlobalContext.Provider value={{ global, setGlobal }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);