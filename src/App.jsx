import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Apologetas from './pages/Apologetas';
import Certificados from './pages/Certificados';
import Misiones from './pages/Misiones';
import Sectas from './pages/Sectas';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/apologetas" element={<Apologetas />} />
        <Route path="/certificados" element={<Certificados />} />
        <Route path="/misiones" element={<Misiones />} />
        <Route path="/sectas" element={<Sectas />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
