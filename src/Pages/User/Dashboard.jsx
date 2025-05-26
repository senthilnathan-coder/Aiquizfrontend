import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { FaUser, FaQuestionCircle, FaChartLine, FaClock, FaTrophy, FaCalendar } from 'react-icons/fa';

const UserDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (authLoading) return;

    const fetchDashboard = async () => {
      try {
        const contextUserId = user?.id || user?._id;
        const localUser = JSON.parse(localStorage.getItem("user"));
        const localUserId = localUser?.id || localUser?._id;

        const userId = contextUserId || localUserId;

        if (!userId) {
          setError("User ID not found");
          setLoading(false);
          return;
        }

        // const token = localStorage.getItem("token");
        // if (!token) {
        //   setError("Authentication token missing");
        //   setLoading(false);
        //   return;
        // }

        console.log("UserID", contextUserId);

        const response = await axios.get(`http://localhost:8000/userdashboard/${userId}/`, {
          headers: {
            // Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });

        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err.response?.data?.error || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user && !JSON.parse(localStorage.getItem("user"))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-10">
          <p className="text-red-500 mb-4">Please log in to view your dashboard</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-10">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            // onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

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
      <div className="space-y-4">
        {activities?.map((activity, index) => (
          <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg">
            <FaCalendar className="text-blue-500" />
            <div>
              <p className="font-medium">{activity.action}</p>
              <p className="text-sm text-gray-500">
                {new Date(activity.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const UserProfile = ({ userData }) => (
    <div className="bg-white p-6 rounded-xl shadow-md col-span-full md:col-span-1">
      <div className="flex items-center space-x-4">
        <img
          src={
            userData.user_profile?.profile_image
              ? `http://localhost:8000${userData.user_profile.profile_image}`
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.user_profile?.full_name)}`
          }
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold">{userData.user_profile?.full_name}</h2>
          <p className="text-gray-500">{userData.user_profile?.email}</p>
          <p className="text-sm text-gray-400">
            Member since {new Date(userData.user_profile?.joined_date).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome, {dashboardData?.user_profile?.full_name || "User"}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={FaQuestionCircle}
            title="Total Questions Attempted"
            value={dashboardData.quiz_stats?.total_attempts || 0}
            color="border-blue-500"
          />
          <StatCard
            icon={FaTrophy}
            title="Best Score"
            value={`${dashboardData.quiz_stats?.best_score || 0}%`}
            color="border-green-500"
          />
          <StatCard
            icon={FaClock}
            title="Average Score"
            value={`${Math.round(dashboardData.quiz_stats?.average_score || 0)}%`}
            color="border-purple-500"
          />

          <UserProfile userData={dashboardData} />

          <QuizStats stats={{
            total_quizzes: dashboardData.quiz_stats?.total_attempts || 0,
            average_score: dashboardData.quiz_stats?.average_score || 0,
            mcq_attempts: dashboardData.activity_summary?.mcq_attempts || 0,
            true_false_attempts: dashboardData.activity_summary?.true_false_attempts || 0
          }} />

          <RecentActivity activities={dashboardData.recent_activities || []} />

          <div className="bg-white p-6 rounded-xl shadow-md col-span-full">
            <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-600">MCQ Attempts</p>
                <p className="text-2xl font-bold text-yellow-700">
                  {dashboardData.activity_summary?.mcq_attempts || 0}
                </p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg">
                <p className="text-sm text-indigo-600">True/False Attempts</p>
                <p className="text-2xl font-bold text-indigo-700">
                  {dashboardData.activity_summary?.true_false_attempts || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuizStats = ({ stats }) => (
  <div className="bg-white p-6 rounded-xl shadow-md col-span-full md:col-span-2">
    <h2 className="text-xl font-semibold mb-4">Quiz Statistics</h2>
    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-600">Total Attempts</p>
        <p className="text-2xl font-bold text-blue-700">{stats.total_quizzes}</p>
      </div>
      <div className="p-4 bg-green-50 rounded-lg">
        <p className="text-sm text-green-600">Average Score</p>
        <p className="text-2xl font-bold text-green-700">{Math.round(stats.average_score)}%</p>
      </div>
      <div className="p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-600">MCQ Attempts</p>
        <p className="text-2xl font-bold text-yellow-700">{stats.mcq_attempts}</p>
      </div>
      <div className="p-4 bg-purple-50 rounded-lg">
        <p className="text-sm text-purple-600">True/False Attempts</p>
        <p className="text-2xl font-bold text-purple-700">{stats.true_false_attempts}</p>
      </div>
    </div>
  </div>
);

export default UserDashboard;
