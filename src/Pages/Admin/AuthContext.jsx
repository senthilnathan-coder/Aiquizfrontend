// // src/context/AuthContext.js
// import React, { createContext, useContext, useState, useEffect } from 'react';

// // Create the AuthContext
// const AuthContext = createContext(null);

// // AuthProvider component to wrap your application
// export const AuthProvider = ({ children }) => {
//   // State to hold user data (e.g., id, email, fullname)
//   const [user, setUser] = useState(null);
//   // State to hold the access token, initialized from localStorage if available
//   const [token, setToken] = useState(localStorage.getItem('access_token'));

//   // Effect to rehydrate user data from localStorage when the token changes or on initial load
//   useEffect(() => {
//     if (token) {
//       try {
//         // In a real application, you might decode the JWT here to get user info
//         // or make an API call to fetch the user's profile based on the token.
//         // For this example, we'll try to load a stored user object.
//         const storedUser = localStorage.getItem('user');
//         if (storedUser) {
//           setUser(JSON.parse(storedUser));
//         } else {
//           // If token exists but no user data, you might fetch it or assume a basic structure
//           // For now, setting a placeholder if no user data is explicitly stored.
//           // This part might need adjustment based on how your backend sends user info.
//           console.warn("Token found but no user data in localStorage. Assuming basic user.");
//           setUser({ _id: 'unknown_id', email: 'unknown@example.com', fullname: 'Authenticated User' });
//         }
//       } catch (e) {
//         console.error("Failed to parse stored user data or token is invalid:", e);
//         logout(); // Clear invalid data if parsing fails
//       }
//     } else {
//         // If no token, ensure user state is null
//         setUser(null);
//     }
//   }, [token]); // Re-run this effect if the token changes

//   // Function to handle user login
//   const login = (userData, accessToken, refreshToken) => {
//     setUser(userData); // Set user data in state
//     setToken(accessToken); // Set access token in state
//     // Store user data and tokens in localStorage for persistence
//     localStorage.setItem('user', JSON.stringify(userData));
//     localStorage.setItem('access_token', accessToken);
//     localStorage.setItem('refresh_token', refreshToken);
//   };

//   // Function to handle user logout
//   const logout = () => {
//     setUser(null); // Clear user data from state
//     setToken(null); // Clear token from state
//     // Remove all authentication-related items from localStorage
//     localStorage.removeItem('user');
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('refresh_token');
//   };

//   // The value provided to consumers of this context
//   const contextValue = { user, token, login, logout };

//   return (
//     <AuthContext.Provider value={contextValue}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to easily consume the AuthContext
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   // Throw an error if useAuth is used outside of an AuthProvider
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

