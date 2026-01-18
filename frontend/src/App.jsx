import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";

import AdminLoginPage from "./pages/auth/AdminLoginPage";
import LandingPage from "./pages/LandingPage";
import RegistrationPage from "./pages/RegistrationPage";
import PaymentSuccessAnimation from "./pages/PaymentSuccessAnimation";
import ThankYouPage from "./pages/ThankYouPage";

// Protected Route Wrapper (Admin only now)
const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/admin/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentList from "./pages/admin/StudentList";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";
import Wallet from "./pages/admin/Wallet";

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/payment-success" element={<PaymentSuccessAnimation />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <ProtectedRoute role="admin">
                  <StudentList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute role="admin">
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute role="admin">
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/wallet"
              element={
                <ProtectedRoute role="admin">
                  <Wallet />
                </ProtectedRoute>
              }
            />

            {/* Default Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;

