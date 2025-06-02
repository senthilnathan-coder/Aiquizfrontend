import React, { useState } from 'react'
import StatsCard from '../Dashboard/StatsCards'
import EarningChart from '../Dashboard/EarningCharts'
import TopCourses from '../Dashboard/TopCourse'

const stats = [
  { title: 'Total Users Count', value: '2,345', percentage: 12.5, isIncrease: true, icon: '👥' },
  { title: 'Active Admins', value: '24', percentage: 5.2, isIncrease: true, icon: '👑' },
  { title: 'Subscription Revenue', value: '$12,567', percentage: 15.8, isIncrease: true, icon: '💰' },
  { title: 'Total Questions Created', value: '4,567', percentage: 8.4, isIncrease: true, icon: '📝' },
]

const leaderboardData = [
  { rank: 1, user: 'John Doe', score: 980, questionsSolved: 145, avatar: '👨‍💻' },
  { rank: 2, user: 'Jane Smith', score: 875, questionsSolved: 132, avatar: '👩‍💻' },
  { rank: 3, user: 'Mike Johnson', score: 860, questionsSolved: 128, avatar: '👨‍💻' },
]

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('7')
  const [moderationType, setModerationType] = useState('all')

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-10 max-w-[2000px] mx-auto mt-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm md:text-base text-gray-600">Monitor and manage your quiz platform</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 shadow-sm hover:shadow">
            Export Report
          </button>
          <button className="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md">
            Add New Quiz
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-sm font-medium ${stat.isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                {stat.isIncrease ? '↑' : '↓'} {Math.abs(stat.percentage)}%
              </span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Revenue Analytics</h2>
          <EarningChart />
        </div>
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Top Performing Courses</h2>
          <TopCourses />
        </div>
      </div>

      {/* App-Wide Leaderboard */}
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Platform Leaderboard</h2>
          <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200">
            View All Rankings
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {leaderboardData.map((item) => (
                <tr key={item.rank} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{item.rank}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-xl mr-2">{item.avatar}</span>
                      <span className="text-sm font-medium text-gray-900">{item.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.score}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.questionsSolved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Engagement Heatmap */}
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">User Engagement</h2>
          <select
            className="text-sm border rounded-lg p-2 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
        </div>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          {/* Placeholder for Heatmap Component */}
          <p className="text-gray-500">Heatmap Visualization</p>
        </div>
      </div>

      {/* Push Notification Panel */}
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Push Notifications</h2>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow">
            Send New
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Sent</h3>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-semibold text-gray-900">1,234</span>
              <span className="text-sm text-green-600">↑ 12%</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Delivered</h3>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-semibold text-gray-900">1,200</span>
              <span className="text-sm text-green-600">↑ 10%</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Opened</h3>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-semibold text-gray-900">985</span>
              <span className="text-sm text-green-600">↑ 8%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Moderation */}
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Content Moderation</h2>
          <div className="flex flex-wrap gap-3">
            <select
              className="text-sm border rounded-lg p-2 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={moderationType}
              onChange={(e) => setModerationType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="flagged">Flagged</option>
              <option value="reported">Reported</option>
            </select>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors duration-200 shadow-sm hover:shadow">
              Review Queue
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {/* Placeholder for moderation content */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-500 text-center">No items requiring moderation</p>
          </div>
        </div>
      </div>

      {/* AI Log Review */}
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">AI System Logs</h2>
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium">
              <span className="text-green-500">Success Rate: 98.5%</span>
            </div>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors duration-200">
              Download Logs
            </button>
          </div>
        </div>
        <div className="h-64 overflow-y-auto bg-gray-50 rounded-lg p-4">
          {/* Placeholder for AI logs */}
          <p className="text-gray-500 text-center">System logs will appear here</p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard