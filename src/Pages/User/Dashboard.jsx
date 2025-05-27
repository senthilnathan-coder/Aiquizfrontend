import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import {
  FaUser,
  FaQuestionCircle,
  FaChartLine,
  FaClock,
  FaTrophy,
  FaCalendar,
} from "react-icons/fa";

const UserDashboard = () => {
  const { user, loading: authLoading, token } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only proceed if authentication loading is complete
    if (authLoading) return;

    const fetchDashboard = async () => {
      // If user is not logged in after authLoading, set error and stop
      if (!user) {
        setError("User not logged in. Please log in to view your dashboard.");
        setLoading(false);
        return;
      }

      // Determine the user ID to use for the API call
      // Prioritize `_id` (from MongoDB usually), fall back to `id`
      const userId = user._id || user.id;

      if (!userId) {
        setError("User ID not found in authentication data.");
        setLoading(false);
        return;
      }

      setLoading(true); // Start loading for dashboard data fetch
      setError(null); // Clear previous errors

      try {
        const response = await axios.get(
          `http://localhost:8000/userdashboard/${userId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Use the token for authentication
              "Content-Type": "application/json",
            },
          }
        );

        // Assuming response.data directly contains the dashboard object
        // like { full_name: "venkat", feedback_history: [], ... }
        console.log("Dashboard API response data:", response.data);

        setDashboardData(response.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        // Provide a more descriptive error message if possible
        setError(err.response?.data?.error || `Failed to load dashboard: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchDashboard();
  }, [user, authLoading, token]); // Re-run effect if user, authLoading, or token changes

  // --- Loading, Not Logged In, and Error States ---
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen mt-20 bg-gray-50">
        <div className="text-center p-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // This case is already handled by the useEffect, but good as a fallback
    return (
      <div className="flex items-center justify-center min-h-screen mt-20 bg-gray-50">
        <div className="text-center p-10">
          <p className="text-red-500 mb-4">Please log in to view your dashboard.</p>
          {/* Optionally add a link to login page here */}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen mt-20 bg-gray-50">
        <div className="text-center p-10">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If dashboardData is null after loading, it means there was an issue
  // but no specific error was set (e.g., if API returned 200 with empty data)
  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen mt-20 bg-gray-50">
        <div className="text-center p-10">
          <p className="text-gray-600 mb-4">No dashboard data available. Please try again later.</p>
        </div>
      </div>
    );
  }

  // --- Sub-Components (Passed correct props) ---

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <Icon className={`text-3xl ${color.replace("border-", "text-")}`} />
      </div>
    </div>
  );

  const RecentActivity = ({ activities }) => (
    <div className="bg-white p-6 rounded-xl shadow-md col-span-full">
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
      {activities && activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={index} // Consider using a unique ID from activity if available for better performance
              className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg"
            >
              <FaCalendar className="text-blue-500" />
              <div>
                <p className="font-medium">{activity.action || 'Unknown Action'}</p>
                <p className="text-sm text-gray-500">
                  {activity.timestamp ? new Date(activity.timestamp).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No recent activity to display.</p>
      )}
    </div>
  );

  const UserProfile = ({ userData, userAuthData }) => ( // Added userAuthData prop
    <div className="bg-white p-6 rounded-xl shadow-md col-span-full md:col-span-1">
      <div className="flex items-center space-x-4">
        <img
          src={
            userData?.profile_image // Check for profile_image directly on userData
              ? `http://localhost:8000${userData.profile_image}`
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.full_name || userAuthData?.email || "User")}&background=random&color=fff&size=128`
          }
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold">
            {userData?.full_name || userAuthData?.email || "User"}
          </h2>
          {/* Use email from userAuthData (from context) as it's generally more reliable */}
          <p className="text-gray-500">{userAuthData?.email || "N/A"}</p>
          <p className="text-sm text-gray-400">
            Points: {userData?.points || 0}
          </p>
          <p className="text-sm text-gray-400">
            Current Streak: {userData?.streak || 0} days
          </p>
        </div>
      </div>
    </div>
  );

  // This QuizStats component was originally present, but its usage
  // in the main render seems to be replaced by the direct table rendering
  // and other specific performance overview cards.
  // I'm keeping it here in case you want to reuse it, but its data
  // mapping might need adjustment based on your backend's aggregated quiz_stats.
  const QuizStats = ({ stats }) => (
    <div className="bg-white p-6 rounded-xl shadow-md col-span-full md:col-span-2">
      <h2 className="text-xl font-semibold mb-4">Quiz Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-600">Total Attempts</p>
          <p className="text-2xl font-bold text-blue-700">{stats?.total_attempts || 0}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-600">Average Score</p>
          <p className="text-2xl font-bold text-green-700">
            {Math.round(stats?.average_score || 0)}%
          </p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-600">MCQ Attempts</p>
          <p className="text-2xl font-bold text-yellow-700">{stats?.mcq_attempts || 0}</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-600">True/False Attempts</p>
          <p className="text-2xl font-bold text-purple-700">
            {stats?.true_false_attempts || 0}
          </p>
        </div>
      </div>
    </div>
  );


  // --- Main Render ---
  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen mt-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome, {dashboardData?.full_name || user?.email || "User"}!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* User Profile Card */}
          {/* Passing user (from AuthContext) as userAuthData for email fallback */}
          <UserProfile userData={dashboardData} userAuthData={user} />

          {/* Stat Cards (Updated to reflect direct fields like points, streak, quiz_attempts.length) */}
          <StatCard
            icon={FaQuestionCircle}
            title="Total Quizzes"
            value={dashboardData?.quiz_attempts?.length || 0}
            color="border-blue-500"
          />
          <StatCard
            icon={FaTrophy}
            title="Total Points"
            value={dashboardData?.points || 0}
            color="border-green-500"
          />
          <StatCard
            icon={FaChartLine}
            title="Current Streak"
            value={`${dashboardData?.streak || 0} Days`}
            color="border-purple-500"
          />
          
          {/* Performance Overview (Adapted to your data: Quizzes Saved and Feedback Given) */}
          <div className="bg-white p-6 rounded-xl shadow-md col-span-full md:col-span-2 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Saved Content & Feedback</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg text-blue-700">
                <p className="text-sm text-blue-600">Quizzes Saved</p>
                <p className="text-2xl font-bold">{dashboardData?.saved_quizzes?.length || 0}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg text-red-700">
                <p className="text-sm text-red-600">Feedback Given</p>
                <p className="text-2xl font-bold">{dashboardData?.feedback_history?.length || 0}</p>
              </div>
            </div>
          </div>

          {/* Recent Activity (Using feedback_history and mapping it for the generic "activity" format) */}
          <RecentActivity 
            activities={dashboardData?.feedback_history?.map(feedback => ({
              action: `Gave feedback on: ${feedback.quiz_id || 'a quiz'}`, // Customize action based on your feedback object structure
              timestamp: feedback.timestamp || new Date().toISOString() // Assuming timestamp exists
            })) || []} 
          />
          
          {/* Quiz Attempts History Table */}
          <div className="bg-white p-6 rounded-xl shadow-md col-span-full md:col-span-3 lg:col-span-4">
              <h2 className="text-xl font-semibold mb-4">Quiz Attempts History</h2>
              {dashboardData?.quiz_attempts && dashboardData.quiz_attempts.length > 0 ? (
                  <div className="overflow-x-auto">
                      <table className="min-w-full bg-white rounded-lg shadow-md">
                          <thead>
                              <tr className="bg-gray-100 text-left text-sm text-gray-600 uppercase tracking-wider">
                                  <th className="py-3 px-4 border-b border-gray-200">Quiz ID</th>
                                  <th className="py-3 px-4 border-b border-gray-200">Date</th>
                                  <th className="py-3 px-4 border-b border-gray-200">Score</th>
                                  <th className="py-3 px-4 border-b border-gray-200">Type</th>
                                  <th className="py-3 px-4 border-b border-gray-200">Topic (if available)</th>
                              </tr>
                          </thead>
                          <tbody>
                              {dashboardData.quiz_attempts.map((attempt, index) => (
                                  <tr key={attempt.id || index} className="hover:bg-gray-50 border-b border-gray-100">
                                      <td className="py-3 px-4">{attempt.quiz_id || 'N/A'}</td>
                                      <td className="py-3 px-4">{new Date(attempt.date || '').toLocaleDateString()}</td>
                                      <td className="py-3 px-4 font-semibold">{attempt.score !== undefined ? `${attempt.score}%` : 'N/A'}</td>
                                      <td className="py-3 px-4">{attempt.question_type || 'N/A'}</td>
                                      <td className="py-3 px-4">{attempt.topic || 'N/A'}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              ) : (
                  <p className="text-gray-500">No quiz attempts recorded yet.</p>
              )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;