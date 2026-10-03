import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApi, logout } from '../api';
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
  const [uploadMission, setUploadMission] = useState(null);
  const [busyMissions, setBusyMissions] = useState({});
  const [missionFeedback, setMissionFeedback] = useState({});
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
    if (!isAdmin) return;
    try {
      const data = await fetchApi('users.list', { data: { role: 'SOLDADO_PENDING', page: 1, pageSize: 1 } });
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
      const data = await fetchApi('missions.list', { data: { page: 1, pageSize: 50 } });
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
          publicationState: m.publicationState,
          assignmentStatus: m.myAssignment?.status || null,
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
    logout();
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
    setBusyMissions(current => ({ ...current, [misionId]: true }));
    setMissionFeedback(current => ({ ...current, [misionId]: null }));
    try {
      const assignment = await fetchApi('missions.assign', { data: { id: misionId } });
      setMisionesLocales(current => current.map(mision => mision.id === misionId ? { ...mision, assignmentStatus: assignment.status } : mision));
      await fetchMissions();
      setMissionFeedback(current => ({ ...current, [misionId]: { type: 'success', message: 'Misión asignada. Puedes subir la evidencia cuando termines.' } }));
    } catch (error) {
      setMissionFeedback(current => ({ ...current, [misionId]: { type: 'error', message: error.message } }));
    } finally {
      setBusyMissions(current => ({ ...current, [misionId]: false }));
    }
  };

  const openEvidenceUpload = (mision) => {
    setUploadMission(mision);
    setEvidenceFile(null);
    setMissionFeedback(current => ({ ...current, [mision.id]: null }));
  };

  const submitEvidence = async (event) => {
    event.preventDefault();
    if (!uploadMission || !evidenceFile) return;
    const misionId = uploadMission.id;
    setBusyMissions(current => ({ ...current, [misionId]: true }));
    setMissionFeedback(current => ({ ...current, [misionId]: null }));
    try {
      await fetchApi('submissions.create', {
        data: { missionId: misionId, submissionNote: 'Evidencia enviada desde la plataforma.' },
        file: evidenceFile,
      });
      setEvidenceFile(null);
      setUploadMission(null);
      setMisionesLocales(current => current.map(mision => mision.id === misionId ? { ...mision, assignmentStatus: 'PENDING' } : mision));
      await fetchMissions();
      setMissionFeedback(current => ({ ...current, [misionId]: { type: 'success', message: 'Evidencia enviada para revisión.' } }));
    } catch (error) {
      setMissionFeedback(current => ({ ...current, [misionId]: { type: 'error', message: error.message } }));
    } finally {
      setBusyMissions(current => ({ ...current, [misionId]: false }));
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
      
      const res = await fetchApi('missions.create', {
        data: payload,
      });
      
      // Auto-publish for convenience
      if (res && res.id) {
        await fetchApi('missions.publish', { data: { id: res.id } });
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
    if (!isAdmin) return;
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
    <article key={mision.id} className="cai-card min-w-0 rounded-2xl p-5 border border-white/5 relative overflow-hidden group">
      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="min-w-0">
          <h3 className="cai-display break-words text-2xl text-white group-hover:text-[#d8c08b] transition-colors">{mision.titulo}</h3>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-[#cf5d67]">{mision.tipo}</p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-[#d8c08b]">
          <span className="material-symbols-outlined text-xl">map</span>
        </div>
      </div>

      <p className="mt-4 break-words text-sm leading-relaxed text-white/70 relative z-10">{mision.resumen}</p>

      <div className="mt-4 flex flex-wrap gap-2 relative z-10">
        <span className="max-w-full break-words rounded-2xl border border-white/10 bg-black/40 px-3 py-1 text-[9px] uppercase tracking-widest text-white/60">
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

      <div className="mt-6 grid min-w-0 gap-3 border-t border-white/10 pt-4 relative z-10">
        {isAdmin ? (
          <button
            type="button"
            onClick={() => openMissionDetail(mision)}
            className="w-full max-w-full whitespace-normal break-words rounded-2xl border border-[#d8c08b]/30 px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-[#d8c08b] transition-colors hover:bg-[#d8c08b]/10"
          >
            Ver evidencias
          </button>
        ) : !mision.assignmentStatus ? (
              <button
                type="button"
                onClick={() => autoAssignMission(mision.id)}
                disabled={busyMissions[mision.id]}
                className="cai-button-primary w-full max-w-full whitespace-normal break-words rounded-2xl px-4 py-3 text-[10px] font-semibold uppercase tracking-widest leading-relaxed text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {busyMissions[mision.id] ? 'Asignando...' : 'Asignarme esta misión'}
              </button>
        ) : (
          <>
            <p className="break-words text-xs leading-relaxed text-[#d8c08b]">
              {mision.assignmentStatus === 'PENDING' ? 'Evidencia enviada · En revisión' :
               mision.assignmentStatus === 'APPROVED' ? 'Misión completada' :
               mision.assignmentStatus === 'REJECTED' ? 'Evidencia rechazada · Puedes volver a enviarla' :
               'Asignada a ti · Sube la evidencia cuando termines'}
            </p>
            {['ASSIGNED', 'REJECTED'].includes(mision.assignmentStatus) && (
              <button type="button" onClick={() => openEvidenceUpload(mision)} disabled={busyMissions[mision.id]}
                className="w-full max-w-full whitespace-normal break-words rounded-2xl border border-[#d8c08b]/30 px-4 py-3 text-[10px] font-semibold uppercase tracking-widest leading-relaxed text-[#d8c08b] hover:bg-[#d8c08b]/10 disabled:opacity-50">
                {mision.assignmentStatus === 'REJECTED' ? 'Volver a enviar evidencia' : 'Subir evidencia'}
              </button>
            )}
          </>
        )}
        {missionFeedback[mision.id] && (
          <p role="status" className={`break-words text-xs leading-relaxed ${missionFeedback[mision.id].type === 'error' ? 'text-[#cf5d67]' : 'text-white/70'}`}>
            {missionFeedback[mision.id].message}
          </p>
        )}
      </div>
    </article>
  );

  const renderMissionDetail = () => {
    if (!isAdmin || !selectedMision) {
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
      {!isAdmin && uploadMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <button type="button" className="absolute inset-0" aria-label="Cerrar subida de evidencia"
            disabled={busyMissions[uploadMission.id]} onClick={() => { setUploadMission(null); setEvidenceFile(null); }} />
          <form onSubmit={submitEvidence} role="dialog" aria-modal="true" aria-labelledby="upload-evidence-title"
            className="cai-card relative z-10 max-h-[90vh] w-full min-w-0 max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#04060b] p-5 sm:p-7">
            <h2 id="upload-evidence-title" className="cai-display break-words text-2xl text-white">Subir evidencia</h2>
            <p className="mt-2 break-words text-sm text-white/70">{uploadMission.titulo}</p>
            <p className="mt-3 text-xs leading-relaxed text-white/50">Tu misión ya está asignada. Envía el archivo cuando hayas terminado; el equipo administrador lo revisará.</p>
            <label className="mt-5 block min-w-0">
              <span className="text-xs text-[#d8c08b]">Archivo de evidencia</span>
              <input type="file" required autoFocus accept=".jpg,.jpeg,.png,.webp,.gif,.pdf" disabled={busyMissions[uploadMission.id]}
                onChange={event => setEvidenceFile(event.target.files?.[0] || null)}
                className="mt-2 block w-full min-w-0 max-w-full text-xs text-white/70 file:mr-2 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:text-white" />
            </label>
            <p className="mt-2 text-xs text-white/40">JPG, PNG, WebP, GIF o PDF. Máximo 5 MB.</p>
            {missionFeedback[uploadMission.id]?.type === 'error' && (
              <p role="alert" className="mt-4 break-words text-sm text-[#cf5d67]">{missionFeedback[uploadMission.id].message}</p>
            )}
            <div className="mt-6 grid min-w-0 gap-3 sm:grid-cols-2">
              <button type="button" disabled={busyMissions[uploadMission.id]} onClick={() => { setUploadMission(null); setEvidenceFile(null); }}
                className="w-full whitespace-normal rounded-2xl border border-white/20 px-4 py-3 text-xs text-white disabled:opacity-50">Subir después</button>
              <button type="submit" disabled={!evidenceFile || busyMissions[uploadMission.id]}
                className="cai-button-primary w-full whitespace-normal rounded-2xl px-4 py-3 text-xs text-white disabled:opacity-50">
                {busyMissions[uploadMission.id] ? 'Enviando...' : 'Enviar evidencia'}
              </button>
            </div>
          </form>
        </div>
      )}
      <header className="flex flex-col gap-2">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#cf5d67] font-semibold">Misiones Activas</p>
        <h1 className="cai-display text-3xl md:text-5xl text-white">
          Módulo de <span className="italic text-[#d8c08b]">Misiones</span>
        </h1>
        <div className="h-0.5 w-16 bg-gradient-to-r from-[#cf5d67] to-[#d8c08b] mt-2"></div>
      </header>

      <p className="text-sm leading-relaxed text-white/70 max-w-2xl">
        {isAdmin ? 'Administra las misiones, registra nuevas salidas y revisa las evidencias del equipo.' : 'Asígnate una misión y sube tu evidencia cuando la hayas completado.'}
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
