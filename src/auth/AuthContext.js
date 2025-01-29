import React, { createContext, useState, useContext } from 'react';

// Create the context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);
  // console.log(authData,'auth data')

  return (
    <AuthContext.Provider value={{ authData, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the context
export const useAuth = () => useContext(AuthContext);
