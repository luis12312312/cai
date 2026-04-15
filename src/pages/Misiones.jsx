import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apologetas, misiones } from '../data/misionesData';

const initialForm = {
  titulo: '',
  tipo: 'Debate publico',
  lugar: '',
  fecha: '',
  evidencia: 'Fotos',
  apologetas: [],
};

const Misiones = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [misionesLocales, setMisionesLocales] = useState(misiones);

  const goToDashboard = () => navigate('/dashboard');
  const goToApologetas = () => navigate('/apologetas');
  const goToMisiones = () => navigate('/misiones');
  const handleLogout = (e) => {
    e.preventDefault();
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

  const onInputChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const toggleApologeta = (id) => {
    setForm((current) => ({
      ...current,
      apologetas: current.apologetas.includes(id)
        ? current.apologetas.filter((item) => item !== id)
        : [...current.apologetas, id],
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.titulo.trim() || !form.lugar.trim() || !form.fecha.trim() || form.apologetas.length === 0) {
      return;
    }

    const nuevaMision = {
      id: `mision-local-${Date.now()}`,
      titulo: form.titulo.trim(),
      tipo: form.tipo,
      lugar: form.lugar.trim(),
      fecha: form.fecha.trim(),
      evidencia: form.evidencia,
      resumen: `Mision creada para ${form.lugar.trim()} con enfoque en ${form.tipo.toLowerCase()}.`,
      apologetas: form.apologetas,
    };

    setMisionesLocales((current) => [nuevaMision, ...current]);
    setForm(initialForm);
  };

  const renderMissionCard = (mision) => (
    <article key={mision.id} className="rounded-[1.5rem] bg-surface-container-lowest p-5 shadow-[0_10px_30px_rgba(26,28,26,0.05)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-headline text-[2rem] leading-[1.02] text-on-surface">{mision.titulo}</h3>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.08em] text-secondary">{mision.tipo}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <span className="material-symbols-outlined">map</span>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-on-surface-variant">{mision.resumen}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">
          {mision.lugar}
        </span>
        <span className="rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">
          {mision.fecha}
        </span>
        <span className="rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] uppercase tracking-[0.16em] text-primary">
          {mision.evidencia}
        </span>
      </div>

      <div className="mt-5">
        <p className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Apologetas asignados</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {mision.nombresApologetas.map((nombre) => (
            <span key={nombre} className="rounded-full bg-primary/8 px-3 py-1 font-label text-[10px] uppercase tracking-[0.16em] text-primary">
              {nombre}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-outline-variant/20 pt-4">
        <button className="rounded-full border border-primary/20 px-4 py-2 font-label text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
          Ver evidencias
        </button>
        <button className="text-primary">
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </article>
  );

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

        <div>
          <p className="font-label text-[10px] uppercase tracking-[0.16em] text-on-surface-variant">Asignar apologetas</p>
          <div className="mt-3 grid grid-cols-1 gap-3">
            {apologetas.map((apologeta) => {
              const isChecked = form.apologetas.includes(apologeta.id);
              return (
                <label
                  key={apologeta.id}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl px-4 py-3 ${
                    isChecked ? 'bg-primary/10 text-primary' : 'bg-surface-container-lowest text-on-surface'
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold">{apologeta.nombre}</p>
                    <p className="text-xs text-on-surface-variant">{apologeta.especialidad}</p>
                  </div>
                  <input
                    checked={isChecked}
                    onChange={() => toggleApologeta(apologeta.id)}
                    className="h-4 w-4 rounded border-primary/30 text-primary focus:ring-primary/20"
                    type="checkbox"
                  />
                </label>
              );
            })}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-2xl bg-primary px-5 py-4 font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_12px_30px_rgba(113,89,24,0.25)]"
      >
        Guardar mision
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-surface text-on-background">
      <div className="md:hidden">
        <main className="mx-auto max-w-sm px-5 pb-32 pt-5">
          <header className="flex items-center justify-between">
            <div>
              <p className="font-label text-[10px] uppercase tracking-[0.35em] text-secondary">MISIONES ACTIVAS</p>
              <h1 className="mt-3 max-w-[15rem] font-headline text-[2.75rem] leading-[0.98] text-on-surface">
                Modulo de
                <br />
                Misiones
              </h1>
            </div>
            <button
              onClick={goToDashboard}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/10 bg-surface-container-low text-primary"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          </header>

          <p className="mt-5 text-sm leading-6 text-on-surface-variant">
            Administra las misiones, registra nuevas salidas y asigna varios apologetas en un mismo frente pastoral.
          </p>

          <section className="mt-6 grid grid-cols-2 gap-4">
            <article className="rounded-2xl bg-surface-container-low px-5 py-4 shadow-[0_8px_24px_rgba(26,28,26,0.05)]">
              <p className="font-headline text-4xl leading-none text-primary">{misionesEnriquecidas.length}</p>
              <p className="mt-2 font-label text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">Misiones</p>
            </article>
            <article className="rounded-2xl bg-surface-container-low px-5 py-4 shadow-[0_8px_24px_rgba(26,28,26,0.05)]">
              <p className="font-headline text-4xl leading-none text-primary">{apologetas.length}</p>
              <p className="mt-2 font-label text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">Apologetas</p>
            </article>
          </section>

          <section className="mt-6">{renderForm(true)}</section>

          <section className="mt-6 space-y-4">
            {misionesEnriquecidas.map((mision) => renderMissionCard(mision))}
          </section>
        </main>

        <nav className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-1.5rem)] max-w-sm -translate-x-1/2 items-center justify-between rounded-[2rem] bg-surface-container-low px-6 py-4 shadow-[0_14px_35px_rgba(26,28,26,0.12)]">
          {[
            { label: 'Dashboard', icon: 'dashboard', active: false, action: goToDashboard },
            { label: 'Misiones', icon: 'menu_book', active: true, action: goToMisiones },
            { label: 'Apologetas', icon: 'shield', active: false, action: goToApologetas },
            { label: 'Sectas', icon: 'flare', active: false, action: () => {} },
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
                <h2 className="font-headline text-lg font-bold leading-tight text-[#715918]">Fr. Julian</h2>
                <p className="text-xs font-label uppercase tracking-widest opacity-60">Presbitero</p>
              </div>
            </div>
            <button className="vatican-gradient flex w-full items-center justify-center gap-2 rounded-xl py-3 font-medium text-on-primary shadow-lg shadow-primary/10">
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
              className="flex w-full items-center gap-4 rounded-l-full bg-[#715918]/5 px-4 py-3 text-left font-bold text-[#715918] transition-all duration-300"
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
            <button className="flex w-full items-center gap-4 rounded-l-full px-4 py-3 text-left text-[#1a1c1a] opacity-60 transition-all duration-300 hover:bg-[#715918]/10 hover:opacity-100">
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
                  placeholder="Buscar mision..."
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
                <p className="font-label text-xs uppercase tracking-[0.28em] text-secondary">MISIONES ACTIVAS</p>
                <h2 className="mt-3 font-headline text-7xl leading-[0.95] text-on-surface">Modulo de Misiones</h2>
                <p className="mt-6 max-w-2xl text-xl leading-9 text-on-surface-variant">
                  Registra salidas apostolicas, organiza frentes de trabajo y asigna una mision a varios apologetas.
                </p>
              </div>
              <div className="flex min-w-[240px] gap-10 border-l border-outline-variant/40 pl-10">
                <div>
                  <p className="font-headline text-5xl leading-none text-primary">{misionesEnriquecidas.length}</p>
                  <p className="mt-2 font-label text-xs uppercase tracking-[0.14em] text-on-surface-variant">Misiones</p>
                </div>
                <div>
                  <p className="font-headline text-5xl leading-none text-primary">{apologetas.length}</p>
                  <p className="mt-2 font-label text-xs uppercase tracking-[0.14em] text-on-surface-variant">Apologetas</p>
                </div>
              </div>
            </section>

            <section className="mt-10 grid grid-cols-[360px_minmax(0,1fr)] gap-8">
              <div>{renderForm()}</div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  {misionesEnriquecidas.map((mision) => renderMissionCard(mision))}
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Misiones;
