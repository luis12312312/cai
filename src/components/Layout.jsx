import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchApi, logout } from '../api';

const rankCodes = new Set(['POSTULANTE', 'COMPANERO_ARMAS', 'ESCUDERO', 'SARGENTO_ARMAS', 'CABALLERO_TEMPLE', 'COMENDADOR', 'PRECEPTOR', 'MARISCAL', 'SENESCAL', 'GRAN_MAESTRE']);

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);
  const [rank, setRank] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'REGISTRADOR';
  const currentRank = rank?.userId === user.id ? rank : null;
  const rankCode = currentRank?.code || (rankCodes.has(user.rankCode) ? user.rankCode : 'POSTULANTE');
  const rankName = currentRank?.name || rankCode.replaceAll('_', ' ');
  const shieldUrl = isAdmin ? '/images/Logo.png' : `/ranks/${rankCode}.png`;
  const shieldAlt = isAdmin ? 'Emblema CAI del administrador' : `Escudo de ${rankName}`;

  useEffect(() => {
    if (isAdmin || user.role !== 'SOLDADO_ACTIVE') return;
    let active = true;
    const applyRank = (progress) => {
      if (active && rankCodes.has(progress?.rank?.code)) {
        setRank({ ...progress.rank, userId: user.id });
        const stored = JSON.parse(localStorage.getItem('user') || '{}');
        if (stored.id === user.id) localStorage.setItem('user', JSON.stringify({ ...stored, rankCode: progress.rank.code }));
      }
    };
    const refresh = () => { fetchApi('progress.get').then(applyRank).catch(() => {}); };
    const onProgress = (event) => { if (event.detail.userId === user.id) applyRank(event.detail.progress); };
    window.addEventListener('cai:progress', onProgress);
    window.addEventListener('focus', refresh);
    refresh();
    return () => { active = false; window.removeEventListener('cai:progress', onProgress); window.removeEventListener('focus', refresh); };
  }, [user.id, user.role, isAdmin, location.pathname]);

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        if (isAdmin) {
          const pendingUsers = await fetchApi('users.list', { data: { role: 'SOLDADO_PENDING', page: 1, pageSize: 1 } });
          if (pendingUsers && typeof pendingUsers.total !== 'undefined') {
            setPendingCount(pendingUsers.total);
          }
        }
      } catch (error) {
        console.error('Error fetching pending count:', error);
      }
    };
    fetchPendingCount();
  }, [isAdmin]);

  const handleLogout = () => {
    logout();
  };

  const navItems = isAdmin 
    ? [
        { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
        { label: 'Misiones', path: '/misiones', icon: 'explore_nearby' },
        { label: 'Apologetas', path: '/apologetas', icon: 'shield' },
        { label: 'Certificados', path: '/certificados', icon: 'workspace_premium' },
        { label: 'Sectas', path: '/sectas', icon: 'gavel' },
      ]
    : [
        { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
        { label: 'Misiones', path: '/misiones', icon: 'explore_nearby' },
        { label: 'Sectas', path: '/sectas', icon: 'gavel' },
      ];

  return (
    <div className="cai-auth-shell min-h-screen text-white flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-[#04060b]/90 border-r border-[#d8c08b]/10 backdrop-blur-md relative z-30">
        <div className="p-6 flex flex-col items-center border-b border-[#d8c08b]/10">
          <img src={shieldUrl} alt={shieldAlt} className="mb-4 h-24 w-24 shrink-0 object-contain" />
          <h2 className="cai-display w-full break-words text-center text-sm font-semibold text-[#d8c08b] leading-tight uppercase tracking-widest">{user.fullName || 'Usuario'}</h2>
          <p className="text-center text-[10px] uppercase tracking-[0.2em] text-white/50 mt-1">{isAdmin ? 'Administrador' : rankName}</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'cai-button-primary shadow-lg shadow-primary/20' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span className="font-semibold text-xs uppercase tracking-widest">{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#d8c08b]/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#cf5d67]/80 hover:bg-[#cf5d67]/10 hover:text-[#cf5d67] transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span className="font-semibold text-xs uppercase tracking-widest">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 h-32 bg-[#04060b]/95 backdrop-blur-md border-b border-[#d8c08b]/10 px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
          <img src={shieldUrl} alt={shieldAlt} className="h-10 w-10 shrink-0 object-contain" />
          <div className="flex w-full min-w-0 flex-col">
            <span className="cai-display line-clamp-2 break-words text-xs font-bold text-[#d8c08b] uppercase tracking-widest">{user.fullName || 'Usuario'}</span>
            <span className="line-clamp-1 text-[8px] uppercase tracking-[0.2em] text-white/50">{isAdmin ? 'Admin' : rankName}</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {isAdmin && pendingCount > 0 && (
            <button 
              onClick={() => navigate('/apologetas-pendientes')} 
              className="relative flex items-center justify-center text-[#d8c08b]"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#cf5d67] text-[9px] font-bold text-white shadow-sm">
                {pendingCount}
              </span>
            </button>
          )}
          <button onClick={handleLogout} className="text-[#cf5d67]/80">
            <span className="material-symbols-outlined text-[22px]">logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto w-full md:w-auto h-[100dvh]">
        <div className="absolute inset-0 bg-[#04060b] -z-10" />
        <div className="cai-overlay-grid absolute inset-0 opacity-20 -z-10" />
        <div
          className="absolute inset-0 opacity-30 mix-blend-screen -z-10 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 10% 10%, rgba(232,197,110,0.1), transparent 20%), radial-gradient(circle at 90% 90%, rgba(120,24,42,0.15), transparent 24%)',
          }}
        />
        
        <div className="pt-36 pb-24 md:pt-8 md:pb-8 px-4 sm:px-8 max-w-7xl mx-auto w-full min-h-full relative z-10">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#04060b]/95 backdrop-blur-xl border-t border-[#d8c08b]/10 pb-safe">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                  isActive ? 'text-[#d8c08b]' : 'text-white/40'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
                <span className="text-[8px] uppercase tracking-widest font-semibold">{item.label.substring(0,6)}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
