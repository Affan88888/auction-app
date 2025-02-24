import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const UserContext = createContext();

// Create a provider component
export function UserProvider({ children }) {
  const [user, setUser] = useState(null); // Initialize user as null

  useEffect(() => {
    // Check authentication status on app load
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/check-auth', {
          method: 'GET',
          credentials: 'include' // Include cookies in the request
        });
        const result = await response.json();
        if (result.authenticated) {
          setUser(result.user); // Update the user state
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };
    checkAuth();
  }, []);

  // Function to log in a user
  const login = (userData) => {
    setUser(userData);
  };

  // Function to log out a user
  const logout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/logout', { 
      method: 'POST',
      credentials: 'include' 
      });
      if (response.ok) {
        setUser(null); // Clear the user state
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the context
export function useUser() {
  return useContext(UserContext);
}