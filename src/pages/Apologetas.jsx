import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApi } from '../api';
import {
  apologetas,
  filtrosApologetas,
  misiones,
  ordenesApologetas,
  resumenApologetas,
} from '../data/misionesData';

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

const buildMissionEvidenceDetails = (mision, apologetaNombre) => {
  const evidenciaTexto = (mision.evidencia || '').toLowerCase();
  const evidenciaItems = [];

  if (evidenciaTexto.includes('foto')) {
    evidenciaItems.push('Registro fotografico de la actividad');
  }

  if (evidenciaTexto.includes('video')) {
    evidenciaItems.push('Clips de video del desarrollo de la mision');
  }

  if (evidenciaTexto.includes('testimonio')) {
    evidenciaItems.push('Testimonios recogidos durante la jornada');
  }

  if (evidenciaTexto.includes('presentacion')) {
    evidenciaItems.push('Presentacion empleada en la sesion formativa');
  }

  if (evidenciaTexto.includes('galeria')) {
    evidenciaItems.push('Galeria fotografica consolidada del evento');
  }

  if (evidenciaItems.length === 0) {
    evidenciaItems.push(`Soporte principal registrado: ${mision.evidencia}`);
  }

  return {
    ...mision,
    evidenciaItems,
    mediaSamples: buildMissionMediaSamples(mision),
    estado: 'Mision realizada',
    responsable: apologetaNombre,
    observaciones: `La evidencia de ${mision.titulo} quedo asociada al seguimiento pastoral de ${apologetaNombre}.`,
  };
};

const initialCertificates = [
  {
    id: 'cert-ap-001',
    identifier: 'AP-001',
    normalizedIdentifier: 'ap-001',
    name: 'Certificado de Formacion Inicial',
    fileName: 'formacion-inicial.pdf',
    sizeLabel: '420 KB',
    uploadedAt: '25/04/2026',
    status: 'Vigente',
  },
  {
    id: 'cert-ap-002',
    identifier: 'AP-002',
    normalizedIdentifier: 'ap-002',
    name: 'Constancia de Actualizacion Doctrinal',
    fileName: 'actualizacion-doctrinal.pdf',
    sizeLabel: '368 KB',
    uploadedAt: '19/04/2026',
    status: 'Vigente',
  },
];

const formatCertificateDate = () => {
  const today = new Date();
  const day = `${today.getDate()}`.padStart(2, '0');
  const month = `${today.getMonth() + 1}`.padStart(2, '0');
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
};

