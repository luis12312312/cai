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
    <div className="min-h-screen bg-[#04060b] flex flex-col items-center justify-center p-6 text-white font-body relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d8c08b]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full bg-black/40 border border-white/10 rounded-3xl p-10 text-center relative z-10 shadow-2xl backdrop-blur-sm animate-in fade-in zoom-in duration-700">
        <div className="w-20 h-20 bg-[#d8c08b]/10 border border-[#d8c08b]/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="material-symbols-outlined text-4xl text-[#d8c08b]">hourglass_empty</span>
        </div>
        
        <h1 className="text-3xl cai-display text-white mb-4">Aprobación Pendiente</h1>
        
        <p className="text-sm text-white/70 leading-relaxed mb-8">
          Pax et Bonum <strong>{user.fullName || user.username || 'Soldado'}</strong>. Tu cuenta actualmente se encuentra en estado <strong className="text-[#cf5d67]">Pendiente</strong>. 
          <br /><br />
          Para acceder al Santuario Digital, un administrador debe revisar tu solicitud y validar tus credenciales. Por favor, aguarda a que tu acceso sea concedido.
        </p>

        <button
          onClick={handleLogout}
          className="w-full bg-[#d8c08b] text-[#04060b] rounded-full py-3 px-6 text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default PendingApproval;