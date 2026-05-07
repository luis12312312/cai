import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApi } from '../api';
import { apologetas } from '../data/misionesData';

const initialForm = {
  titulo: '',
  tipo: 'Debate publico',
  lugar: '',
  fecha: '',
  evidencia: 'Fotos',
};

const buildMissionMediaSamples = (mision) => {
  const evidenciaTexto = (mision.evidencia || '').toLowerCase();
  const media = [
    {
      id: `${mision.id}-img-1`,
      type: 'image',
      title: 'Registro del encuentro',
      description: `Vista general de la mision en ${mision.lugar}.`,
      src: 'https://images.unsplash.com/photo-1519491050282-cf00c82424b4?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: `${mision.id}-img-2`,
      type: 'image',
      title: 'Participacion del equipo',
      description: 'Momento representativo del dialogo y acompanamiento pastoral.',
      src: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  if (evidenciaTexto.includes('video')) {
    media.push({
      id: `${mision.id}-video-1`,
      type: 'video',
      title: 'Clip de la mision',
      description: 'Video de ejemplo para previsualizar la evidencia audiovisual.',
      src: 'https://v.ftcdn.net/02/29/87/38/700_F_229873835_T267cpIinTDRj1XCOfPe7unkvbmqtR5C_ST.mp4',
      poster: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80',
    });
  }

  return media;
};

const buildMissionEvidenceDetails = (mision) => {
  const evidenciaTexto = (mision.evidencia || '').toLowerCase();
  const evidenciaItems = [];

  if (evidenciaTexto.includes('foto')) {
    evidenciaItems.push('Registro fotografico de la actividad');
  }

  if (evidenciaTexto.includes('video')) {
    evidenciaItems.push('Clips de video del desarrollo de la mision');
  }

  if (evidenciaTexto.includes('testimonio')) {
    evidenciaItems.push('Testimonios recogidos de los participantes');
  }

  if (evidenciaTexto.includes('presentacion')) {
    evidenciaItems.push('Presentacion utilizada durante la exposicion');
  }

  if (evidenciaTexto.includes('galeria')) {
    evidenciaItems.push('Galeria consolidada del evento pastoral');
  }

  if (evidenciaItems.length === 0) {
    evidenciaItems.push(`Soporte principal registrado: ${mision.evidencia}`);
  }

  return {
    ...mision,
    evidenciaItems,
    mediaSamples: buildMissionMediaSamples(mision),
    estado: 'Mision realizada',
    responsable: mision.nombresApologetas[0] || 'Equipo asignado',
    observaciones: `La actividad en ${mision.lugar} quedo documentada para consulta pastoral y seguimiento del equipo.`,
  };
};

const Misiones = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [misionesLocales, setMisionesLocales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMision, setSelectedMision] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'REGISTRADOR';

  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    fetchMissions();
    fetchPendingCount();
  }, []);

  const fetchPendingCount = async () => {
    try {
      const data = await fetchApi('/admin/users?role=SOLDADO_PENDING&page=1&pageSize=1');
      if (data && typeof data.total !== 'undefined') {
        setPendingCount(data.total);
      }
    } catch (err) {
      console.warn('Error fetching pending count', err);
    }
  };

  const fetchMissions = async () => {
    setIsLoading(true);
    try {
      const endpoint = isAdmin ? '/admin/missions?page=1&pageSize=50' : '/missions?page=1&pageSize=50';
      const data = await fetchApi(endpoint);
      if (data && data.items) {
        setMisionesLocales(data.items.map(m => ({
          id: m.id,
          titulo: m.title,
          tipo: m.missionType,
          lugar: m.description,
          fecha: new Date(m.publishedAt || m.createdAt || Date.now()).toLocaleDateString(),
          evidencia: 'Evidencia',
          resumen: m.description,
          apologetas: [],
          publicationState: m.publicationState
        })));
      }
    } catch (error) {
      console.error('Error fetching missions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (feedback.message) setFeedback({ type: '', message: '' });
  };

  const goToDashboard = () => navigate('/dashboard');
  const goToApologetas = () => navigate('/apologetas');
  const goToCertificados = () => navigate('/certificados');
  const goToMisiones = () => navigate('/misiones');
  const goToSectas = () => navigate('/sectas');
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    navigate('/login');
  };

  const misionesEnriquecidas = useMemo(
    () =>
      misionesLocales.map((mision) => ({
        ...mision,
        nombresApologetas: apologetas
          .filter((apologeta) => mision.apologetas.includes(apologeta.id))
          .map((apologeta) => apologeta.nombre),
      })),
    [misionesLocales],
  );


  const autoAssignMission = async (misionId) => {
    if (!evidenceFile) {
      alert("Por favor selecciona un archivo de evidencia antes de enviar.");
      return;
    }
    
    try {
      const fd = new FormData();
      fd.append('proof', evidenceFile);
      fd.append('submissionNote', 'Evidencia enviada desde la plataforma.');
      
      await fetchApi(`/missions/${misionId}/submissions`, {
        method: 'POST',
        body: fd
      });
      alert("Evidencia enviada correctamente.");
      setEvidenceFile(null);
      fetchMissions();
    } catch (error) {
      console.error('Error submitting evidence:', error);
      alert("Error al enviar evidencia: " + error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.titulo.trim() || !form.lugar.trim() || !form.fecha.trim()) {
      setFeedback({ type: 'error', message: 'Por favor completa todos los campos requeridos.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: '', message: '' });

    try {
      const payload = {
        title: form.titulo.trim(),
        description: `Lugar: ${form.lugar.trim()}. Fecha: ${form.fecha.trim()}. Evidencia: ${form.evidencia}`,
        missionType: 'OPERACIONAL',
        minimumRankCode: 'RECRUTA',
        genderEligibility: 'ALL',
      };
      
      const res = await fetchApi('/admin/missions', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      // Auto-publish for convenience
      if (res && res.id) {
        await fetchApi(`/admin/missions/${res.id}/publish`, {
          method: 'POST'
        });
      }

      fetchMissions();
      setForm(initialForm);
      setFeedback({ type: 'success', message: 'Misión creada y publicada correctamente.' });
    } catch (error) {
      console.error('Error creating mission:', error);
      setFeedback({ type: 'error', message: error.message || 'Error al crear la misión.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openMissionDetail = (mision) => {
    setSelectedMision(buildMissionEvidenceDetails(mision));
    setCurrentMediaIndex(0);
  };

  const closeMissionDetail = () => {
    setSelectedMision(null);
    setCurrentMediaIndex(0);
  };

  const showPreviousMedia = () => {
    if (!selectedMision?.mediaSamples?.length) {
      return;
    }

    setCurrentMediaIndex((current) =>
      current === 0 ? selectedMision.mediaSamples.length - 1 : current - 1,
    );
  };

  const showNextMedia = () => {
    if (!selectedMision?.mediaSamples?.length) {
      return;
    }

    setCurrentMediaIndex((current) =>
      current === selectedMision.mediaSamples.length - 1 ? 0 : current + 1,
    );
  };

  const renderMissionCard = (mision) => (
    <article key={mision.id} className="cai-card rounded-2xl p-5 border border-white/5 relative overflow-hidden group">
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div>
          <h3 className="cai-display text-2xl text-white group-hover:text-[#d8c08b] transition-colors">{mision.titulo}</h3>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-[#cf5d67]">{mision.tipo}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#d8c08b]">
          <span className="material-symbols-outlined text-xl">map</span>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-white/70 relative z-10">{mision.resumen}</p>

      <div className="mt-4 flex flex-wrap gap-2 relative z-10">
        <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[9px] uppercase tracking-widest text-white/60">
          {mision.lugar}
        </span>
        <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[9px] uppercase tracking-widest text-white/60">
          {mision.fecha}
        </span>
        <span className="rounded-full border border-[#d8c08b]/20 bg-[#d8c08b]/10 px-3 py-1 text-[9px] uppercase tracking-widest text-[#d8c08b]">
          {mision.evidencia}
        </span>
      </div>

      <div className="mt-5 relative z-10">
        <p className="text-[9px] uppercase tracking-widest text-white/40">Apologetas asignados</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {mision.nombresApologetas.map((nombre) => (
            <span key={nombre} className="rounded-full bg-white/5 px-3 py-1 text-[9px] uppercase tracking-widest text-white/80">
              {nombre}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 relative z-10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openMissionDetail(mision)}
            className="rounded-full border border-[#d8c08b]/30 px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-[#d8c08b] transition-colors hover:bg-[#d8c08b]/10"
          >
            Ver evidencias
          </button>
          {!isAdmin && (
            <div className="flex items-center gap-2 ml-2">
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setEvidenceFile(e.target.files[0])} 
                className="text-[10px] text-white/50 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:uppercase file:tracking-widest file:bg-white/5 file:text-white/80"
              />
              <button
                type="button"
                onClick={() => autoAssignMission(mision.id)}
                className="cai-button-primary rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                title="Asignarse a esta misión subiendo la evidencia"
              >
                Reportar
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );

  const renderMissionDetail = () => {
    if (!selectedMision) {
      return null;
    }

    const currentMedia = selectedMision.mediaSamples[currentMediaIndex];

    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 md:items-center md:p-8">
        <div
          className="absolute inset-0"
          aria-hidden="true"
          onClick={closeMissionDetail}
        ></div>
        <section className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-surface-container-low p-6 shadow-[0_20px_60px_rgba(26,28,26,0.22)] md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-label text-[10px] uppercase tracking-[0.24em] text-secondary">{selectedMision.estado}</p>
              <h2 className="mt-3 font-headline text-4xl leading-[0.98] text-on-surface">{selectedMision.titulo}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant">{selectedMision.resumen}</p>
            </div>
            <button
              type="button"
              onClick={closeMissionDetail}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-container-lowest text-primary"
              aria-label="Cerrar detalle de la mision"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            <article className="rounded-2xl bg-surface-container-lowest p-4">
              <p className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Lugar</p>
              <p className="mt-2 text-sm font-semibold text-on-surface">{selectedMision.lugar}</p>
            </article>
            <article className="rounded-2xl bg-surface-container-lowest p-4">
              <p className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Fecha</p>
              <p className="mt-2 text-sm font-semibold text-on-surface">{selectedMision.fecha}</p>
            </article>
            <article className="rounded-2xl bg-surface-container-lowest p-4">
              <p className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Evidencia</p>
              <p className="mt-2 text-sm font-semibold text-on-surface">{selectedMision.evidencia}</p>
            </article>
            <article className="rounded-2xl bg-surface-container-lowest p-4">
              <p className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Responsable</p>
              <p className="mt-2 text-sm font-semibold text-on-surface">{selectedMision.responsable}</p>
            </article>
          </div>

          <div className="mt-6 rounded-[1.6rem] bg-surface-container-lowest p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">Carrusel de evidencias</p>
                <p className="mt-2 text-sm leading-6 text-on-surface-variant">Contenido de ejemplo para ilustrar imagenes y video de la mision.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={showPreviousMedia}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/30 text-primary"
                  aria-label="Evidencia anterior"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button
                  type="button"
                  onClick={showNextMedia}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/30 text-primary"
                  aria-label="Siguiente evidencia"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-[1.4rem] bg-surface">
              {currentMedia.type === 'video' ? (
                <video className="h-[320px] w-full bg-black object-cover md:h-[420px]" controls poster={currentMedia.poster}>
                  <source src={currentMedia.src} type="video/mp4" />
                </video>
              ) : (
                <img alt={currentMedia.title} className="h-[320px] w-full object-cover md:h-[420px]" src={currentMedia.src} />
              )}
            </div>

            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-on-surface">{currentMedia.title}</p>
                <p className="mt-1 text-sm leading-6 text-on-surface-variant">{currentMedia.description}</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 font-label text-[10px] uppercase tracking-[0.16em] text-primary">
                {currentMedia.type === 'video' ? 'Video' : 'Imagen'}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {selectedMision.mediaSamples.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentMediaIndex(index)}
                  className={`rounded-full px-3 py-1 font-label text-[10px] uppercase tracking-[0.16em] ${
                    index === currentMediaIndex ? 'bg-primary text-white' : 'bg-surface text-on-surface-variant'
                  }`}
                >
                  {item.type === 'video' ? `Video ${index + 1}` : `Imagen ${index + 1}`}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="rounded-[1.5rem] bg-surface-container-lowest p-5">
              <p className="font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">Detalle de evidencias</p>
              <div className="mt-4 space-y-3">
                {selectedMision.evidenciaItems.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-primary/5 px-4 py-3">
                    <span className="material-symbols-outlined text-primary">task_alt</span>
                    <p className="text-sm leading-6 text-on-surface">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-outline-variant/20 bg-surface px-4 py-4">
                <p className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Observaciones</p>
                <p className="mt-2 text-sm leading-6 text-on-surface-variant">{selectedMision.observaciones}</p>
              </div>
            </div>

            <div className="space-y-4">
              <article className="rounded-[1.5rem] bg-surface-container-lowest p-5">
                <p className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Apologetas participantes</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedMision.nombresApologetas.map((nombre) => (
                    <span key={nombre} className="rounded-full bg-primary/10 px-3 py-1 font-label text-[10px] uppercase tracking-[0.16em] text-primary">
                      {nombre}
                    </span>
                  ))}
                </div>
              </article>

              <article className="rounded-[1.5rem] bg-surface-container-lowest p-5">
                <p className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Resumen rapido</p>
                <div className="mt-4 space-y-3 text-sm text-on-surface-variant">
                  <div className="flex items-center justify-between gap-3">
                    <span>Tipo de mision</span>
                    <span className="font-semibold text-on-surface">{selectedMision.tipo}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Estado</span>
                    <span className="font-semibold text-primary">{selectedMision.estado}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Participantes</span>
                    <span className="font-semibold text-on-surface">{selectedMision.nombresApologetas.length}</span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
      </div>
    );
  };

  const renderForm = (compact = false) => (
    <form
      onSubmit={handleSubmit}
      className={`rounded-[1.7rem] bg-surface-container-low p-5 shadow-[0_10px_30px_rgba(26,28,26,0.05)] ${compact ? '' : 'sticky top-24'}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-label text-[10px] uppercase tracking-[0.28em] text-secondary">NUEVA MISION</p>
          <h2 className="mt-3 font-headline text-4xl leading-[0.98] text-on-surface">Registrar mision</h2>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <span className="material-symbols-outlined">add_task</span>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Titulo</span>
          <input
            name="titulo"
            value={form.titulo}
            onChange={onInputChange}
            className="mt-2 w-full rounded-2xl border-none bg-surface-container-lowest px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/30"
            placeholder="Ej. Debate con pastor"
            type="text"
          />
        </label>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block">
            <span className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Tipo</span>
            <select
              name="tipo"
              value={form.tipo}
              onChange={onInputChange}
              className="mt-2 w-full rounded-2xl border-none bg-surface-container-lowest px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/30"
            >
              <option>Debate publico</option>
              <option>Predica casa por casa</option>
              <option>Conferencia</option>
              <option>Formacion</option>
              <option>Evangelizacion territorial</option>
            </select>
          </label>

          <label className="block">
            <span className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Evidencia</span>
            <select
              name="evidencia"
              value={form.evidencia}
              onChange={onInputChange}
              className="mt-2 w-full rounded-2xl border-none bg-surface-container-lowest px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/30"
            >
              <option>Fotos</option>
              <option>Videos</option>
              <option>Fotos y video</option>
              <option>Testimonios</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="block">
            <span className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Lugar de mision</span>
            <input
              name="lugar"
              value={form.lugar}
              onChange={onInputChange}
              className="mt-2 w-full rounded-2xl border-none bg-surface-container-lowest px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/30"
              placeholder="Ej. Parroquia San Jose"
              type="text"
            />
          </label>

          <label className="block">
            <span className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Fecha</span>
            <input
              name="fecha"
              value={form.fecha}
              onChange={onInputChange}
              className="mt-2 w-full rounded-2xl border-none bg-surface-container-lowest px-4 py-3 text-sm text-on-surface focus:ring-1 focus:ring-primary/30"
              placeholder="Ej. 18 de abril"
              type="text"
            />
          </label>
        </div>
      </div>

      {feedback.message && (
        <div className={`mt-4 rounded-2xl px-4 py-3 text-sm ${feedback.type === 'error' ? 'bg-error/10 text-error' : 'bg-[#2e7d32]/10 text-[#2e7d32]'}`}>
          {feedback.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-2xl bg-primary px-5 py-4 font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_12px_30px_rgba(113,89,24,0.25)] disabled:opacity-50"
      >
        {isSubmitting ? 'Guardando...' : 'Guardar mision'}
      </button>
    </form>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {renderMissionDetail()}
      <header className="flex flex-col gap-2">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#cf5d67] font-semibold">Misiones Activas</p>
        <h1 className="cai-display text-3xl md:text-5xl text-white">
          Módulo de <span className="italic text-[#d8c08b]">Misiones</span>
        </h1>
        <div className="h-0.5 w-16 bg-gradient-to-r from-[#cf5d67] to-[#d8c08b] mt-2"></div>
      </header>

      <p className="text-sm leading-relaxed text-white/70 max-w-2xl">
        Administra las misiones, registra nuevas salidas y asigna varios apologetas en un mismo frente pastoral.
      </p>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <article className="cai-card rounded-2xl p-5 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <span className="material-symbols-outlined text-6xl text-[#d8c08b]">explore_nearby</span>
          </div>
          <p className="cai-display text-3xl text-[#d8c08b] relative z-10">{misionesLocales.length}</p>
          <p className="mt-1 text-[9px] uppercase tracking-widest text-white/50 relative z-10">Total Misiones</p>
        </article>
        <article className="cai-card rounded-2xl p-5 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <span className="material-symbols-outlined text-6xl text-[#d8c08b]">shield</span>
          </div>
          <p className="cai-display text-3xl text-[#d8c08b] relative z-10">{apologetas.length}</p>
          <p className="mt-1 text-[9px] uppercase tracking-widest text-white/50 relative z-10">Apologetas</p>
        </article>
      </section>

      {isAdmin && (
        <section className="mt-6">
          {renderForm(true)}
        </section>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {misionesEnriquecidas.map((mision) => renderMissionCard(mision))}
      </section>
    </div>
  );
};

export default Misiones;