const Apologetas = () => {
  const navigate = useNavigate();
  const [apologetasList, setApologetasList] = useState([]);
  const [isLoadingApologetas, setIsLoadingApologetas] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [selectedMission, setSelectedMission] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [certificates, setCertificates] = useState(initialCertificates);
  const [certificateForm, setCertificateForm] = useState({
    identifier: '',
    name: '',
    file: null,
  });
  const [certificateFeedback, setCertificateFeedback] = useState({
    type: '',
    message: '',
  });
  const [certificateFileInputKey, setCertificateFileInputKey] = useState(0);

  const [reviewRequests, setReviewRequests] = useState([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  useEffect(() => {
    fetchReviewRequests();
    fetchApologetas();
  }, []);

  const fetchApologetas = async () => {
    setIsLoadingApologetas(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'REGISTRADOR';
      
      let data = null;
      
      if (isAdmin) {
        try {
          data = await fetchApi('/admin/users?role=SOLDADO_ACTIVE&page=1&pageSize=50');
        } catch (err) {
          console.warn('Error fetching /admin/users for admin', err);
        }
      }
      
      if (!data && !isAdmin) {
        try {
          data = await fetchApi('/friends?page=1&pageSize=50');
        } catch (err) {
          console.warn('Error fetching /friends', err);
        }
      }
      
      // Mapeamos los datos obtenidos
      let mapped = [];
      const arrayData = data?.items || [];
      
      if (arrayData && arrayData.length > 0) {
        const iconOptions = ['shield', 'menu_book', 'history_edu', 'flare', 'psychology', 'favorite'];
        const colorOptions = ['text-primary', 'text-secondary', 'text-error'];
        const bgOptions = ['bg-primary/10', 'bg-secondary/10', 'bg-error/10'];
        const especialidadOptions = ['Apologetica Biblica', 'Doctrina Catolica', 'Historia de la Iglesia', 'Sectas y Nuevos Movimientos', 'Filosofia Cristiana', 'Familia y Bioetica'];
        
        mapped = arrayData.map((item, index) => ({
          id: item.userId || item.id || `soldado-${index}`,
          nombre: item.fullName || item.name || item.userName || `Soldado ${String(item.userId || item.id).substring(0,4)}`,
          especialidad: especialidadOptions[index % especialidadOptions.length],
          grado: item.rankCode || item.memberId || 'RECRUTA',
          descripcion: 'Apologeta de la plataforma CAI, activo en la red de defensores.',
          etiqueta: item.status || item.activationState || 'Activo',
          icono: iconOptions[index % iconOptions.length],
          color: colorOptions[index % colorOptions.length],
          fondo: bgOptions[index % bgOptions.length],
        }));
      }

      // Si la base está vacía se mostrará el mensaje en la UI
      const finalApologetas = mapped.length > 0 ? mapped : [];
      
      setApologetasList(finalApologetas);
      setSelectedId(finalApologetas[0]?.id ?? '');
    } catch (error) {
      console.error('Error fetching apologetas:', error);
      setApologetasList([]);
      setSelectedId('');
    } finally {
      setIsLoadingApologetas(false);
    }
  };

  const fetchReviewRequests = async () => {
    setIsLoadingRequests(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'REGISTRADOR';
      
      if (!isAdmin) {
        setReviewRequests([]);
        return;
      }
      
      const data = await fetchApi('/admin/certificate-review-requests?status=PENDING&page=1&pageSize=50');
      if (data && data.items) {
        setReviewRequests(data.items);
      }
    } catch (error) {
      console.error('Error fetching review requests:', error);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      await fetchApi(`/admin/certificate-review-requests/${requestId}/approve`, { method: 'POST' });
      fetchReviewRequests(); // Recargar la lista
    } catch (error) {
      alert('Error al aprobar: ' + error.message);
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await fetchApi(`/admin/certificate-review-requests/${requestId}/reject`, { method: 'POST' });
      fetchReviewRequests(); // Recargar la lista
    } catch (error) {
      alert('Error al rechazar: ' + error.message);
    }
  };

  const API_URL = import.meta.env.MODE === 'development' ? '/api' : (import.meta.env.VITE_API_URL || 'https://cai-backend-ft29.onrender.com');

  const renderReviewRequests = () => {
    return null;
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

  const misionesPorApologeta = useMemo(() => {
    if (apologetasList.length === 0) return [];
    
    return apologetasList.map((apologeta, index) => {
      // Como ahora solo usamos datos reales, si no tienen misiones cargadas, les asignamos un array vacío
      // Si el backend devuelve las misiones asociadas al usuario en el futuro, se mapearán aquí.
      let misionesApologeta = [];

      return {
        ...apologeta,
        misiones: misionesApologeta,
      };
    });
  }, [apologetasList]);

  const toggleCard = (id) => {
    setSelectedId((current) => (current === id ? '' : id));
  };

  const openMissionDetail = (mision, apologetaNombre) => {
    setSelectedMission(buildMissionEvidenceDetails(mision, apologetaNombre));
    setCurrentMediaIndex(0);
  };

  const closeMissionDetail = () => {
    setSelectedMission(null);
    setCurrentMediaIndex(0);
  };

  const showPreviousMedia = () => {
    if (!selectedMission?.mediaSamples?.length) {
      return;
    }

    setCurrentMediaIndex((current) =>
      current === 0 ? selectedMission.mediaSamples.length - 1 : current - 1,
    );
  };

  const showNextMedia = () => {
    if (!selectedMission?.mediaSamples?.length) {
      return;
    }

    setCurrentMediaIndex((current) =>
      current === selectedMission.mediaSamples.length - 1 ? 0 : current + 1,
    );
  };

  const renderMissionItem = (mision, apologetaNombre, compact = false) => (
    <article
      key={mision.id}
      className={`rounded-2xl bg-surface-container-low p-4 ${compact ? '' : 'border border-outline-variant/20'}`}
    >
      <div className={`flex ${compact ? 'flex-col gap-3' : 'items-start justify-between gap-4'}`}>
        <div className="min-w-0">
          <h4 className="text-base font-semibold text-on-surface">{mision.titulo}</h4>
          <p className="mt-1 text-xs font-label uppercase tracking-[0.18em] text-secondary">{mision.tipo}</p>
          <p className="mt-3 text-sm leading-6 text-on-surface-variant">{mision.resumen}</p>
        </div>
        <button
          type="button"
          onClick={() => openMissionDetail(mision, apologetaNombre)}
          className="rounded-full border border-primary/20 px-4 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:bg-primary/5"
        >
          Ver evidencias
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-surface-container-lowest px-3 py-1 font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">
          {mision.lugar}
        </span>
        <span className="rounded-full bg-surface-container-lowest px-3 py-1 font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">
          {mision.fecha}
        </span>
        <span className="rounded-full bg-surface-container-lowest px-3 py-1 font-label text-[10px] uppercase tracking-[0.16em] text-primary">
          {mision.evidencia}
        </span>
      </div>
    </article>
  );


  const handleCertificateFieldChange = (field) => (event) => {
    const value = field === 'file' ? event.target.files?.[0] ?? null : event.target.value;

    setCertificateForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (certificateFeedback.message) {
      setCertificateFeedback({ type: '', message: '' });
    }
  };

  const handleCertificateSubmit = (event) => {
    event.preventDefault();

    const identifier = certificateForm.identifier.trim();
    const name = certificateForm.name.trim();
    const file = certificateForm.file;

    if (!identifier || !name || !file) {
      setCertificateFeedback({
        type: 'error',
        message: 'Completa el identificador, el nombre y selecciona el archivo del certificado.',
      });
      return;
    }

    const normalizedIdentifier = identifier.toLowerCase();
    const alreadyExists = certificates.some(
      (certificate) => certificate.normalizedIdentifier === normalizedIdentifier,
    );

    if (alreadyExists) {
      setCertificateFeedback({
        type: 'error',
        message: 'El identificador ingresado ya existe. Usa uno diferente para registrar el certificado.',
      });
      return;
    }

    const sizeInKb = Math.max(1, Math.round(file.size / 1024));

    setCertificates((current) => [
      {
        id: `${normalizedIdentifier}-${Date.now()}`,
        identifier,
        normalizedIdentifier,
        name,
        fileName: file.name,
        sizeLabel: `${sizeInKb} KB`,
        uploadedAt: formatCertificateDate(),
        status: 'Cargado',
      },
      ...current,
    ]);

    setCertificateForm({
      identifier: '',
      name: '',
      file: null,
    });
    setCertificateFeedback({
      type: 'success',
      message: `Certificado ${identifier} cargado correctamente.`,
    });
    setCertificateFileInputKey((current) => current + 1);
  };

  const renderCertificatesSection = (isDesktop = false) => (
    <section
      className={`${isDesktop ? 'mt-10 rounded-[1.8rem] bg-surface-container-low p-8 shadow-[0_12px_35px_rgba(26,28,26,0.05)]' : 'mt-6 rounded-[1.8rem] bg-surface-container-low p-5 shadow-[0_10px_28px_rgba(26,28,26,0.06)]'}`}
    >
      <div className={`flex ${isDesktop ? 'items-end justify-between gap-6' : 'flex-col gap-4'}`}>
        <div className="max-w-2xl">
          <p className="font-label text-[10px] uppercase tracking-[0.24em] text-secondary">Certificados</p>
          <h2 className={`${isDesktop ? 'mt-3 font-headline text-4xl text-on-surface' : 'mt-2 font-headline text-3xl text-on-surface'}`}>
            Carga y gestiona certificados
          </h2>
          <p className={`${isDesktop ? 'mt-3 text-base leading-7 text-on-surface-variant' : 'mt-2 text-sm leading-6 text-on-surface-variant'}`}>
            Registra cada certificado con un identificador unico, un nombre asociado y el archivo que deseas conservar.
          </p>
        </div>
        <div className={`grid ${isDesktop ? 'grid-cols-2 gap-4' : 'grid-cols-2 gap-3'}`}>
          <article className="rounded-2xl bg-surface-container-lowest px-4 py-4">
            <p className="font-headline text-3xl leading-none text-primary">{certificates.length}</p>
            <p className="mt-2 font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">
              Certificados registrados
            </p>
          </article>
          <article className="rounded-2xl bg-surface-container-lowest px-4 py-4">
            <p className="font-headline text-3xl leading-none text-primary">
              {certificates.filter((certificate) => certificate.status === 'Vigente').length}
            </p>
            <p className="mt-2 font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Vigentes</p>
          </article>
        </div>
      </div>

      <div className={`mt-6 grid grid-cols-1 gap-5 ${isDesktop ? 'xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]' : ''}`}>
        <article className="rounded-[1.5rem] bg-surface-container-lowest p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <div>
              <p className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Nuevo certificado</p>
              <p className="mt-1 text-sm text-on-surface-variant">Completa los datos para agregar un nuevo registro.</p>
            </div>
          </div>

          <form className="mt-5 space-y-4" onSubmit={handleCertificateSubmit}>
            <label className="block">
              <span className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">
                Identificador unico
              </span>
              <input
                className="mt-2 w-full rounded-2xl border border-outline-variant/20 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
                onChange={handleCertificateFieldChange('identifier')}
                placeholder="Ej. AP-003"
                type="text"
                value={certificateForm.identifier}
              />
            </label>

            <label className="block">
              <span className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">
                Nombre del certificado
              </span>
              <input
                className="mt-2 w-full rounded-2xl border border-outline-variant/20 bg-surface px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
                onChange={handleCertificateFieldChange('name')}
                placeholder="Ej. Certificado de Apologetica Fundamental"
                type="text"
                value={certificateForm.name}
              />
            </label>

            <label className="block">
              <span className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Archivo</span>
              <input
                key={certificateFileInputKey}
                className="mt-2 block w-full rounded-2xl border border-dashed border-outline-variant/30 bg-surface px-4 py-3 text-sm text-on-surface file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:font-label file:text-[10px] file:uppercase file:tracking-[0.16em] file:text-primary"
                onChange={handleCertificateFieldChange('file')}
                type="file"
              />
              <p className="mt-2 text-xs text-on-surface-variant">
                {certificateForm.file ? `Archivo seleccionado: ${certificateForm.file.name}` : 'Selecciona un archivo PDF o imagen del certificado.'}
              </p>
            </label>

            {certificateFeedback.message ? (
              <div
                className={`rounded-2xl px-4 py-3 text-sm ${
                  certificateFeedback.type === 'error'
                    ? 'bg-error/10 text-error'
                    : 'bg-[#2e7d32]/10 text-[#2e7d32]'
                }`}
              >
                {certificateFeedback.message}
              </div>
            ) : null}

            <button
              className="w-full rounded-2xl bg-primary px-4 py-3 font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_12px_24px_rgba(113,89,24,0.24)] transition hover:opacity-95"
              type="submit"
            >
              Cargar certificado
            </button>
          </form>
        </article>

        <article className="rounded-[1.5rem] bg-surface-container-lowest p-5">
          <div className={`flex ${isDesktop ? 'items-center justify-between' : 'flex-col gap-2'}`}>
            <div>
              <p className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Registros cargados</p>
              <h3 className="mt-2 font-headline text-2xl text-on-surface">Listado de certificados</h3>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 font-label text-[10px] uppercase tracking-[0.16em] text-primary">
              {certificates.length} activos
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {certificates.map((certificate) => (
              <article
                key={certificate.id}
                className={`rounded-[1.4rem] border border-outline-variant/15 bg-surface px-4 py-4 ${
                  isDesktop ? 'flex items-center justify-between gap-4' : 'space-y-4'
                }`}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-1 font-label text-[10px] uppercase tracking-[0.16em] text-primary">
                      {certificate.identifier}
                    </span>
                    <span className="rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">
                      {certificate.status}
                    </span>
                  </div>
                  <h4 className="mt-3 text-base font-semibold text-on-surface">{certificate.name}</h4>
                  <p className="mt-1 text-sm text-on-surface-variant">{certificate.fileName}</p>
                </div>

                <div className={`${isDesktop ? 'min-w-[210px] text-right' : 'grid grid-cols-2 gap-3'}`}>
                  <div>
                    <p className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Fecha</p>
                    <p className="mt-2 text-sm font-semibold text-on-surface">{certificate.uploadedAt}</p>
                  </div>
                  <div>
                    <p className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Tamano</p>
                    <p className="mt-2 text-sm font-semibold text-on-surface">{certificate.sizeLabel}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
  const renderMissionDetail = () => {
    if (!selectedMission) {
      return null;
    }

    const currentMedia = selectedMission.mediaSamples[currentMediaIndex];

    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 md:items-center md:p-8">
        <div className="absolute inset-0" aria-hidden="true" onClick={closeMissionDetail}></div>
        <section className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-surface-container-low p-6 shadow-[0_20px_60px_rgba(26,28,26,0.22)] md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-label text-[10px] uppercase tracking-[0.24em] text-secondary">{selectedMission.estado}</p>
              <h2 className="mt-3 font-headline text-4xl leading-[0.98] text-on-surface">{selectedMission.titulo}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-on-surface-variant">{selectedMission.resumen}</p>
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
              <p className="mt-2 text-sm font-semibold text-on-surface">{selectedMission.lugar}</p>
            </article>
            <article className="rounded-2xl bg-surface-container-lowest p-4">
              <p className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Fecha</p>
              <p className="mt-2 text-sm font-semibold text-on-surface">{selectedMission.fecha}</p>
            </article>
            <article className="rounded-2xl bg-surface-container-lowest p-4">
              <p className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Evidencia</p>
              <p className="mt-2 text-sm font-semibold text-on-surface">{selectedMission.evidencia}</p>
            </article>
            <article className="rounded-2xl bg-surface-container-lowest p-4">
              <p className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Responsable</p>
              <p className="mt-2 text-sm font-semibold text-on-surface">{selectedMission.responsable}</p>
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
              {selectedMission.mediaSamples.map((item, index) => (
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
                {selectedMission.evidenciaItems.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-primary/5 px-4 py-3">
                    <span className="material-symbols-outlined text-primary">task_alt</span>
                    <p className="text-sm leading-6 text-on-surface">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-outline-variant/20 bg-surface px-4 py-4">
                <p className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Observaciones</p>
                <p className="mt-2 text-sm leading-6 text-on-surface-variant">{selectedMission.observaciones}</p>
              </div>
            </div>

            <div className="space-y-4">
              <article className="rounded-[1.5rem] bg-surface-container-lowest p-5">
                <p className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Equipo participante</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedMission.nombresApologetas.map((nombre) => (
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
                    <span className="font-semibold text-on-surface">{selectedMission.tipo}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Estado</span>
                    <span className="font-semibold text-primary">{selectedMission.estado}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>Participantes</span>
                    <span className="font-semibold text-on-surface">{selectedMission.nombresApologetas.length}</span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-surface text-on-background">
      {renderMissionDetail()}
      <div className="md:hidden">
        <main className="mx-auto max-w-sm px-5 pb-32 pt-5">
          <header className="flex items-center justify-between">
            <div>
              <p className="font-label text-[10px] uppercase tracking-[0.35em] text-secondary">DEFENSORES FIDEI</p>
              <h1 className="mt-3 max-w-[15rem] font-headline text-[2.75rem] leading-[0.98] text-on-surface">
                Modulo de
                <br />
                Apologetas
              </h1>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => navigate('/apologetas-pendientes')}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-primary/10 bg-surface-container-low text-primary"
              >
                <span className="material-symbols-outlined">notifications</span>
                {reviewRequests.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[9px] font-bold text-white">
                    {reviewRequests.length}
                  </span>
                )}
              </button>
              <button
                onClick={goToDashboard}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/10 bg-surface-container-low text-primary"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
            </div>
          </header>

          <section className="mt-5 flex items-center justify-between rounded-[1.6rem] bg-surface-container-low px-4 py-4 shadow-[0_8px_24px_rgba(26,28,26,0.05)]">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full border border-primary/20">
                <img
                  alt="Insignia"
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsA9vxxIuSP7qNG1e99bXXi-5fFMtg83C45ejeEN0AP56SQTm_kmFT9-NJPL-fRJ9dbSzB7PXCHNEyeXrgzlBENs8oajQkFV5sVOnmPrG9IPtkmqYJF9tQMCtvqZFHACLprAUlENal-TockvP34u0U4NECCLbyBKv4EXczJ1pJxv8ArWR6jvKEifgjVOv0Xp1szkGrJPVApiKGw0gPYk6btrJBeovJwSundEl4zuc2JDbBVBE_mWCv7dkKRsOlAQtJoTuG54GL"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="font-headline text-base font-bold leading-tight text-primary">{user.fullName || 'Usuario'}</h2>
                <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">{isAdmin ? 'Administrador' : 'Soldado'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-full border border-error/20 bg-error/10 px-3 py-2 font-label text-[10px] uppercase tracking-[0.16em] text-error"
            >
              Cerrar sesion
            </button>
          </section>

          <p className="mt-5 max-w-[19rem] text-sm leading-6 text-on-surface-variant">
            Custodios de la tradicion y la razon. Una red de apologetas con formacion pastoral y academica accesible.
          </p>

          <section className="mt-6 grid grid-cols-2 gap-4">
            {resumenApologetas.map((item) => (
              <article key={item.etiqueta} className="rounded-2xl bg-surface-container-low px-5 py-4 shadow-[0_8px_24px_rgba(26,28,26,0.05)]">
                <p className="font-headline text-4xl leading-none text-primary">{item.valor}</p>
                <p className="mt-2 font-label text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">{item.etiqueta}</p>
              </article>
            ))}
          </section>

          {renderReviewRequests()}

          <section className="mt-6 space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-surface-container-low px-4 py-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">filter_list</span>
                <span className="text-sm font-medium text-on-surface">{filtrosApologetas[0]}</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-surface-container-low px-4 py-4">
              <span className="text-sm text-on-surface-variant">Ordenar por</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <span>{ordenesApologetas[0]}</span>
                <span className="material-symbols-outlined text-base">expand_more</span>
              </div>
            </div>
          </section>

          <section className="mt-6 space-y-4">
            {apologetasList.length === 0 && !isLoadingApologetas && (
              <div className="rounded-2xl bg-surface-container-low p-8 text-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant/50">group_off</span>
                <p className="mt-2 text-sm text-on-surface-variant">No se encontraron soldados registrados.</p>
              </div>
            )}
            
            {isLoadingApologetas && (
              <div className="rounded-2xl bg-surface-container-low p-8 text-center">
                <p className="text-sm text-on-surface-variant">Cargando soldados...</p>
              </div>
            )}

            {misionesPorApologeta.map((apologeta) => {
              const isOpen = selectedId === apologeta.id;
              return (
              <article
                key={apologeta.nombre}
                className="rounded-[1.7rem] bg-surface-container-lowest p-5 shadow-[0_10px_28px_rgba(26,28,26,0.06)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="max-w-[11rem] font-headline text-[2rem] leading-[1.02] text-on-surface">{apologeta.nombre}</h2>
                    <p className="mt-2 text-sm font-semibold uppercase tracking-[0.08em] text-secondary">{apologeta.especialidad}</p>
                    <span className="mt-3 inline-flex rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] uppercase tracking-[0.16em] text-primary">
                      {apologeta.grado}
                    </span>
                  </div>
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${apologeta.fondo} ${apologeta.color}`}>
                    <span className="material-symbols-outlined">{apologeta.icono}</span>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-6 text-on-surface-variant">{apologeta.descripcion}</p>
                <span className="mt-4 inline-flex rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">
                  {apologeta.etiqueta}
                </span>
              </article>
              );
            })}
          </section>
        </main>

        <nav className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-sm -translate-x-1/2 overflow-hidden rounded-[2rem] bg-surface-container-low shadow-[0_14px_35px_rgba(26,28,26,0.12)]">
          <div
            className="flex items-center justify-start gap-6 overflow-x-auto px-6 py-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
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
              <span
                className={`font-label text-[9px] uppercase tracking-[0.12em] ${
                  item.active ? 'text-primary' : 'text-on-surface-variant/60'
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}
          </div>
        </nav>
      </div>

      <div className="hidden md:block">
        <aside className="fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r border-[#715918]/5 bg-[#faf9f5] px-4 py-8">
          <div className="mb-10 px-4">
            <div className="mb-8 flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full border border-primary/20">
                <img
                  alt="Insignia"
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsA9vxxIuSP7qNG1e99bXXi-5fFMtg83C45ejeEN0AP56SQTm_kmFT9-NJPL-fRJ9dbSzB7PXCHNEyeXrgzlBENs8oajQkFV5sVOnmPrG9IPtkmqYJF9tQMCtvqZFHACLprAUlENal-TockvP34u0U4NECCLbyBKv4EXczJ1pJxv8ArWR6jvKEifgjVOv0Xp1szkGrJPVApiKGw0gPYk6btrJBeovJwSundEl4zuc2JDbBVBE_mWCv7dkKRsOlAQtJoTuG54GL"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="font-headline text-base font-bold leading-tight text-primary">{user.fullName || 'Usuario'}</h2>
                <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">{isAdmin ? 'Administrador' : 'Soldado'}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            <button
              onClick={goToDashboard}
              className="flex w-full items-center gap-4 rounded-l-full px-4 py-3 text-left text-[#1a1c1a] opacity-60 transition-all duration-300 hover:bg-[#715918]/10 hover:opacity-100"
            >
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-label">Dashboard</span>
            </button>
            <button
              onClick={goToMisiones}
              className="flex w-full items-center gap-4 rounded-l-full px-4 py-3 text-left text-[#1a1c1a] opacity-60 transition-all duration-300 hover:bg-[#715918]/10 hover:opacity-100"
            >
              <span className="material-symbols-outlined">explore_nearby</span>
              <span className="font-label">Misiones</span>
            </button>
            <button className="flex w-full items-center gap-4 rounded-l-full bg-[#715918]/5 px-4 py-3 text-left font-bold text-[#715918] transition-all duration-300">
              <span className="material-symbols-outlined">shield</span>
              <span className="font-label">Apologetas</span>
            </button>
            <button
              onClick={goToCertificados}
              className="flex w-full items-center gap-4 rounded-l-full px-4 py-3 text-left text-[#1a1c1a] opacity-60 transition-all duration-300 hover:bg-[#715918]/10 hover:opacity-100"
            >
              <span className="material-symbols-outlined">workspace_premium</span>
              <span className="font-label">Certificados</span>
            </button>
            <button
              onClick={goToSectas}
              className="flex w-full items-center gap-4 rounded-l-full px-4 py-3 text-left text-[#1a1c1a] opacity-60 transition-all duration-300 hover:bg-[#715918]/10 hover:opacity-100"
            >
              <span className="material-symbols-outlined">gavel</span>
              <span className="font-label">Sectas</span>
            </button>
          </nav>

          <div className="space-y-2 border-t border-primary/5 pt-6">
            <a className="flex items-center gap-4 px-4 py-3 text-[#1a1c1a] opacity-60 transition-all hover:opacity-100" href="#">
              <span className="material-symbols-outlined">settings</span>
              <span className="font-label">Ajustes</span>
            </a>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-4 px-4 py-3 text-error opacity-80 transition-all hover:opacity-100"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="font-label">Cerrar Sesion</span>
            </button>
          </div>
        </aside>

        <main className="ml-72 min-h-screen">
          <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-primary/10 bg-surface/80 px-12 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <h1 className="font-headline text-xl font-bold tracking-tight text-primary">
                Cruzada Apologetica Itinerante
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="group relative">
                <input
                  className="w-64 rounded-full border-none bg-surface-container-low px-5 py-1.5 text-sm font-body transition-all focus:ring-1 focus:ring-primary/30"
                  placeholder="Buscar apologeta..."
                  type="text"
                />
                <span className="material-symbols-outlined absolute right-3 top-1.5 text-lg text-primary/40">search</span>
              </div>
              <button 
                onClick={() => navigate('/apologetas-pendientes')}
                className="relative transition-opacity hover:opacity-70"
              >
                <span className="material-symbols-outlined text-primary">notifications</span>
                {reviewRequests.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[9px] font-bold text-white">
                    {reviewRequests.length}
                  </span>
                )}
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-7xl p-12">
            <section className="flex items-end justify-between gap-10">
              <div className="max-w-3xl">
                <p className="font-label text-xs uppercase tracking-[0.28em] text-secondary">DEFENSORES FIDEI</p>
                <h2 className="mt-3 font-headline text-7xl leading-[0.95] text-on-surface">Modulo de Apologetas</h2>
                <p className="mt-6 max-w-2xl text-xl leading-9 text-on-surface-variant">
                  Custodios de la tradicion y la razon. Una asamblea de servidores dedicados a la defensa intelectual y espiritual del magisterio.
                </p>
              </div>
              <div className="flex min-w-[240px] gap-10 border-l border-outline-variant/40 pl-10">
                {resumenApologetas.map((item) => (
                  <div key={item.etiqueta}>
                    <p className="font-headline text-5xl leading-none text-primary">{item.valor}</p>
                    <p className="mt-2 font-label text-xs uppercase tracking-[0.14em] text-on-surface-variant">{item.etiqueta}</p>
                  </div>
                ))}
              </div>
            </section>

            {renderReviewRequests()}

            <section className="mt-10 grid grid-cols-[minmax(0,1fr)_230px] gap-4">
              <div className="flex items-center justify-between rounded-[1.4rem] bg-surface-container-low px-6 py-6">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary">filter_alt</span>
                  <span className="text-lg font-medium text-on-surface">{filtrosApologetas[0]}</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
              </div>
              <div className="flex items-center justify-between rounded-[1.4rem] bg-surface-container-low px-6 py-6">
                <span className="text-lg text-on-surface-variant">Ordenar por</span>
                <div className="flex items-center gap-2 font-semibold text-primary">
                  <span>{ordenesApologetas[0]}</span>
                  <span className="material-symbols-outlined text-base">expand_more</span>
                </div>
              </div>
            </section>

            <section className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-2">
              {misionesPorApologeta.map((apologeta) => {
                const isOpen = selectedId === apologeta.id;
                return (
                <article
                  key={apologeta.nombre}
                  className="flex min-h-[370px] flex-col rounded-[1.6rem] bg-surface-container-lowest p-6 shadow-[0_12px_35px_rgba(26,28,26,0.05)]"
                >
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <h3 className="max-w-[14rem] font-headline text-[2.4rem] leading-[1.02] text-on-surface">{apologeta.nombre}</h3>
                      <p className="mt-3 text-[1.05rem] font-semibold uppercase tracking-[0.05em] text-secondary">{apologeta.especialidad}</p>
                      <span className="mt-3 inline-flex rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] uppercase tracking-[0.16em] text-primary">
                        {apologeta.grado}
                      </span>
                    </div>
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${apologeta.fondo} ${apologeta.color}`}>
                      <span className="material-symbols-outlined">{apologeta.icono}</span>
                    </div>
                  </div>

                  <p className="mt-6 text-lg leading-8 text-on-surface-variant">{apologeta.descripcion}</p>
                  <span className="mt-5 inline-flex w-fit rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">
                    {apologeta.etiqueta}
                  </span>
                </article>
                );
              })}
            </section>

            <section className="mt-10 flex justify-center">
              <div className="flex items-center gap-8 rounded-[1.2rem] bg-surface-container-low px-10 py-5">
                <button className="text-primary">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <span className="font-medium text-on-surface">Pagina 1 de 12</span>
                <button className="text-primary">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Apologetas;
