import React, { useState, useEffect } from 'react';
import { FaChartBar, FaList, FaClipboardCheck, FaRobot, FaComments, FaFileUpload, FaClock, FaSearch, FaBell } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line } from 'recharts';


const Dashboard = () => {
  const [stats, setStats] = useState({
    questionsUploaded: 0,
    topicsManaged: [],
    pendingReviews: 0,
    aiSuggestions: 0,
    userFeedback: [],
    quizSets: 0,
    performance: []
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Dummy data for development
      const dummyData = {
        questionsUploaded: 156,
        topicsManaged: [
          { name: 'Mathematics', count: 45, total: 100 },
          { name: 'Science', count: 32, total: 100 },
          { name: 'History', count: 28, total: 100 },
          { name: 'Geography', count: 51, total: 100 }
        ],
        pendingReviews: 23,
        aiSuggestions: 89,
        userFeedback: [
          { id: 1, user: 'John', rating: 4.5, comment: 'Great questions!' },
          { id: 2, user: 'Sarah', rating: 4.0, comment: 'Very helpful' }
        ],
        quizSets: 42,
        performance: [
          { topic: 'Math', score: 85 },
          { topic: 'Science', score: 78 },
          { topic: 'History', score: 92 },
          { topic: 'Geography', score: 88 }
        ]
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats(dummyData);

      // Keep the actual API call commented for later use
      // const response = await fetch('http://127.0.0.1:8000/api/admin/dashboard-stats/');
      // const data = await response.json();
      // setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

  // Add new state for trend data
  const [trendData, setTrendData] = useState([
    { date: '2024-01', questions: 45 },
    { date: '2024-02', questions: 62 },
    { date: '2024-03', questions: 78 },
    { date: '2024-04', questions: 95 }
  ]);

  // Add animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-slate-900 to-purple-900 p-3 sm:p-4 md:p-6 mt-20">
      <div className="max-w-7xl mx-auto mt-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0 ">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-purple-200 mt-1 sm:mt-2">Welcome back, Admin</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white/10 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-200" />
            </div>
            <button className="p-2 bg-white/10 rounded-xl text-purple-200 hover:bg-white/20 relative">
              <FaBell />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">3</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {[
            { icon: <FaList className="text-lg sm:text-xl" />, title: "Questions Uploaded", value: stats.questionsUploaded, color: "from-purple-500 to-pink-500" },
            { icon: <FaClipboardCheck className="text-lg sm:text-xl" />, title: "Pending Reviews", value: stats.pendingReviews, color: "from-blue-500 to-cyan-500" },
            { icon: <FaRobot className="text-lg sm:text-xl" />, title: "AI Suggestions", value: stats.aiSuggestions, color: "from-green-500 to-emerald-500" },
            { icon: <FaChartBar className="text-lg sm:text-xl" />, title: "Quiz Sets Created", value: stats.quizSets, color: "from-orange-500 to-red-500" }
          ].map((stat, index) => (
            <motion.div key={index} variants={cardVariants}>
              <StatCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        {/* New Trend Chart Section */}
        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
            <FaChartBar className="mr-2" />
            Question Upload Trends
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="date" stroke="#ffffff80" />
              <YAxis stroke="#ffffff80" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                labelStyle={{ color: '#fff' }}
              />
              <Line
                type="monotone"
                dataKey="questions"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ fill: '#8884d8' }}
                animationDuration={2000}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Enhanced Charts Section with Animations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 transform hover:scale-[1.02] transition-all"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
              <FaChartBar className="mr-2" />
              Performance Analytics
            </h2>
            <ResponsiveContainer width="100%" height={250} minHeight={200}>
              <BarChart data={stats.performance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="topic" stroke="#ffffff80" fontSize={12} />
                <YAxis stroke="#ffffff80" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none' }}
                  labelStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="score" fill="url(#colorGradient)" />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8884d8" />
                    <stop offset="100%" stopColor="#82ca9d" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 transform hover:scale-[1.02] transition-all"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center">
              <FaList className="mr-2" />
              Topics Distribution
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ResponsiveContainer width="100%" height={200} minHeight={150}>
                <PieChart>
                  <Pie
                    data={stats.topicsManaged}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                  >
                    {stats.topicsManaged.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 sm:space-y-4 overflow-y-auto max-h-[200px] scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-white/10">
                {stats.topicsManaged.map((topic, index) => (
                  <TopicProgressBar key={index} topic={topic} color={COLORS[index % COLORS.length]} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Panels */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ActionPanel
            icon={<FaFileUpload className="text-xl sm:text-2xl" />}
            title="Bulk Upload"
            description="Upload questions via Excel or PDF"
            action={() => {/* Handle bulk upload */ }}
            gradient="from-purple-500 to-pink-500"
          />
          <ActionPanel
            icon={<FaClock className="text-xl sm:text-2xl" />}
            title="Schedule Quiz"
            description="Set up upcoming quiz releases"
            action={() => {/* Handle scheduling */ }}
            gradient="from-blue-500 to-cyan-500"
          />
        </motion.div>
      </div>
    </div>
  );
};

// Enhanced Helper Components
const StatCard = ({ icon, title, value, color }) => (
  <div className={`bg-gradient-to-r ${color} rounded-xl sm:rounded-2xl p-4 sm:p-6 transform hover:scale-[1.02] transition-all`}>
    <div className="flex items-center text-white/90 mb-1 sm:mb-2">{icon}</div>
    <h3 className="text-white text-sm sm:text-lg font-semibold">{title}</h3>
    <p className="text-white text-xl sm:text-3xl font-bold mt-1 sm:mt-2">{value}</p>
  </div>
);

const TopicProgressBar = ({ topic, color }) => (
  <div className="space-y-1 sm:space-y-2">
    <div className="flex justify-between text-purple-200 text-xs sm:text-sm">
      <span className="font-medium truncate mr-2">{topic.name}</span>
      <span>{topic.count}</span>
    </div>
    <div className="h-1.5 sm:h-2 bg-white/5 rounded-full overflow-hidden">
      <div
        className="h-full transition-all duration-500 ease-out"
        style={{ width: `${(topic.count / topic.total) * 100}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

const ActionPanel = ({ icon, title, description, action, gradient }) => (
  <button
    onClick={action}
    className={`bg-gradient-to-r ${gradient} rounded-xl sm:rounded-2xl p-4 sm:p-6 text-left hover:shadow-lg hover:scale-[1.02] transition-all w-full`}
  >
    <div className="flex items-center text-white/90 mb-1 sm:mb-2">{icon}</div>
    <h3 className="text-white text-lg sm:text-xl font-semibold">{title}</h3>
    <p className="text-white/80 mt-1 text-sm sm:text-base">{description}</p>
  </button>
);

export default Dashboard;
