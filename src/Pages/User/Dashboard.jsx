import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // Adjust path if necessary
import {
  FaTrophy,
  FaStar,
  FaBookmark,
  FaChartLine,
  FaFire,
  FaCreditCard,
  FaHistory,
  FaEnvelopeOpenText,
  FaCrown,
} from 'react-icons/fa';

const UserDashboard = () => {
  const { user, token } = useAuth(); // Corrected usage of useAuth
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    // ... (rest of your existing code)
    try {
      const response = await axios.get(
        `http://localhost:8000/userdashboard/${user._id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Dashboard data fetched:", response.data);
      setDashboardData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard:', error.response?.data || error.message);
      setLoading(false);
      setDashboardData({});
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user, token]); // Depend on user and token for re-fetching

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-gray-700">Loading dashboard...</div>
      </div>
    );
  }

  // If dashboardData is null after loading (e.g., user not found or API error)
  if (!dashboardData || Object.keys(dashboardData).length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-xl font-semibold text-gray-700">No user dashboard data found. Please log in or ensure your account exists.</div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center space-x-4">
        <div className={`${color} p-3 rounded-lg bg-opacity-10`}>
          <Icon className={`text-2xl ${color}`} />
        </div>
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-lg">
          <h1 className="text-4xl font-bold mb-4">
            Welcome back, {dashboardData?.full_name || user?.full_name || 'User'}! 👋
          </h1>
          <p className="text-blue-100">Track your progress and keep improving</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={FaTrophy}
            title="Total Points"
            value={dashboardData?.points?.total_points || 0}
            color="text-yellow-500"
          />
          <StatCard
            icon={FaFire}
            title="Current Streak"
            value={`${dashboardData?.streak?.current_streak || 0} days`}
            color="text-red-500"
          />
          <StatCard
            icon={FaChartLine}
            title="Quiz Accuracy"
            // Assuming the first attempt's accuracy is representative or you need to calculate average
            value={`${dashboardData?.quiz_attempts?.[0]?.accuracy || 0}%`}
            color="text-green-500"
          />
          <StatCard
            icon={FaStar}
            title="Current Level"
            value={dashboardData?.points?.level || 1}
            color="text-purple-500"
          />
          {/* New Stat Card for Subscription */}
          <StatCard
            icon={FaCrown}
            title="Subscription Status"
            value={dashboardData?.subscription?.status || 'Free'}
            color={dashboardData?.subscription?.status === 'Active' ? 'text-blue-500' : 'text-gray-500'}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Quiz Attempts */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Recent Quizzes</h2>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                  Take New Quiz
                </button>
              </div>
              {/* // ... inside render section */}
              <div className="space-y-4">
                {dashboardData?.quiz_attempts?.length > 0 ? (
                  dashboardData.quiz_attempts.map((attempt) => (
                    <div
                      key={attempt.id || attempt._id} // Use _id for MongoDB documents
                      className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-800">
                            {attempt.topics?.join(', ') || 'General Quiz'}

                          </h3>
                          <p className="text-gray-500 text-sm mt-1">
                            Difficulty: {attempt.difficulty || 'N/A'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">
                            {attempt.score || 0}/{attempt.total || 0}
                          </p>
                          <p className="text-sm text-gray-500">
                            Time: {attempt.time_taken || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent quiz attempts yet.</p>
                )}
              </div>
            </div>

            {/* Payment History Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
              <div className="flex items-center space-x-3 mb-4">
                <FaCreditCard className="text-2xl text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">Payment History</h2>
              </div>
              <div className="space-y-3">
                {dashboardData?.payment_history?.length > 0 ? (
                  dashboardData.payment_history.map((payment) => (
                    <div
                      key={payment.id || payment._id} // Use _id for MongoDB documents
                      className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-blue-900">
                            {payment.description || 'Subscription Payment'}
                          </p>
                          <p className="text-gray-500 text-sm">
                            Date: {payment.date ? new Date(payment.date).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <p className="text-lg font-bold text-blue-600">
                          ${payment.amount?.toFixed(2) || '0.00'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No payment history found.</p>
                )}
              </div>
            </div>

            {/* Feedback History Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
              <div className="flex items-center space-x-3 mb-4">
                <FaEnvelopeOpenText className="text-2xl text-pink-500" />
                <h2 className="text-xl font-bold text-gray-800">Feedback History</h2>
              </div>
              <div className="space-y-3">
                {dashboardData?.feedback_history?.length > 0 ? (
                  dashboardData.feedback_history.map((feedback) => (
                    <div
                      key={feedback.id || feedback._id} // Use _id for MongoDB documents
                      className="p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition"
                    >
                      <p className="font-medium text-pink-900">
                        Subject: {feedback.subject || 'N/A'}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        "{feedback.message ? `${feedback.message.substring(0, 70)}${feedback.message.length > 70 ? '...' : ''}` : 'No message preview'}"
                      </p>
                      <p className="text-gray-500 text-xs mt-2 text-right">
                        Submitted on: {feedback.date ? new Date(feedback.date).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No feedback submitted yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-8">
            {/* Streak Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <FaFire className="text-2xl text-orange-500" />
                <h2 className="text-xl font-bold text-gray-800">Streak Stats</h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Streak</span>
                  <span className="text-2xl font-bold text-orange-500">
                    {dashboardData?.streak?.current_streak || 0} days
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Longest Streak</span>
                  <span className="text-2xl font-bold text-green-500">
                    {dashboardData?.streak?.longest_streak || 0} days
                  </span>
                </div>
              </div>
            </div>

            {/* Saved Quizzes */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <FaBookmark className="text-2xl text-purple-500" />
                <h2 className="text-xl font-bold text-gray-800">Saved Quizzes</h2>
              </div>
             // ... inside render section
              <div className="space-y-3">
                {dashboardData?.saved_quizzes?.length > 0 ? (
                  dashboardData.saved_quizzes.map((quiz) => (
                    <div
                      key={quiz.id || quiz._id} // Use _id for MongoDB documents
                      className="p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
                    >
                      <p className="font-medium text-purple-900">{quiz.notes || 'No notes'}</p>
{/* // Add this line to show the topic of the saved quiz */}
                      <p className="text-gray-600 text-sm mt-1">
                        Topic: {quiz.topics?.join(', ') || 'N/A'}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {/* The 'tags' are currently mapped from 'quiz.tags'. If your backend sends 'topics' here,
      you might want to change quiz.tags to quiz.topics for consistency. */}
                        {quiz.topics?.map((tag, idx) => ( // Changed from quiz.tags to quiz.topics
                          <span
                            key={idx}
                            className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No saved quizzes yet.</p>
                )}
              </div>
            </div>

            {/* Combined Attempt History (beyond recent) */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <FaHistory className="text-2xl text-gray-600" />
                <h2 className="text-xl font-bold text-gray-800">Full Attempt History</h2>
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {dashboardData?.quiz_attempts?.length > 0 ? ( // Using quiz_attempts for full history for now
                  dashboardData.quiz_attempts.map((attempt) => (
                    <div
                      key={attempt.id || attempt._id} // Use _id for MongoDB documents
                      className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
                    >
                      <p className="font-medium text-gray-800">
                        {attempt.topics?.join(', ') || 'Quiz'} - Score: {attempt.score || 0}/{attempt.total || 0}
                      </p>
                      <p className="text-gray-500 text-sm">
                        on {attempt.created_at ? new Date(attempt.created_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No extensive attempt history.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;



// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import { useAuth } from '../../context/AuthContext';
// // import { FaTrophy, FaStopwatch, FaStar, FaBookmark, FaChartLine, FaFire } from 'react-icons/fa';

// // const UserDashboard = () => {
// //   const { user, token } = useAuth(useAuth);
// //   const [dashboardData, setDashboardData] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   const fetchDashboardData = async () => {
// //     try {
// //       const response = await axios.get(
// //         `http://localhost:8000/userdashboard/${user._id}/`,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         }
// //       );
// //       setDashboardData(response.data);
// //       setLoading(false);
// //     } catch (error) {
// //       console.error('Error fetching dashboard:', error);
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     if (user && user._id) {
// //       fetchDashboardData();
// //     }
// //   }, [user, token]);

// //   if (loading) return <div className="text-center mt-10">Loading...</div>;

// //   if (!dashboardData) return <div className="text-center mt-10">No data found.</div>;

// //   const StatCard = ({ icon: Icon, title, value, color }) => (
// //     <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
// //       <div className="flex items-center space-x-4">
// //         <div className={`${color} p-3 rounded-lg bg-opacity-10`}>
// //           <Icon className={`text-2xl ${color}`} />
// //         </div>
// //         <div>
// //           <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
// //           <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
// //         </div>
// //       </div>
// //     </div>
// //   );

// //   return (
// //     <div className="min-h-screen bg-gray-50 pt-24 pb-12">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //         {/* Header Section */}
// //         <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-lg">
// //           <h1 className="text-4xl font-bold mb-4">Welcome back, {dashboardData?.full_name}! 👋</h1>
// //           <p className="text-blue-100">Track your progress and keep improving</p>
// //         </div>

// //         {/* Stats Overview */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
// //           <StatCard
// //             icon={FaTrophy}
// //             title="Total Points"
// //             value={dashboardData?.points?.total_points || 0}
// //             color="text-yellow-500"
// //           />
// //           <StatCard
// //             icon={FaFire}
// //             title="Current Streak"
// //             value={`${dashboardData?.streak?.current_streak || 0} days`}
// //             color="text-red-500"
// //           />
// //           <StatCard
// //             icon={FaChartLine}
// //             title="Accuracy"
// //             value={`${dashboardData?.quiz_attempts?.[0]?.accuracy || 0}%`}
// //             color="text-green-500"
// //           />
// //           <StatCard
// //             icon={FaStar}
// //             title="Level"
// //             value={dashboardData?.points?.level || 1}
// //             color="text-purple-500"
// //           />
// //         </div>

// //         {/* Main Content Grid */}
// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// //           {/* Recent Quiz Attempts */}
// //           <div className="lg:col-span-2">
// //             <div className="bg-white rounded-xl shadow-lg p-6">
// //               <div className="flex items-center justify-between mb-6">
// //                 <h2 className="text-2xl font-bold text-gray-800">Recent Quizzes</h2>
// //                 <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
// //                   Take New Quiz
// //                 </button>
// //               </div>
// //               <div className="space-y-4">
// //                 {dashboardData?.quiz_attempts?.map((attempt) => (
// //                   <div key={attempt.id}
// //                        className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition">
// //                     <div className="flex justify-between items-center">
// //                       <div>
// //                         <h3 className="font-semibold text-lg text-gray-800">
// //                           {attempt.topics?.join(', ') || 'General Quiz'}
// //                         </h3>
// //                         <p className="text-gray-500 text-sm mt-1">
// //                           Difficulty: {attempt.difficulty}
// //                         </p>
// //                       </div>
// //                       <div className="text-right">
// //                         <p className="text-2xl font-bold text-blue-600">
// //                           {attempt.score}/{attempt.total}
// //                         </p>
// //                         <p className="text-sm text-gray-500">
// //                           Time: {attempt.time_taken}
// //                         </p>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>

// //           {/* Sidebar Content */}
// //           <div className="space-y-8">
// //             {/* Streak Card */}
// //             <div className="bg-white rounded-xl shadow-lg p-6">
// //               <div className="flex items-center space-x-3 mb-4">
// //                 <FaFire className="text-2xl text-orange-500" />
// //                 <h2 className="text-xl font-bold text-gray-800">Streak Stats</h2>
// //               </div>
// //               <div className="space-y-4">
// //                 <div className="flex justify-between items-center">
// //                   <span className="text-gray-600">Current Streak</span>
// //                   <span className="text-2xl font-bold text-orange-500">
// //                     {dashboardData?.streak?.current_streak || 0}
// //                   </span>
// //                 </div>
// //                 <div className="flex justify-between items-center">
// //                   <span className="text-gray-600">Longest Streak</span>
// //                   <span className="text-2xl font-bold text-green-500">
// //                     {dashboardData?.streak?.longest_streak || 0}
// //                   </span>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Saved Quizzes */}
// //             <div className="bg-white rounded-xl shadow-lg p-6">
// //               <div className="flex items-center space-x-3 mb-4">
// //                 <FaBookmark className="text-2xl text-purple-500" />
// //                 <h2 className="text-xl font-bold text-gray-800">Saved Quizzes</h2>
// //               </div>
// //               <div className="space-y-3">
// //                 {dashboardData?.saved_quizzes?.map((quiz) => (
// //                   <div key={quiz.id}
// //                        className="p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition">
// //                     <p className="font-medium text-purple-900">{quiz.notes}</p>
// //                     <div className="flex flex-wrap gap-2 mt-2">
// //                       {quiz.tags?.map((tag, idx) => (
// //                         <span key={idx}
// //                               className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
// //                           {tag}
// //                         </span>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default UserDashboard;




// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useAuth } from '../../context/AuthContext';
// import {
//   FaTrophy,
//   FaStopwatch,
//   FaStar,
//   FaBookmark,
//   FaChartLine,
//   FaFire,
//   FaCreditCard, // New icon for Payment History
//   FaHistory, // New icon for Attempt History
//   FaEnvelopeOpenText, // Or FaCommentDots, FaQuestionCircle for Feedback history
//   FaCrown, // For Subscription
// } from 'react-icons/fa';

// const UserDashboard = () => {
//   const { user, token } = useAuth(); // Corrected usage of useAuth
//   const [dashboardData, setDashboardData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchDashboardData = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8000/userdashboard/${user._id}/`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setDashboardData(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching dashboard:', error);
//       setLoading(false);
//       // Handle cases where specific data might be missing from the backend
//       setDashboardData({}); // Set to an empty object to avoid errors if data is null
//     }
//   };

//   useEffect(() => {
//     if (user && user._id) {
//       fetchDashboardData();
//     }
//   }, [user, token]);

//   if (loading) return <div className="text-center mt-10">Loading...</div>;

//   // You might want to handle an empty dashboardData differently,
//   // perhaps showing a message or allowing some sections to display "No data"
//   if (!dashboardData) return <div className="text-center mt-10">No data found.</div>;

//   const StatCard = ({ icon: Icon, title, value, color }) => (
//     <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//       <div className="flex items-center space-x-4">
//         <div className={`${color} p-3 rounded-lg bg-opacity-10`}>
//           <Icon className={`text-2xl ${color}`} />
//         </div>
//         <div>
//           <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
//           <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 pt-24 pb-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header Section */}
//         <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 text-white shadow-lg">
//           <h1 className="text-4xl font-bold mb-4">
//             Welcome back, {dashboardData?.full_name || 'User'}! 👋
//           </h1>
//           <p className="text-blue-100">Track your progress and keep improving</p>
//         </div>

//         {/* Stats Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <StatCard
//             icon={FaTrophy}
//             title="Total Points"
//             value={dashboardData?.points?.total_points || 0}
//             color="text-yellow-500"
//           />
//           <StatCard
//             icon={FaFire}
//             title="Current Streak"
//             value={`${dashboardData?.streak?.current_streak || 0} days`}
//             color="text-red-500"
//           />
//           <StatCard
//             icon={FaChartLine}
//             title="Quiz Accuracy"
//             value={`${dashboardData?.quiz_attempts?.[0]?.accuracy || 0}%`}
//             color="text-green-500"
//           />
//           <StatCard
//             icon={FaStar}
//             title="Current Level"
//             value={dashboardData?.points?.level || 1}
//             color="text-purple-500"
//           />
//           {/* New Stat Card for Subscription */}
//           <StatCard
//             icon={FaCrown}
//             title="Subscription Status"
//             value={dashboardData?.subscription?.status || 'Free'}
//             color={dashboardData?.subscription?.status === 'Active' ? 'text-blue-500' : 'text-gray-500'}
//           />
//         </div>

//         {/* Main Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Recent Quiz Attempts */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-2xl font-bold text-gray-800">Recent Quizzes</h2>
//                 <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
//                   Take New Quiz
//                 </button>
//               </div>
//               <div className="space-y-4">
//                 {dashboardData?.quiz_attempts?.length > 0 ? (
//                   dashboardData.quiz_attempts.map((attempt) => (
//                     <div
//                       key={attempt.id}
//                       className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition"
//                     >
//                       <div className="flex justify-between items-center">
//                         <div>
//                           <h3 className="font-semibold text-lg text-gray-800">
//                             {attempt.topics?.join(', ') || 'General Quiz'}
//                           </h3>
//                           <p className="text-gray-500 text-sm mt-1">
//                             Difficulty: {attempt.difficulty}
//                           </p>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-2xl font-bold text-blue-600">
//                             {attempt.score}/{attempt.total}
//                           </p>
//                           <p className="text-sm text-gray-500">
//                             Time: {attempt.time_taken}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-500 text-center py-4">No quiz attempts yet.</p>
//                 )}
//               </div>
//             </div>
//             {/* Payment History Section */}
//             <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
//               <div className="flex items-center space-x-3 mb-4">
//                 <FaCreditCard className="text-2xl text-blue-600" />
//                 <h2 className="text-xl font-bold text-gray-800">Payment History</h2>
//               </div>
//               <div className="space-y-3">
//                 {dashboardData?.payment_history?.length > 0 ? (
//                   dashboardData.payment_history.map((payment) => (
//                     <div
//                       key={payment.id}
//                       className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
//                     >
//                       <div className="flex justify-between items-center">
//                         <div>
//                           <p className="font-medium text-blue-900">
//                             {payment.description || 'Subscription Payment'}
//                           </p>
//                           <p className="text-gray-500 text-sm">
//                             Date: {new Date(payment.date).toLocaleDateString()}
//                           </p>
//                         </div>
//                         <p className="text-lg font-bold text-blue-600">
//                           ${payment.amount?.toFixed(2)}
//                         </p>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-500 text-center py-4">No payment history found.</p>
//                 )}
//               </div>
//             </div>
//             {/* Feedback History Section */}
//             <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
//               <div className="flex items-center space-x-3 mb-4">
//                 <FaEnvelopeOpenText className="text-2xl text-pink-500" />
//                 <h2 className="text-xl font-bold text-gray-800">Feedback History</h2>
//               </div>
//               <div className="space-y-3">
//                 {dashboardData?.feedback_history?.length > 0 ? (
//                   dashboardData.feedback_history.map((feedback) => (
//                     <div
//                       key={feedback.id}
//                       className="p-3 bg-pink-50 rounded-lg hover:bg-pink-100 transition"
//                     >
//                       <p className="font-medium text-pink-900">
//                         Subject: {feedback.subject}
//                       </p>
//                       <p className="text-gray-600 text-sm mt-1">
//                         "{feedback.message.substring(0, 70)}{feedback.message.length > 70 ? '...' : ''}"
//                       </p>
//                       <p className="text-gray-500 text-xs mt-2 text-right">
//                         Submitted on: {new Date(feedback.date).toLocaleDateString()}
//                       </p>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-500 text-center py-4">No feedback submitted yet.</p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Sidebar Content */}
//           <div className="space-y-8">
//             {/* Streak Card */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="flex items-center space-x-3 mb-4">
//                 <FaFire className="text-2xl text-orange-500" />
//                 <h2 className="text-xl font-bold text-gray-800">Streak Stats</h2>
//               </div>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Current Streak</span>
//                   <span className="text-2xl font-bold text-orange-500">
//                     {dashboardData?.streak?.current_streak || 0} days
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Longest Streak</span>
//                   <span className="text-2xl font-bold text-green-500">
//                     {dashboardData?.streak?.longest_streak || 0} days
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Saved Quizzes */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="flex items-center space-x-3 mb-4">
//                 <FaBookmark className="text-2xl text-purple-500" />
//                 <h2 className="text-xl font-bold text-gray-800">Saved Quizzes</h2>
//               </div>
//               <div className="space-y-3">
//                 {dashboardData?.saved_quizzes?.length > 0 ? (
//                   dashboardData.saved_quizzes.map((quiz) => (
//                     <div
//                       key={quiz.id}
//                       className="p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
//                     >
//                       <p className="font-medium text-purple-900">{quiz.notes}</p>
//                       <div className="flex flex-wrap gap-2 mt-2">
//                         {quiz.tags?.map((tag, idx) => (
//                           <span
//                             key={idx}
//                             className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded"
//                           >
//                             {tag}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-500 text-center py-4">No saved quizzes yet.</p>
//                 )}
//               </div>
//             </div>

//             {/* Combined Attempt History (beyond recent) */}
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="flex items-center space-x-3 mb-4">
//                 <FaHistory className="text-2xl text-gray-600" />
//                 <h2 className="text-xl font-bold text-gray-800">Full Attempt History</h2>
//               </div>
//               <div className="space-y-3 max-h-60 overflow-y-auto">
//                 {dashboardData?.full_attempt_history?.length > 0 ? (
//                   dashboardData.full_attempt_history.map((attempt) => (
//                     <div
//                       key={attempt.id}
//                       className="p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
//                     >
//                       <p className="font-medium text-gray-800">
//                         {attempt.topics?.join(', ') || 'Quiz'} - Score: {attempt.score}/{attempt.total}
//                       </p>
//                       <p className="text-gray-500 text-sm">
//                         on {new Date(attempt.date).toLocaleDateString()}
//                       </p>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-500 text-center py-4">No extensive attempt history.</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;