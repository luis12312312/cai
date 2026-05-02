import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Apologetas from './pages/Apologetas';
import Certificados from './pages/Certificados';
import Misiones from './pages/Misiones';
import Sectas from './pages/Sectas';

const PrivateRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role === 'SOLDADO_ACTIVE') {
    return <Navigate to="/misiones" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (token) {
    if (user.role === 'SOLDADO_ACTIVE') {
      return <Navigate to="/misiones" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute requireAdmin={true}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/apologetas"
          element={
            <PrivateRoute requireAdmin={true}>
              <Apologetas />
            </PrivateRoute>
          }
        />
        <Route
          path="/certificados"
          element={
            <PrivateRoute requireAdmin={true}>
              <Certificados />
            </PrivateRoute>
          }
        />
        <Route
          path="/misiones"
          element={
            <PrivateRoute>
              <Misiones />
            </PrivateRoute>
          }
        />
        <Route
          path="/sectas"
          element={
            <PrivateRoute>
              <Sectas />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
