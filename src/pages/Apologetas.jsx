import React, { useState, useEffect } from 'react';
import { fetchApi } from '../api';
import { loadApologetas } from '../data/loadApologetas';
import {
  filtrosApologetas,
  ordenesApologetas,
  resumenApologetas,
} from '../data/misionesData';

const Apologetas = () => {
  const [apologetasList, setApologetasList] = useState([]);
  const [totalMisiones, setTotalMisiones] = useState(null);
  const [isLoadingApologetas, setIsLoadingApologetas] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [hasPartialError, setHasPartialError] = useState(false);

  useEffect(() => {
    fetchApologetas();
  }, []);

  const fetchApologetas = async () => {
    setIsLoadingApologetas(true);
    setLoadError('');
    setHasPartialError(false);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'REGISTRADOR';
      
      const data = await loadApologetas(fetchApi, isAdmin);
      const rankCatalog = data.ranks;
      
      let mapped = [];
      const arrayData = data.items;
      
      if (arrayData && arrayData.length > 0) {
        const iconOptions = ['shield', 'menu_book', 'history_edu', 'flare', 'psychology', 'favorite'];
        const colorOptions = ['text-[#d8c08b]', 'text-[#cf5d67]', 'text-white'];
        const bgOptions = ['bg-[#d8c08b]/10', 'bg-[#cf5d67]/10', 'bg-white/10'];
        const especialidadOptions = ['Apologética Bíblica', 'Doctrina Católica', 'Historia de la Iglesia', 'Sectas y Nuevos Movimientos', 'Filosofía Cristiana', 'Familia y Bioética'];
        
        mapped = arrayData.map((item, index) => ({
          id: item.userId || item.id || `soldado-${index}`,
          nombre: item.fullName || item.name || item.userName || `Soldado ${String(item.userId || item.id).substring(0,4)}`,
          especialidad: especialidadOptions[index % especialidadOptions.length],
          grado: rankCatalog.find(r => r.code === item.rankCode)?.name || item.rankCode?.replaceAll('_', ' ') || 'Sin rango informado',
          descripcion: 'Apologeta de la plataforma CAI, activo en la red de defensores de la fe.',
          etiqueta: item.profile?.reserve ? 'Reserva' : 'Activo',
          icono: iconOptions[index % iconOptions.length],
          color: colorOptions[index % colorOptions.length],
          fondo: bgOptions[index % bgOptions.length],
        }));
      }

      setApologetasList(mapped);
      setTotalMisiones(data.totalMisiones);
      setHasPartialError(data.hasPartialError);
    } catch (error) {
      console.error('Error fetching apologetas:', error);
      setApologetasList([]);
      setTotalMisiones(null);
      setLoadError(error.message || 'No se pudo obtener el listado del servidor.');
    } finally {
      setIsLoadingApologetas(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-2">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#cf5d67] font-semibold">Defensores Fidei</p>
        <h1 className="cai-display text-3xl md:text-5xl text-white">
          Módulo de <span className="italic text-[#d8c08b]">Apologetas</span>
        </h1>
        <div className="h-0.5 w-16 bg-gradient-to-r from-[#cf5d67] to-[#d8c08b] mt-2"></div>
      </header>

      <p className="text-sm leading-relaxed text-white/70 max-w-2xl">
        Custodios de la tradición y la razón. Una asamblea de servidores dedicados a la defensa intelectual y espiritual del magisterio.
      </p>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {resumenApologetas.map((item, index) => {
          let valor = item.valor;
          if (index === 0) valor = isLoadingApologetas || loadError ? '—' : apologetasList.length;
          if (index === 1) valor = isLoadingApologetas ? '—' : totalMisiones ?? '—';
          
          return (
            <article key={item.etiqueta} className="cai-card rounded-2xl p-5 border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <span className="material-symbols-outlined text-6xl text-[#d8c08b]">
                  {index === 0 ? 'shield' : index === 1 ? 'explore_nearby' : index === 2 ? 'workspace_premium' : 'menu_book'}
                </span>
              </div>
              <p className="cai-display text-4xl text-[#d8c08b] relative z-10">{valor}</p>
              <p className="mt-2 text-[10px] uppercase tracking-widest text-white/50 relative z-10">{item.etiqueta}</p>
            </article>
          );
        })}
      </section>

      <section className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full flex items-center justify-between rounded-2xl bg-black/40 border border-white/10 px-6 py-4">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-[#d8c08b]">filter_alt</span>
            <span className="text-sm font-medium text-white">{filtrosApologetas[0]}</span>
          </div>
          <span className="material-symbols-outlined text-white/50">expand_more</span>
        </div>
        <div className="flex-1 w-full flex items-center justify-between rounded-2xl bg-black/40 border border-white/10 px-6 py-4">
          <span className="text-sm text-white/50">Ordenar por</span>
          <div className="flex items-center gap-2 text-sm font-semibold text-[#d8c08b]">
            <span>{ordenesApologetas[0]}</span>
            <span className="material-symbols-outlined text-base">expand_more</span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {hasPartialError && !isLoadingApologetas && (
          <p role="status" className="text-sm text-[#d8c08b]">
            El listado está disponible, pero no se pudieron cargar todos los rangos o el total de misiones.
          </p>
        )}
        {isLoadingApologetas ? (
          <div className="text-center py-10 text-white/50 text-sm">Cargando soldados...</div>
        ) : loadError ? (
          <div role="alert" className="cai-panel rounded-[1.5rem] border border-[#cf5d67]/30 p-10 text-center">
            <p className="text-xl text-white">No se pudo cargar el listado de apologetas</p>
            <p className="mt-2 text-white/70 text-sm">{loadError}</p>
            <button onClick={fetchApologetas} className="mt-4 rounded-xl border border-[#d8c08b]/30 px-5 py-2 text-sm text-[#d8c08b]">
              Reintentar
            </button>
          </div>
        ) : apologetasList.length === 0 ? (
          <div className="cai-panel rounded-[1.5rem] border border-white/5 p-10 text-center">
            <span className="material-symbols-outlined text-6xl text-white/10 mb-4">group_off</span>
            <p className="text-xl text-white">No se encontraron soldados registrados</p>
            <p className="mt-2 text-white/50 text-sm">El directorio de apologetas está vacío actualmente.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {apologetasList.map((apologeta) => (
              <article
                key={apologeta.id}
                className="cai-card flex flex-col justify-between rounded-[1.6rem] border border-white/10 p-6 relative overflow-hidden group"
              >
                <div className="flex items-start justify-between gap-5 mb-6">
                  <div>
                    <h3 className="cai-display text-2xl text-white group-hover:text-[#d8c08b] transition-colors">{apologeta.nombre}</h3>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-[#cf5d67]">{apologeta.especialidad}</p>
                    <span className="mt-3 inline-flex rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[9px] uppercase tracking-widest text-white/70">
                      {apologeta.grado}
                    </span>
                  </div>
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${apologeta.fondo} ${apologeta.color} border border-white/5`}>
                    <span className="material-symbols-outlined text-2xl">{apologeta.icono}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm leading-relaxed text-white/60">{apologeta.descripcion}</p>
                  <div className="mt-5 border-t border-white/10 pt-5 flex items-center justify-between">
                    <span className="inline-flex rounded-full bg-[#d8c08b]/10 border border-[#d8c08b]/20 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-[#d8c08b]">
                      {apologeta.etiqueta}
                    </span>
                    <button className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors flex items-center gap-1 font-semibold">
                      Ver Perfil <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {apologetasList.length > 0 && (
        <section className="flex justify-center pt-4">
          <div className="flex items-center gap-8 rounded-full bg-black/40 border border-white/10 px-8 py-3">
            <button className="text-[#d8c08b] hover:text-white transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span className="text-[10px] uppercase tracking-widest font-semibold text-white/70">Página 1 de 1</span>
            <button className="text-[#d8c08b] hover:text-white transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Apologetas;
