import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApi } from '../api';

const ApologetasPendientes = () => {
  const navigate = useNavigate();
  const [reviewRequests, setReviewRequests] = useState([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'REGISTRADOR';

  useEffect(() => {
    fetchReviewRequests();
  }, []);

  const fetchReviewRequests = async () => {
    setIsLoadingRequests(true);
    try {
      // Ahora traemos a los usuarios que están en estado pendiente desde el listado global de usuarios
      const data = await fetchApi('/admin/users?role=SOLDADO_PENDING&page=1&pageSize=50');
      if (data && data.items) {
        setReviewRequests(data.items);
      }
    } catch (error) {
      console.error('Error fetching review requests:', error);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const handleApproveRequest = async (userId) => {
    try {
      await fetchApi(`/admin/users/${userId}/activate`, { method: 'POST' });
      await fetchReviewRequests();
    } catch (error) {
      alert('Error al aprobar: ' + error.message);
    }
  };

  const handleRejectRequest = async (userId) => {
    try {
      await fetchApi(`/admin/users/${userId}/deactivate`, { method: 'POST' });
      await fetchReviewRequests();
    } catch (error) {
      alert('Error al rechazar: ' + error.message);
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const goToDashboard = () => navigate('/dashboard');
  const goToMisiones = () => navigate('/misiones');
  const goToApologetas = () => navigate('/apologetas');
  const goToCertificados = () => navigate('/certificados');
  const goToSectas = () => navigate('/sectas');

  return (
    <div className="min-h-screen bg-surface text-on-background">
      {/* Mobile Layout */}
      <div className="md:hidden">
        <main className="mx-auto min-h-screen max-w-sm px-5 pb-32 pt-5">
          <header className="flex items-center justify-between">
            <button onClick={goToDashboard} className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-on-surface">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="font-headline text-xl font-bold text-primary">Apologetas Pendientes</h1>
            <div className="w-10"></div>
          </header>

          <section className="mt-8">
            {isLoadingRequests ? (
              <p className="text-center text-sm text-on-surface-variant">Cargando solicitudes...</p>
            ) : reviewRequests.length === 0 ? (
              <div className="mt-6 rounded-2xl bg-surface-container-lowest p-8 text-center border border-outline-variant/10">
                <span className="material-symbols-outlined text-4xl text-primary/30">task_alt</span>
                <p className="mt-3 font-medium text-on-surface">No hay solicitudes pendientes</p>
                <p className="mt-1 text-sm text-on-surface-variant">Todos los certificados han sido revisados.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviewRequests.map((request) => (
                  <article key={request.id} className="rounded-[1.4rem] border border-outline-variant/20 bg-surface px-6 py-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="rounded-full bg-secondary/10 px-3 py-1 font-label text-[10px] uppercase tracking-widest text-secondary font-bold">
                        En revisión
                      </span>
                      <span className="text-xs text-on-surface-variant">{new Date(request.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-headline text-xl font-bold text-on-surface">{request.fullName || request.name || request.id}</h4>
                      <p className="text-sm text-on-surface-variant">Email: {request.email || 'N/A'}</p>
                    </div>

                    <div className="mb-6 rounded-xl bg-surface-container-lowest p-4">
                      <p className="text-xs font-semibold text-on-surface-variant mb-1">DETALLES DEL REGISTRO</p>
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">badge</span>
                        <span className="text-sm font-medium text-on-surface">ID: {request.memberId || request.id}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleApproveRequest(request.id)}
                        className="flex-1 rounded-full bg-primary py-2.5 font-label text-xs uppercase tracking-widest text-on-primary transition-opacity hover:opacity-90 font-bold"
                      >
                        Aprobar
                      </button>
                      <button 
                        onClick={() => handleRejectRequest(request.id)}
                        className="flex-1 rounded-full border border-error text-error py-2.5 font-label text-xs uppercase tracking-widest transition-colors hover:bg-error/5 font-bold"
                      >
                        Rechazar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>
        
        <nav className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-sm -translate-x-1/2 overflow-hidden rounded-[2rem] bg-surface-container-low shadow-[0_14px_35px_rgba(26,28,26,0.12)]">
          <div className="flex items-center justify-start gap-6 overflow-x-auto px-6 py-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style>{`.flex::-webkit-scrollbar { display: none; }`}</style>
            {[
              { label: 'Inicio', icon: 'dashboard', active: false, action: goToDashboard },
              { label: 'Misiones', icon: 'menu_book', active: false, action: goToMisiones },
              { label: 'Apolog.', icon: 'shield', active: true, action: goToApologetas },
              { label: 'Certif.', icon: 'workspace_premium', active: false, action: goToCertificados },
              { label: 'Sectas', icon: 'flare', active: false, action: goToSectas },
            ].map((item) => (
              <button key={item.label} onClick={item.action} className="flex min-w-[4rem] shrink-0 flex-col items-center gap-1">
                <span className={`material-symbols-outlined text-xl ${item.active ? 'text-primary' : 'text-on-surface-variant/50'}`}>
                  {item.icon}
                </span>
                <span className={`font-label text-[9px] uppercase tracking-[0.12em] ${item.active ? 'text-primary' : 'text-on-surface-variant/60'}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        <aside className="fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r border-primary/5 bg-surface-container-lowest px-4 py-8">
          <div className="mb-10 px-4">
            <div className="mb-8 flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full border border-primary/20">
                <img alt="Vatican Insignia" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsA9vxxIuSP7qNG1e99bXXi-5fFMtg83C45ejeEN0AP56SQTm_kmFT9-NJPL-fRJ9dbSzB7PXCHNEyeXrgzlBENs8oajQkFV5sVOnmPrG9IPtkmqYJF9tQMCtvqZFHACLprAUlENal-TockvP34u0U4NECCLbyBKv4EXczJ1pJxv8ArWR6jvKEifgjVOv0Xp1szkGrJPVApiKGw0gPYk6btrJBeovJwSundEl4zuc2JDbBVBE_mWCv7dkKRsOlAQtJoTuG54GL" />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="font-headline text-base font-bold leading-tight text-primary">{user.fullName || 'Usuario'}</h2>
                <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">{isAdmin ? 'Administrador' : 'Soldado'}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            <button onClick={goToDashboard} className="flex w-full items-center gap-4 rounded-l-full px-4 py-3 text-left text-on-surface opacity-60 transition-all hover:bg-primary/10 hover:opacity-100">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-label">Dashboard</span>
            </button>
            <button onClick={goToMisiones} className="flex w-full items-center gap-4 rounded-l-full px-4 py-3 text-left text-on-surface opacity-60 transition-all hover:bg-primary/10 hover:opacity-100">
              <span className="material-symbols-outlined">explore_nearby</span>
              <span className="font-label">Misiones</span>
            </button>
            <button onClick={goToApologetas} className="flex w-full items-center gap-4 rounded-l-full bg-primary/5 px-4 py-3 text-left font-bold text-primary transition-all">
              <span className="material-symbols-outlined">shield</span>
              <span className="font-label">Apologetas</span>
            </button>
            <button onClick={goToCertificados} className="flex w-full items-center gap-4 rounded-l-full px-4 py-3 text-left text-on-surface opacity-60 transition-all hover:bg-primary/10 hover:opacity-100">
              <span className="material-symbols-outlined">workspace_premium</span>
              <span className="font-label">Certificados</span>
            </button>
            <button onClick={goToSectas} className="flex w-full items-center gap-4 rounded-l-full px-4 py-3 text-left text-on-surface opacity-60 transition-all hover:bg-primary/10 hover:opacity-100">
              <span className="material-symbols-outlined">gavel</span>
              <span className="font-label">Sectas</span>
            </button>
          </nav>

          <div className="space-y-2 border-t border-primary/5 pt-6">
            <button onClick={handleLogout} className="flex w-full items-center gap-4 px-4 py-3 text-error opacity-80 transition-all hover:opacity-100">
              <span className="material-symbols-outlined">logout</span>
              <span className="font-label">Cerrar Sesion</span>
            </button>
          </div>
        </aside>

        <main className="ml-72 min-h-screen">
          <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-primary/5 bg-surface/80 px-12 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <button onClick={goToApologetas} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <div>
                <h1 className="font-headline text-2xl font-bold tracking-tight text-primary">Apologetas Pendientes</h1>
                <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant">Aprobación de Registro</p>
              </div>
            </div>
          </header>

          <div className="p-12 max-w-5xl mx-auto">
            {isLoadingRequests ? (
              <p className="text-sm text-on-surface-variant">Cargando solicitudes...</p>
            ) : reviewRequests.length === 0 ? (
              <div className="mt-6 rounded-2xl bg-surface-container-lowest p-12 text-center border border-outline-variant/10">
                <span className="material-symbols-outlined text-6xl text-primary/30">task_alt</span>
                <p className="mt-4 text-xl font-medium text-on-surface">No hay solicitudes pendientes</p>
                <p className="mt-2 text-on-surface-variant">Todos los certificados han sido revisados y no hay apologetas en espera.</p>
                <button 
                  onClick={goToApologetas}
                  className="mt-8 rounded-full bg-primary px-6 py-2 font-label text-xs uppercase tracking-widest text-on-primary"
                >
                  Volver a Apologetas
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {reviewRequests.map((request) => (
                  <article key={request.id} className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-[1.4rem] border border-outline-variant/20 bg-surface px-6 py-5 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="rounded-full bg-secondary/10 px-3 py-1 font-label text-[10px] uppercase tracking-widest text-secondary font-bold">
                          En revisión
                        </span>
                        <span className="text-xs text-on-surface-variant">{new Date(request.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-headline text-xl font-bold text-on-surface">{request.fullName || request.name || request.id}</h4>
                      <p className="text-sm text-on-surface-variant mt-1">Email: {request.email || 'N/A'}</p>
                    </div>

                    <div className="rounded-xl bg-surface-container-lowest p-4 md:min-w-[250px]">
                      <p className="text-xs font-semibold text-on-surface-variant mb-1">DETALLES DEL REGISTRO</p>
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">badge</span>
                        <span className="text-sm font-medium text-on-surface">ID: {request.memberId || request.id}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 md:flex-col lg:flex-row">
                      <button 
                        onClick={() => handleApproveRequest(request.id)}
                        className="flex-1 rounded-full bg-primary px-6 py-2.5 font-label text-xs uppercase tracking-widest text-on-primary transition-all hover:opacity-90 hover:shadow-md font-bold"
                      >
                        Aprobar
                      </button>
                      <button 
                        onClick={() => handleRejectRequest(request.id)}
                        className="flex-1 rounded-full border border-error text-error px-6 py-2.5 font-label text-xs uppercase tracking-widest transition-colors hover:bg-error/5 font-bold"
                      >
                        Rechazar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApologetasPendientes;