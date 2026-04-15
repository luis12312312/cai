import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { filtrosSectas, sectasEncontradas } from '../data/misionesData';

const Sectas = () => {
  const navigate = useNavigate();

  const goToDashboard = () => navigate('/dashboard');
  const goToMisiones = () => navigate('/misiones');
  const goToApologetas = () => navigate('/apologetas');
  const goToSectas = () => navigate('/sectas');
  const handleLogout = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  const resumenCasos = useMemo(() => {
    const abiertas = sectasEncontradas.filter((item) => item.estado !== 'Caso documentado').length;
    const referentes = new Set(sectasEncontradas.map((item) => item.referente)).size;

    return {
      detectadas: sectasEncontradas.length,
      abiertas,
      referentes,
    };
  }, []);

  const renderSectaCard = (secta, compact = false) => {
    return (
      <article
        key={secta.id}
        className={`rounded-[1.5rem] bg-surface-container-lowest p-5 shadow-[0_10px_30px_rgba(26,28,26,0.05)] ${
          compact ? '' : 'border border-outline-variant/10'
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-label text-[10px] uppercase tracking-[0.18em] text-secondary">{secta.categoria}</p>
            <h3 className="mt-3 font-headline text-[2rem] leading-[1.02] text-on-surface">{secta.nombre}</h3>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <span className="material-symbols-outlined">flare</span>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-on-surface-variant">{secta.descripcion}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">
            {secta.zona}
          </span>
          <span className="rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">
            {secta.fecha}
          </span>
        </div>

        <div className="mt-5 rounded-2xl bg-surface-container-low p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Estado</p>
              <p className="mt-2 text-sm font-semibold text-on-surface">{secta.estado}</p>
            </div>
            <div className="text-right">
              <p className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Referente</p>
              <p className="mt-2 text-sm font-semibold text-primary">{secta.referente}</p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <p className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Senales detectadas</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {secta.senales.map((senal) => (
              <span
                key={senal}
                className="rounded-full bg-primary/10 px-3 py-1 font-label text-[10px] uppercase tracking-[0.16em] text-primary"
              >
                {senal}
              </span>
            ))}
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="min-h-screen bg-surface text-on-background">
      <div className="md:hidden">
        <main className="mx-auto max-w-sm px-5 pb-32 pt-5">
          <header className="flex items-center justify-between">
            <div>
              <p className="font-label text-[10px] uppercase tracking-[0.35em] text-secondary">ALERTAS SECTARIAS</p>
              <h1 className="mt-3 max-w-[15rem] font-headline text-[2.75rem] leading-[0.98] text-on-surface">
                Modulo de
                <br />
                Sectas
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
            Registro pastoral de grupos detectados y seguimiento para respuesta evangelizadora.
          </p>

          <section className="mt-6 grid grid-cols-3 gap-4">
            <article className="rounded-2xl bg-surface-container-low px-4 py-4 shadow-[0_8px_24px_rgba(26,28,26,0.05)]">
              <p className="font-headline text-3xl leading-none text-primary">{resumenCasos.detectadas}</p>
              <p className="mt-2 font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Sectas detectadas</p>
            </article>
            <article className="rounded-2xl bg-surface-container-low px-4 py-4 shadow-[0_8px_24px_rgba(26,28,26,0.05)]">
              <p className="font-headline text-3xl leading-none text-primary">{resumenCasos.abiertas}</p>
              <p className="mt-2 font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Casos abiertos</p>
            </article>
            <article className="rounded-2xl bg-surface-container-low px-4 py-4 shadow-[0_8px_24px_rgba(26,28,26,0.05)]">
              <p className="font-headline text-3xl leading-none text-primary">{resumenCasos.referentes}</p>
              <p className="mt-2 font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Referentes</p>
            </article>
          </section>

          <section className="mt-6 space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-surface-container-low px-4 py-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">filter_list</span>
                <span className="text-sm font-medium text-on-surface">{filtrosSectas[0]}</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
            </div>
            <article className="rounded-2xl bg-surface-container-low px-5 py-4 shadow-[0_8px_24px_rgba(26,28,26,0.05)]">
              <p className="font-headline text-4xl leading-none text-primary">{resumenCasos.abiertas}</p>
              <p className="mt-2 font-label text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">Casos abiertos</p>
            </article>
          </section>

          <section className="mt-6 space-y-4">
            {sectasEncontradas.map((secta) => renderSectaCard(secta, true))}
          </section>
        </main>

        <nav className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-1.5rem)] max-w-sm -translate-x-1/2 items-center justify-between rounded-[2rem] bg-surface-container-low px-6 py-4 shadow-[0_14px_35px_rgba(26,28,26,0.12)]">
          {[
            { label: 'Dashboard', icon: 'dashboard', active: false, action: goToDashboard },
            { label: 'Misiones', icon: 'menu_book', active: false, action: goToMisiones },
            { label: 'Apologetas', icon: 'shield', active: false, action: goToApologetas },
            { label: 'Sectas', icon: 'flare', active: true, action: goToSectas },
          ].map((item) => (
            <button key={item.label} onClick={item.action} className="flex flex-col items-center gap-1">
              <span className={`material-symbols-outlined text-xl ${item.active ? 'text-primary' : 'text-on-surface-variant/50'}`}>
                {item.icon}
              </span>
              <span
                className={`font-label text-[10px] uppercase tracking-[0.16em] ${
                  item.active ? 'text-primary' : 'text-on-surface-variant/60'
                }`}
              >
                {item.label}
              </span>
            </button>
          ))}
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
              onClick={goToMisiones}
              className="vatican-gradient flex w-full items-center justify-center gap-2 rounded-xl py-3 font-medium text-on-primary shadow-lg shadow-primary/10"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span className="font-label">Nueva Mision</span>
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
              onClick={goToSectas}
              className="flex w-full items-center gap-4 rounded-l-full bg-[#715918]/5 px-4 py-3 text-left font-bold text-[#715918] transition-all duration-300"
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
                  placeholder="Buscar secta..."
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
                <p className="font-label text-xs uppercase tracking-[0.28em] text-secondary">ALERTAS SECTARIAS</p>
                <h2 className="mt-3 font-headline text-7xl leading-[0.95] text-on-surface">Modulo de Sectas</h2>
                <p className="mt-6 max-w-2xl text-xl leading-9 text-on-surface-variant">
                  Monitoreo de grupos detectados, actividad registrada y acciones prioritarias para el equipo pastoral.
                </p>
              </div>
              <div className="flex min-w-[300px] gap-10 border-l border-outline-variant/40 pl-10">
                <div>
                  <p className="font-headline text-5xl leading-none text-primary">{resumenCasos.detectadas}</p>
                  <p className="mt-2 font-label text-xs uppercase tracking-[0.14em] text-on-surface-variant">Sectas detectadas</p>
                </div>
                <div>
                  <p className="font-headline text-5xl leading-none text-primary">{resumenCasos.abiertas}</p>
                  <p className="mt-2 font-label text-xs uppercase tracking-[0.14em] text-on-surface-variant">Casos abiertos</p>
                </div>
                <div>
                  <p className="font-headline text-5xl leading-none text-primary">{resumenCasos.referentes}</p>
                  <p className="mt-2 font-label text-xs uppercase tracking-[0.14em] text-on-surface-variant">Referentes</p>
                </div>
              </div>
            </section>

            <section className="mt-10 grid grid-cols-[minmax(0,1fr)_280px] gap-4">
              <div className="flex items-center justify-between rounded-[1.4rem] bg-surface-container-low px-6 py-6">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary">filter_alt</span>
                  <span className="text-lg font-medium text-on-surface">{filtrosSectas[0]}</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
              </div>
              <div className="rounded-[1.4rem] bg-surface-container-low px-6 py-6">
                <p className="text-lg text-on-surface-variant">Casos abiertos</p>
                <p className="mt-3 font-headline text-5xl leading-none text-primary">{resumenCasos.abiertas}</p>
                <p className="mt-2 font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">
                  {resumenCasos.referentes} referentes asignados
                </p>
              </div>
            </section>

            <section className="mt-10 grid grid-cols-1 gap-6 xl:grid-cols-2">
              {sectasEncontradas.map((secta) => renderSectaCard(secta))}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Sectas;
