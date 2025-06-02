import React from 'react'
import AdminDashboard from '../SuperAdmin/Admin/Admindashboard'
import AnalyticsDashboard from '../SuperAdmin/Admin/AnalyticsDashboard'
import QuizManagement from '../SuperAdmin/Admin/QuizManagement'
import SuperAdminDashboard from '../SuperAdmin/Admin/SuperAdminDashboard'
import UserManagement from '../SuperAdmin/Admin/UserManagement'

import CourseTable from '../SuperAdmin/Dashboard/CourseTable'
import EarningCharts from '../SuperAdmin/Dashboard/EarningCharts'
import Header from '../SuperAdmin/Dashboard/Header'
import StatsCards from '../SuperAdmin/Dashboard/StatsCards'
import TopCourse from '../SuperAdmin/Dashboard/TopCourse'
import AdminLayout from './Shared/AdminLayout'
import Navigation from './Shared/Navigation'


const SuperDashboard = () => {
  return (
    <>

<div className='x-full flex justify-between '>

<div className='w-2/12'>
        <AdminLayout />
        {/* <Navigation /> */}
       
      
    </div>
    <div className='  w-10/12'>
      <div className=' '>
      <Header />
        <AdminDashboard />
        <AnalyticsDashboard />
        <QuizManagement />
        <SuperAdminDashboard />
        <UserManagement />
      </div>
      <div>
        <CourseTable />
        <EarningCharts />
        <StatsCards />
        <TopCourse />
      </div>
      </div>
      </div>
    </>
  )
}

export default SuperDashboard