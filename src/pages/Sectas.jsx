import React, { useMemo, useState, useEffect } from 'react';
import { fetchApi } from '../api';

const initialForm = {
  sectName: '',
  locationDescription: '',
  referenceNote: '',
};

const Sectas = () => {
  const [sectasList, setSectasList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchSectas();
  }, []);

  const fetchSectas = async () => {
    setIsLoading(true);
    try {
      const [registryRes, reportsRes] = await Promise.all([
        fetchApi('/sect-registry?page=1&pageSize=50').catch(() => null),
        fetchApi('/sect-reports?page=1&pageSize=50').catch(() => null),
      ]);

      const approvedItems = registryRes?.items || [];
      const pendingItems = reportsRes?.items || [];
      
      const allItems = [...approvedItems, ...pendingItems];

      if (allItems.length > 0) {
        const mapped = allItems.map((item) => ({
          id: item.id,
          nombre: item.sectName,
          categoria: item.status === 'PENDING' ? 'Reporte Pendiente' : 'Secta Registrada',
          riesgo: item.status === 'PENDING' ? 'Evaluando' : 'Alto',
          zona: item.locationDescription,
          fecha: new Date(item.approvedAt || item.createdAt || Date.now()).toLocaleDateString(),
          estado: item.status === 'PENDING' ? 'En revisión' : 'Caso documentado',
          referente: item.status === 'PENDING' ? `Soldado ID: ${item.reportedByUserId}` : 'Equipo CAI',
          descripcion: item.referenceNote,
          senales: item.status === 'PENDING' ? ['Pendiente de validación'] : ['Reporte verificado'],
        }));
        setSectasList(mapped);
      } else {
        setSectasList([]);
      }
    } catch (error) {
      console.error('Error fetching sectas:', error);
      setSectasList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
    if (feedback.message) setFeedback({ type: '', message: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.sectName || !form.locationDescription || !form.referenceNote) {
      setFeedback({ type: 'error', message: 'Por favor completa todos los campos del reporte.' });
      return;
    }

    setIsSubmitting(true);
    try {
      await fetchApi('/sect-reports', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setFeedback({ type: 'success', message: 'Reporte de secta enviado correctamente. Queda en espera de aprobación.' });
      setForm(initialForm);
      fetchSectas();
    } catch (error) {
      setFeedback({ type: 'error', message: error.message || 'Error al enviar reporte' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resumenCasos = useMemo(() => {
    const abiertas = sectasList.filter((item) => item.estado !== 'Caso documentado').length;
    const referentes = new Set(sectasList.map((item) => item.referente)).size;

    return {
      detectadas: sectasList.length,
      abiertas,
      referentes,
    };
  }, [sectasList]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-2">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#cf5d67] font-semibold">Alertas Sectarias</p>
        <h1 className="cai-display text-3xl md:text-5xl text-white">
          Módulo de <span className="italic text-[#d8c08b]">Sectas</span>
        </h1>
        <div className="h-0.5 w-16 bg-gradient-to-r from-[#cf5d67] to-[#d8c08b] mt-2"></div>
      </header>

      <p className="text-sm leading-relaxed text-white/70 max-w-2xl">
        Monitoreo de grupos detectados, actividad registrada y acciones prioritarias para el equipo pastoral. Registro pastoral de grupos detectados y seguimiento para respuesta evangelizadora.
      </p>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <article className="cai-card rounded-2xl p-5 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <span className="material-symbols-outlined text-6xl text-[#cf5d67]">warning</span>
          </div>
          <p className="cai-display text-4xl text-[#cf5d67] relative z-10">{resumenCasos.detectadas}</p>
          <p className="mt-2 text-[10px] uppercase tracking-widest text-white/50 relative z-10">Sectas detectadas</p>
        </article>
        <article className="cai-card rounded-2xl p-5 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <span className="material-symbols-outlined text-6xl text-[#d8c08b]">pending_actions</span>
          </div>
          <p className="cai-display text-4xl text-[#d8c08b] relative z-10">{resumenCasos.abiertas}</p>
          <p className="mt-2 text-[10px] uppercase tracking-widest text-white/50 relative z-10">Casos abiertos</p>
        </article>
        <article className="cai-card rounded-2xl p-5 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <span className="material-symbols-outlined text-6xl text-[#d8c08b]">group</span>
          </div>
          <p className="cai-display text-4xl text-[#d8c08b] relative z-10">{resumenCasos.referentes}</p>
          <p className="mt-2 text-[10px] uppercase tracking-widest text-white/50 relative z-10">Referentes</p>
        </article>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)] gap-6">
        <article className="cai-panel rounded-[1.5rem] border border-white/5 p-6 h-fit sticky top-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#cf5d67]/10 text-[#cf5d67]">
              <span className="material-symbols-outlined">gavel</span>
            </div>
            <div>
              <h3 className="cai-display text-xl text-white">Reportar secta</h3>
              <p className="text-[10px] uppercase tracking-widest text-white/50 mt-1">Nueva alerta</p>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-[10px] uppercase tracking-widest text-[#cf5d67] font-semibold">Nombre de la secta</span>
              <input
                name="sectName"
                value={form.sectName}
                onChange={handleFieldChange('sectName')}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-[#d8c08b]/50 focus:ring-1 focus:ring-[#d8c08b]/30 placeholder:text-white/20"
                placeholder="Ej. Luz del Nuevo Pacto"
                type="text"
                required
              />
            </label>

            <label className="block">
              <span className="text-[10px] uppercase tracking-widest text-[#cf5d67] font-semibold">Ubicación / Zona</span>
              <input
                name="locationDescription"
                value={form.locationDescription}
                onChange={handleFieldChange('locationDescription')}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-[#d8c08b]/50 focus:ring-1 focus:ring-[#d8c08b]/30 placeholder:text-white/20"
                placeholder="Ej. Zona norte, Plaza principal"
                type="text"
                required
              />
            </label>

            <label className="block">
              <span className="text-[10px] uppercase tracking-widest text-[#cf5d67] font-semibold">Descripción y señales</span>
              <textarea
                name="referenceNote"
                value={form.referenceNote}
                onChange={handleFieldChange('referenceNote')}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-[#d8c08b]/50 focus:ring-1 focus:ring-[#d8c08b]/30 placeholder:text-white/20"
                placeholder="Ej. Realizan proselitismo..."
                rows={4}
                required
              />
            </label>

            {feedback.message && (
              <div
                className={`rounded-xl px-4 py-3 text-xs font-medium border ${
                  feedback.type === 'error'
                    ? 'bg-[#cf5d67]/10 text-[#cf5d67] border-[#cf5d67]/20'
                    : 'bg-[#d8c08b]/10 text-[#d8c08b] border-[#d8c08b]/20'
                }`}
              >
                {feedback.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-[#cf5d67] px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-white transition-all hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Reporte'}
            </button>
          </form>
        </article>

        <article className="space-y-6">
          {isLoading ? (
            <div className="text-center py-10 text-white/50 text-sm">Cargando registros...</div>
          ) : sectasList.length > 0 ? (
            sectasList.map((secta) => (
              <div key={secta.id} className="cai-card rounded-[1.5rem] border border-white/10 p-6 relative overflow-hidden group">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-bold mb-3 border ${secta.categoria === 'Reporte Pendiente' ? 'bg-[#cf5d67]/10 text-[#cf5d67] border-[#cf5d67]/20' : 'bg-[#d8c08b]/10 text-[#d8c08b] border-[#d8c08b]/20'}`}>
                      {secta.categoria}
                    </span>
                    <h3 className="cai-display text-2xl text-white group-hover:text-[#d8c08b] transition-colors">{secta.nombre}</h3>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-[#d8c08b]">
                    <span className="material-symbols-outlined">flare</span>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-white/70 mb-5">{secta.descripcion}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="rounded-full bg-black/40 border border-white/5 px-3 py-1 text-[10px] uppercase tracking-widest text-white/50">
                    <span className="material-symbols-outlined text-[10px] mr-1 align-middle">location_on</span>
                    {secta.zona}
                  </span>
                  <span className="rounded-full bg-black/40 border border-white/5 px-3 py-1 text-[10px] uppercase tracking-widest text-white/50">
                    <span className="material-symbols-outlined text-[10px] mr-1 align-middle">calendar_today</span>
                    {secta.fecha}
                  </span>
                </div>

                <div className="rounded-xl bg-white/5 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-[#cf5d67] font-semibold">Estado</p>
                    <p className="mt-1 text-sm font-medium text-white">{secta.estado}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-widest text-[#cf5d67] font-semibold">Referente</p>
                    <p className="mt-1 text-sm font-medium text-[#d8c08b]">{secta.referente}</p>
                  </div>
                </div>

                <div className="mt-5 border-t border-white/10 pt-5">
                  <p className="text-[9px] uppercase tracking-widest text-white/40 mb-3">Señales detectadas</p>
                  <div className="flex flex-wrap gap-2">
                    {secta.senales.map((senal) => (
                      <span
                        key={senal}
                        className="rounded-full bg-[#d8c08b]/10 border border-[#d8c08b]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#d8c08b]"
                      >
                        {senal}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="cai-panel rounded-[1.5rem] border border-white/5 p-10 text-center">
              <span className="material-symbols-outlined text-6xl text-white/10 mb-4">gavel</span>
              <p className="text-xl text-white">No hay sectas registradas</p>
              <p className="mt-2 text-white/50 text-sm">El archivo está vacío actualmente.</p>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

export default Sectas;