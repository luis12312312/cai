import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Apologetas from './pages/Apologetas';
import Certificados from './pages/Certificados';
import Misiones from './pages/Misiones';
import Sectas from './pages/Sectas';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/dashboard" replace /> : children;
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
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/apologetas"
          element={
            <PrivateRoute>
              <Apologetas />
            </PrivateRoute>
          }
        />
        <Route
          path="/certificados"
          element={
            <PrivateRoute>
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
