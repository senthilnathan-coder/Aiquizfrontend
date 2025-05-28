// // src/components/AdminSignup.js
// import React, { useState } from 'react';
// import axios from 'axios';
// import { FaUserPlus, FaEnvelope, FaLock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

// const Signup = ({ onSignupSuccess, onNavigateToSignin }) => {
//   // State variables for form inputs
//   const [fullname, setFullname] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   // State for loading, error, and success messages
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   // Handler for form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault(); // Prevent default form submission behavior
//     setError(''); // Clear previous errors
//     setSuccess(''); // Clear previous success messages

//     // Client-side password matching validation
//     if (password !== confirmPassword) {
//       setError('Passwords do not match.');
//       return;
//     }

//     setLoading(true); // Set loading state to true
//     try {
//       // Make POST request to the backend signup API
//       const response = await axios.post('http://localhost:8000/api/admin/signup/', {
//         fullname,
//         email,
//         password,
//         confirm_password: confirmPassword, // Ensure this matches your backend serializer field name
//       });
//       setSuccess(response.data.message || 'Admin registered successfully!'); // Set success message
//       // Clear form fields on successful signup
//       setFullname('');
//       setEmail('');
//       setPassword('');
//       setConfirmPassword('');
//       // Call the success callback provided by the parent component
//       if (onSignupSuccess) {
//         onSignupSuccess();
//       }
//     } catch (err) {
//       console.error('Signup error:', err);
//       // Handle different types of errors from the backend
//       if (err.response && err.response.data) {
//         // If backend returns specific validation errors (e.g., email already exists)
//         if (err.response.data.email) {
//             setError(`Email: ${err.response.data.email[0]}`);
//         } else if (err.response.data.password) {
//             setError(`Password: ${err.response.data.password[0]}`);
//         } else if (err.response.data.non_field_errors) {
//             setError(err.response.data.non_field_errors[0]); // General errors not tied to a specific field
//         } else if (err.response.data.error) { // Custom error message from your view
//             setError(err.response.data.error);
//         } else {
//             setError('Signup failed. Please check your details.'); // Generic fallback
//         }
//       } else {
//         setError('Network error or server unavailable. Please try again later.'); // For network issues
//       }
//     } finally {
//       setLoading(false); // Reset loading state
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
//       <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:scale-[1.01]">
//         <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
//           <FaUserPlus className="inline-block mr-3 text-blue-600" />
//           Admin Signup
//         </h2>

//         {/* Success message display */}
//         {success && (
//           <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex items-center">
//             <FaCheckCircle className="mr-2" />
//             {success}
//           </div>
//         )}
//         {/* Error message display */}
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 flex items-center">
//             <FaExclamationCircle className="mr-2" />
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Full Name Input */}
//           <div>
//             <label htmlFor="fullname" className="block text-gray-700 text-sm font-semibold mb-2">
//               Full Name
//             </label>
//             <div className="relative">
//               <FaUserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 id="fullname"
//                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                 placeholder="Enter your full name"
//                 value={fullname}
//                 onChange={(e) => setFullname(e.target.value)}
//                 required
//               />
//             </div>
//           </div>

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
//                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
//                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 minLength="6" // Enforce minimum length client-side
//               />
//             </div>
//           </div>

//           {/* Confirm Password Input */}
//           <div>
//             <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-semibold mb-2">
//               Confirm Password
//             </label>
//             <div className="relative">
//               <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="password"
//                 id="confirmPassword"
//                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                 placeholder="••••••••"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required
//                 minLength="6" // Enforce minimum length client-side
//               />
//             </div>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//             disabled={loading} // Disable button when loading
//           >
//             {loading ? 'Signing Up...' : 'Sign Up'}
//           </button>
//         </form>

//         {/* Link to Sign In page */}
//         <p className="text-center text-gray-600 text-sm mt-6">
//           Already have an account?{' '}
//           <button
//             onClick={onNavigateToSignin}
//             className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
//           >
//             Sign In
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;
