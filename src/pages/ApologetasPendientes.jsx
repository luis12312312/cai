import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApi } from '../api';

const ApologetasPendientes = () => {
  const navigate = useNavigate();
  const [reviewRequests, setReviewRequests] = useState([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  useEffect(() => {
    fetchReviewRequests();
  }, []);

  const fetchReviewRequests = async () => {
    setIsLoadingRequests(true);
    try {
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-2">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#cf5d67] font-semibold">Aprobación de Registro</p>
        <h1 className="cai-display text-3xl md:text-5xl text-white">
          Apologetas <span className="italic text-[#d8c08b]">Pendientes</span>
        </h1>
        <div className="h-0.5 w-16 bg-gradient-to-r from-[#cf5d67] to-[#d8c08b] mt-2"></div>
      </header>

      <p className="text-sm leading-relaxed text-white/70 max-w-2xl">
        Revisa las solicitudes de los aspirantes a apologetas. Valida sus credenciales y otórgales acceso al frente de batalla.
      </p>

      {isLoadingRequests ? (
        <div className="text-center py-10 text-white/50">Cargando solicitudes...</div>
      ) : reviewRequests.length === 0 ? (
        <div className="cai-panel rounded-2xl p-12 text-center border border-white/5">
          <span className="material-symbols-outlined text-6xl text-white/10 mb-4">task_alt</span>
          <p className="text-xl text-white">No hay solicitudes pendientes</p>
          <p className="mt-2 text-white/50 text-sm">Todos los certificados han sido revisados y no hay apologetas en espera.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {reviewRequests.map((request) => (
            <article key={request.id} className="cai-card flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-[1.4rem] border border-white/10 p-6 relative overflow-hidden group">
              <div className="flex-1 relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <span className="rounded-full bg-[#d8c08b]/10 border border-[#d8c08b]/20 px-3 py-1 text-[9px] uppercase tracking-widest text-[#d8c08b] font-bold">
                    En revisión
                  </span>
                  <span className="text-xs text-white/50">{new Date(request.createdAt).toLocaleDateString()}</span>
                </div>
                <h4 className="cai-display text-xl text-white">{request.fullName || request.name || request.id}</h4>
                <p className="text-xs text-white/50 mt-1 uppercase tracking-wider">Email: {request.email || 'N/A'}</p>
              </div>

              <div className="rounded-xl bg-black/40 border border-white/5 p-4 md:min-w-[250px] relative z-10">
                <p className="text-[9px] font-semibold text-[#cf5d67] uppercase tracking-widest mb-2">DETALLES DEL REGISTRO</p>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#d8c08b] text-lg">badge</span>
                  <span className="text-sm font-medium text-white/90">ID: {request.memberId || request.id}</span>
                </div>
              </div>

              <div className="flex gap-3 md:flex-col lg:flex-row relative z-10">
                <button 
                  onClick={() => handleApproveRequest(request.id)}
                  className="flex-1 rounded-full bg-[#d8c08b] px-6 py-2.5 text-[10px] uppercase tracking-widest text-[#04060b] transition-all hover:bg-white font-bold"
                >
                  Aprobar
                </button>
                <button 
                  onClick={() => handleRejectRequest(request.id)}
                  className="flex-1 rounded-full border border-[#cf5d67] text-[#cf5d67] px-6 py-2.5 text-[10px] uppercase tracking-widest transition-colors hover:bg-[#cf5d67]/10 font-bold"
                >
                  Rechazar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApologetasPendientes;