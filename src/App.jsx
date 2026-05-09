import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Apologetas from './pages/Apologetas';
import ApologetasPendientes from './pages/ApologetasPendientes';
import Certificados from './pages/Certificados';
import Misiones from './pages/Misiones';
import Sectas from './pages/Sectas';
import PendingApproval from './pages/PendingApproval';
import Layout from './components/Layout';
import SplashScreen from './components/SplashScreen';

const PrivateRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'SOLDADO_PENDING') {
    return <Navigate to="/pending" replace />;
  }

  if (requireAdmin && user.role !== 'SUPER_ADMIN' && user.role !== 'REGISTRADOR') {
    return <Navigate to="/misiones" replace />;
  }

  return <Layout>{children}</Layout>;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (token) {
    if (user.role === 'SOLDADO_PENDING') {
      return <Navigate to="/pending" replace />;
    }
    if (user.role === 'SOLDADO_ACTIVE') {
      return <Navigate to="/misiones" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    if (location.state?.showSplash) {
      setShowSplash(true);
      // Limpiamos el estado para que no vuelva a aparecer al recargar la página
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
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
          path="/pending"
          element={
            <PendingApproval />
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
          path="/apologetas-pendientes"
          element={
            <PrivateRoute requireAdmin={true}>
              <ApologetasPendientes />
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
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
