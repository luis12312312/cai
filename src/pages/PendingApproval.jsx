import React from 'react';
import { useNavigate } from 'react-router-dom';

const PendingApproval = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-on-background">
      <div className="max-w-md w-full bg-surface-container-low rounded-3xl p-8 shadow-lg text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-4xl text-primary">hourglass_empty</span>
        </div>
        
        <h1 className="text-2xl font-headline text-on-surface mb-4">Aprobación Pendiente</h1>
        
        <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
          Hola <strong>{user.fullName || user.username || 'Soldado'}</strong>, tu cuenta actualmente se encuentra en estado <strong>Pendiente</strong>. 
          <br /><br />
          Para acceder a los módulos de la plataforma, un administrador debe revisar tu solicitud y validar tu certificado. Por favor, espera a que tu cuenta sea activada.
        </p>

        <button
          onClick={handleLogout}
          className="w-full bg-primary text-white rounded-full py-3 px-6 font-label uppercase tracking-widest text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default PendingApproval;