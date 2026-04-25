import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

const Certificados = () => {
  const navigate = useNavigate();
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

  const goToDashboard = () => navigate('/dashboard');
  const goToMisiones = () => navigate('/misiones');
  const goToApologetas = () => navigate('/apologetas');
  const goToSectas = () => navigate('/sectas');
  const goToCertificados = () => navigate('/certificados');
  const handleLogout = (e) => {
    e.preventDefault();
    navigate('/login');
  };

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

  const renderCertificatesContent = (isDesktop = false) => (
    <section
      className={`${isDesktop ? 'mt-10 rounded-[1.8rem] bg-surface-container-low p-8 shadow-[0_12px_35px_rgba(26,28,26,0.05)]' : 'mt-6 rounded-[1.8rem] bg-surface-container-low p-5 shadow-[0_10px_28px_rgba(26,28,26,0.06)]'}`}
    >
      <div className={`flex ${isDesktop ? 'items-end justify-between gap-6' : 'flex-col gap-4'}`}>
        <div className="max-w-2xl">
          <p className="font-label text-[10px] uppercase tracking-[0.24em] text-secondary">Certificados</p>
          <h2 className={`${isDesktop ? 'mt-3 font-headline text-5xl text-on-surface' : 'mt-2 font-headline text-3xl text-on-surface'}`}>
            Gestion de certificados
          </h2>
          <p className={`${isDesktop ? 'mt-3 text-base leading-7 text-on-surface-variant' : 'mt-2 text-sm leading-6 text-on-surface-variant'}`}>
            Carga certificados con un identificador unico, un nombre asociado y el archivo correspondiente.
          </p>
        </div>
        <div className={`grid ${isDesktop ? 'grid-cols-2 gap-4' : 'grid-cols-2 gap-3'}`}>
          <article className="rounded-2xl bg-surface-container-lowest px-4 py-4">
            <p className="font-headline text-3xl leading-none text-primary">{certificates.length}</p>
            <p className="mt-2 font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">
              Registrados
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
              <span className="material-symbols-outlined">workspace_premium</span>
            </div>
            <div>
              <p className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Nuevo certificado</p>
              <p className="mt-1 text-sm text-on-surface-variant">Ingresa los datos y adjunta el archivo.</p>
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

  return (
    <div className="min-h-screen bg-surface text-on-background">
      <div className="md:hidden">
        <main className="mx-auto max-w-sm px-5 pb-32 pt-5">
          <header className="flex items-center justify-between">
            <div>
              <p className="font-label text-[10px] uppercase tracking-[0.35em] text-secondary">ARCHIVO DOCTRINAL</p>
              <h1 className="mt-3 max-w-[15rem] font-headline text-[2.75rem] leading-[0.98] text-on-surface">
                Modulo de
                <br />
                Certificados
              </h1>
            </div>
            <button
              onClick={goToDashboard}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/10 bg-surface-container-low text-primary"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
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
              <div>
                <p className="font-headline text-lg font-bold leading-tight text-primary">Padre Luis Toro</p>
                <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant">Sacerdote</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-full border border-error/20 bg-error/10 px-3 py-2 font-label text-[10px] uppercase tracking-[0.16em] text-error"
            >
              Cerrar sesion
            </button>
          </section>

          <p className="mt-5 text-sm leading-6 text-on-surface-variant">
            Gestiona y conserva el registro documental de certificados para consulta rapida.
          </p>

          {renderCertificatesContent()}
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
              { label: 'Apolog.', icon: 'shield', active: false, action: goToApologetas },
              { label: 'Certif.', icon: 'workspace_premium', active: true, action: goToCertificados },
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
              <div>
                <h2 className="font-headline text-lg font-bold leading-tight text-[#715918]">Padre Luis Toro</h2>
                <p className="text-xs font-label uppercase tracking-widest opacity-60">Sacerdote</p>
              </div>
            </div>
            <button
              onClick={goToCertificados}
              className="vatican-gradient flex w-full items-center justify-center gap-2 rounded-xl py-3 font-medium text-on-primary shadow-lg shadow-primary/10"
            >
              <span className="material-symbols-outlined text-sm">workspace_premium</span>
              <span className="font-label">Gestionar Certificados</span>
            </button>
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
            <button
              onClick={goToApologetas}
              className="flex w-full items-center gap-4 rounded-l-full px-4 py-3 text-left text-[#1a1c1a] opacity-60 transition-all duration-300 hover:bg-[#715918]/10 hover:opacity-100"
            >
              <span className="material-symbols-outlined">shield</span>
              <span className="font-label">Apologetas</span>
            </button>
            <button
              onClick={goToCertificados}
              className="flex w-full items-center gap-4 rounded-l-full bg-[#715918]/5 px-4 py-3 text-left font-bold text-[#715918] transition-all duration-300"
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
          <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#715918]/10 bg-[#faf9f5]/80 px-12 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <h1 className="font-headline text-xl font-bold tracking-tight text-[#715918]">
                Plataforma Cruzada Apologetica Itinerante
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="group relative">
                <input
                  className="w-64 rounded-full border-none bg-surface-container-low px-5 py-1.5 text-sm font-body transition-all focus:ring-1 focus:ring-primary/30"
                  placeholder="Buscar certificado..."
                  type="text"
                />
                <span className="material-symbols-outlined absolute right-3 top-1.5 text-lg text-primary/40">search</span>
              </div>
              <button className="transition-opacity hover:opacity-70">
                <span className="material-symbols-outlined text-primary">notifications</span>
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-7xl p-12">
            <section className="flex items-end justify-between gap-10">
              <div className="max-w-3xl">
                <p className="font-label text-xs uppercase tracking-[0.28em] text-secondary">ARCHIVO DOCTRINAL</p>
                <h2 className="mt-3 font-headline text-7xl leading-[0.95] text-on-surface">Modulo de Certificados</h2>
                <p className="mt-6 max-w-2xl text-xl leading-9 text-on-surface-variant">
                  Centraliza la carga y la consulta de certificados con un identificador unico y su nombre asociado.
                </p>
              </div>
              <div className="flex min-w-[240px] gap-10 border-l border-outline-variant/40 pl-10">
                <div>
                  <p className="font-headline text-5xl leading-none text-primary">{certificates.length}</p>
                  <p className="mt-2 font-label text-xs uppercase tracking-[0.14em] text-on-surface-variant">Registrados</p>
                </div>
                <div>
                  <p className="font-headline text-5xl leading-none text-primary">
                    {certificates.filter((certificate) => certificate.status === 'Vigente').length}
                  </p>
                  <p className="mt-2 font-label text-xs uppercase tracking-[0.14em] text-on-surface-variant">Vigentes</p>
                </div>
              </div>
            </section>

            {renderCertificatesContent(true)}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Certificados;
