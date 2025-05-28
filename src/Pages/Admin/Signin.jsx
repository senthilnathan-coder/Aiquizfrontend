// // src/components/AdminSignin.js
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext'; // Import useAuth hook
// import { FaSignInAlt, FaEnvelope, FaLock, FaExclamationCircle } from 'react-icons/fa';

// const 



// Signin = ({ onNavigateToSignup }) => {
//   // Get the login function from AuthContext
//   const { login } = useAuth();
//   // State variables for form inputs
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   // State for loading and error messages
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Handler for form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent default form submission behavior
//     setError(''); // Clear previous errors
//     setLoading(true); // Set loading state to true

//     try {
//       // Make POST request to the backend signin API
//       const response = await axios.post('http://localhost:8000/api/admin/signin/', {
//         email,
//         password,
//       });

//       // Extract tokens and admin data from the response
//       const { access_token, refresh_token, admin } = response.data;
//       // Call the login function from AuthContext to update global state and localStorage
//       login(admin, access_token, refresh_token);
//       console.log('Admin logged in successfully:', admin);
//       // In a real application, you would typically redirect the user here, e.g.:
//       // history.push('/admin/dashboard'); // if using react-router-dom
//       // window.location.href = '/admin/dashboard'; // simple redirect
//     } catch (err) {
//       console.error('Signin error:', err);
//       // Handle different types of errors from the backend
//       if (err.response && err.response.data && err.response.data.error) {
//         setError(err.response.data.error); // Display specific error message from backend
//       } else {
//         setError('Login failed. Please check your credentials or try again later.'); // Generic fallback
//       }
//     } finally {
//       setLoading(false); // Reset loading state
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500 p-4">
//       <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-[1.01]">
//         <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
//           <FaSignInAlt className="inline-block mr-3 text-purple-600" />
//           Admin Signin
//         </h2>

//         {/* Error message display */}
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center">
//             <FaExclamationCircle className="mr-2" />
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Email Input */}
//           <div>
//             <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
//               Email Address
//             </label>
//             <div className="relative">
//               <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="email"
//                 id="email"
//                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
//                 placeholder="admin@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//           </div>

//           {/* Password Input */}
//           <div>
//             <label htmlFor="password" className="block text-gray-700 text-sm font-semibold mb-2">
//               Password
//             </label>
//             <div className="relative">
//               <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="password"
//                 id="password"
//                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-purple-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//             disabled={loading} // Disable button when loading
//           >
//             {loading ? 'Signing In...' : 'Sign In'}
//           </button>
//         </form>

//         {/* Link to Sign Up page */}
//         <p className="text-center text-gray-600 text-sm mt-6">
//           Don't have an account?{' '}
//           <button
//             onClick={onNavigateToSignup}
//             className="text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200"
//           >
//             Sign Up
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signin;
