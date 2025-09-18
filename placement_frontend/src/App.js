import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/theme.css';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import SignIn from './pages/auth/SignIn';
import RegisterStudent from './pages/auth/RegisterStudent';
import RegisterStaff from './pages/auth/RegisterStaff';
import StudentDashboard from './pages/student/StudentDashboard';
import StaffDashboard from './pages/staff/StaffDashboard';
import ProtectedRoute from './components/ProtectedRoute';

// PUBLIC_INTERFACE
function App() {
  /** Root application routing and providers. */
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/register/student" element={<RegisterStudent />} />
          <Route path="/auth/register/staff" element={<RegisterStaff />} />
          <Route
            path="/student"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <ProtectedRoute role="staff">
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
