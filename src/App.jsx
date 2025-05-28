import React from 'react';
import MainLayout from './Layout/main';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Import your components
import Home from './Pages/Home';
import Login from './Pages/Registration/Login';
import Signup from './Pages/Registration/Signup';
import UserDashboard from './Pages/User/Dashboard';
import Dashboard from './Pages/Admin/Dashboard';
import SuperDashboard from './Pages/SuperAdmin/SuperDashboard';
import PricingPlans from './Pages/Pricing/PricingPlans';
import CustomPackageBuilder from './components/CustomPackageBuilder';
import Aiquestions from './Pages/Paginations/Aiquestions';
// import Join from './Pages/Admin/join';

const App = () => {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/home" />} />
              <Route path="home" element={<Home />} />

              <Route path="pricing" element={<PricingPlans />} />
            </Route>

            <Route>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
            </Route>

            {/* Protected Routes */}
            <Route path="/" element={<MainLayout />}>
              <Route
                path="userdashboard"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="superadmin"
                element={
                  <ProtectedRoute>
                    <SuperDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="ai-questions"
                element={
                  <ProtectedRoute>
                    <Aiquestions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="custom-package"
                element={
                  <ProtectedRoute>
                    <CustomPackageBuilder />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/home" replace />} />

            {/* <Route path='/Join' element={<Join />}/> */}
          </Routes>
        </BrowserRouter>
      </SubscriptionProvider>
    </AuthProvider>
  );
};

export default App;
