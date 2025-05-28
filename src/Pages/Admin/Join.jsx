// // src/App.js
// import React, { useState } from 'react';
// // import AdminSignup from './components/AdminSignup';
// // import AdminSignin from './components/AdminSignin';
// // import { AuthProvider, useAuth } from './context/AuthContext';
// // Assuming you have a UserDashboard component from previous interactions
// // import UserDashboard from './components/UserDashboard'; 

// // This component will contain the logic for routing and displaying content
// const AppContent = () => {
//   // State to manage which view is currently displayed
//   // Default to 'signin', but if user is already logged in, show 'dashboard'
//   const [currentView, setCurrentView] = useState('signin'); 
//   // Get authentication state from AuthContext
//   const { user, token, logout } = useAuth(); 

//   // Effect to automatically navigate to dashboard if user is logged in
//   React.useEffect(() => {
//     if (user && token) {
//       setCurrentView('dashboard');
//     }
//   }, [user, token]); // Re-run when user or token changes

//   // Callback function for successful signup
//   const handleSignupSuccess = () => {
//     setCurrentView('signin'); // Navigate to signin after successful signup
//     // In a real app, you might use a more sophisticated notification system (e.g., toast)
//     alert('Signup successful! Please sign in.'); 
//   };

//   // Function to render the appropriate component based on currentView and auth status
//   const renderContent = () => {
//     // If user is logged in and current view is dashboard, show UserDashboard
//     if (user && token && currentView === 'dashboard') {
//       return (
//         <div>
//           <header className="bg-gray-800 text-white p-4 flex justify-between items-center fixed w-full top-0 z-10 shadow-md">
//             <h1 className="text-xl font-bold">Admin Dashboard</h1>
//             <button
//               onClick={logout}
//               className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
//             >
//               Logout
//             </button>
//           </header>
//           <UserDashboard />
//         </div>
//       );
//     }

//     // If not logged in or explicitly navigating, show signup or signin forms
//     if (currentView === 'signup') {
//       return (
//         <AdminSignup
//           onSignupSuccess={handleSignupSuccess}
//           onNavigateToSignin={() => setCurrentView('signin')}
//         />
//       );
//     } else { // Default to signin
//       return (
//         <AdminSignin
//           onNavigateToSignup={() => setCurrentView('signup')}
//         />
//       );
//     }
//   };

//   return (
//     <div>
//       {renderContent()}
//     </div>
//   );
// };

// // The main App component that provides the AuthContext
// const Join = () => {
//   return (
//     <AuthProvider>
//       <AppContent />
//     </AuthProvider>
//   );
// };

// export default Join;
