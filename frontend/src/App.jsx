import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import LoadingFallback from "./components/LoadingFallback";

// Lazy load all page components for code splitting
const AdminLoginPage = React.lazy(() => import("./pages/auth/AdminLoginPage"));
const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const RegistrationPage = React.lazy(() => import("./pages/RegistrationPage"));
const PaymentSuccessAnimation = React.lazy(() => import("./pages/PaymentSuccessAnimation"));
const ThankYouPage = React.lazy(() => import("./pages/ThankYouPage"));
const AdminDashboard = React.lazy(() => import("./pages/admin/AdminDashboard"));
const StudentList = React.lazy(() => import("./pages/admin/StudentList"));
const Analytics = React.lazy(() => import("./pages/admin/Analytics"));
const Settings = React.lazy(() => import("./pages/admin/Settings"));
const Wallet = React.lazy(() => import("./pages/admin/Wallet"));

// Protected Route Wrapper (Admin only now)
const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/admin/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
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
          </Suspense>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;

