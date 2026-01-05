import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './components/layout/MainLayout';
import PrivateRoute from './wrappers/PrivateRoute';
// import RoleGuard from './wrappers/RoleGuard';

// Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/Dashboard';
import Places from './pages/Places';

// Placeholder for missing pages
const PlaceholderPage = ({ title }) => (
  <div style={{ textAlign: 'center', padding: '3rem' }}>
    <h2>{title}</h2>
    <p className="text-muted">Coming Soon...</p>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/places"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Places />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/plans"
            element={
              <PrivateRoute>
                <MainLayout>
                  <PlaceholderPage title="My Plans" />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <PrivateRoute>
                <MainLayout>
                  <PlaceholderPage title="Favorites" />
                </MainLayout>
              </PrivateRoute>
            }
          />

          {/* Admin Routes - Example
          <Route
            path="/admin/places"
            element={
              <PrivateRoute>
                <RoleGuard allowedRoles={['admin']}>
                  <MainLayout>
                    <PlaceholderPage title="Manage Places" />
                  </MainLayout>
                </RoleGuard>
              </PrivateRoute>
            }
          />
           */}

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
