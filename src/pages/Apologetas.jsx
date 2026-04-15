import React from 'react';
import { useNavigate } from 'react-router-dom';

const apologetas = [
  {
    nombre: 'Renato Valdes',
    especialidad: 'Apologetica Biblica',
    grado: 'Certificado de Apologetica',
    descripcion: 'Acompana grupos juveniles y desarrolla respuestas claras sobre fe, Escritura y tradicion.',
    defensas: 86,
    etiqueta: 'Activo en parroquias',
    icono: 'shield',
    color: 'text-primary',
    fondo: 'bg-primary/10',
  },
  {
    nombre: 'Carlos Mena',
    especialidad: 'Doctrina Catolica',
    grado: 'Estudios Propios',
    descripcion: 'Apoya procesos formativos para catequistas y responde consultas doctrinales frecuentes.',
    defensas: 64,
    etiqueta: 'Formacion basica',
    icono: 'menu_book',
    color: 'text-secondary',
    fondo: 'bg-secondary/10',
  },
  {
    nombre: 'Daniel Rojas',
    especialidad: 'Historia de la Iglesia',
    grado: 'Certificado Pastoral',
    descripcion: 'Colabora en charlas historicas y materiales para responder objeciones sobre la Iglesia.',
    defensas: 71,
    etiqueta: 'Archivo historico',
    icono: 'history_edu',
    color: 'text-primary',
    fondo: 'bg-primary/10',
  },
  {
    nombre: 'Miguel Torres',
    especialidad: 'Sectas y Nuevos Movimientos',
    grado: 'Escuela de Evangelizacion',
    descripcion: 'Da seguimiento a casos de confusion doctrinal y orienta con material pastoral accesible.',
    defensas: 93,
    etiqueta: 'Acompanamiento',
    icono: 'flare',
    color: 'text-error',
    fondo: 'bg-error/10',
  },
  {
    nombre: 'Andrea Salazar',
    especialidad: 'Filosofia Cristiana',
    grado: 'Diplomado en Apologetica',
    descripcion: 'Prepara talleres introductorios sobre razon, moral y dialogo con cultura contemporanea.',
    defensas: 58,
    etiqueta: 'Formadora',
    icono: 'psychology',
    color: 'text-secondary',
    fondo: 'bg-secondary/10',
  },
  {
    nombre: 'Paula Herrera',
    especialidad: 'Familia y Bioetica',
    grado: 'Estudios Propios',
    descripcion: 'Aporta argumentos sencillos para encuentros de matrimonio, vida y pastoral familiar.',
    defensas: 49,
    etiqueta: 'Bioetica',
    icono: 'favorite',
    color: 'text-primary',
    fondo: 'bg-primary/10',
  },
];

const resumen = [
  { valor: '124', etiqueta: 'Defensores' },
  { valor: '2.8k', etiqueta: 'Defensas' },
];

const filtros = [
  'Todas las especialidades',
  'Apologetica Biblica',
  'Doctrina Catolica',
  'Historia de la Iglesia',
];

const ordenes = ['Mas Activos', 'Recientes', 'Mas Formadores'];

const Apologetas = () => {
  const navigate = useNavigate();

  const goToDashboard = () => navigate('/dashboard');
  const goToApologetas = () => navigate('/apologetas');
  const handleLogout = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface text-on-background">
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
            <button
              onClick={goToDashboard}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/10 bg-surface-container-low text-primary"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          </header>

          <p className="mt-5 max-w-[19rem] text-sm leading-6 text-on-surface-variant">
            Custodios de la tradicion y la razon. Una red de apologetas con formacion pastoral y academica accesible.
          </p>

          <section className="mt-6 grid grid-cols-2 gap-4">
            {resumen.map((item) => (
              <article key={item.etiqueta} className="rounded-2xl bg-surface-container-low px-5 py-4 shadow-[0_8px_24px_rgba(26,28,26,0.05)]">
                <p className="font-headline text-4xl leading-none text-primary">{item.valor}</p>
                <p className="mt-2 font-label text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">{item.etiqueta}</p>
              </article>
            ))}
          </section>

          <section className="mt-6 space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-surface-container-low px-4 py-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">filter_list</span>
                <span className="text-sm font-medium text-on-surface">Todas las Especialidades</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-surface-container-low px-4 py-4">
              <span className="text-sm text-on-surface-variant">Ordenar por</span>
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <span>Mas Activos</span>
                <span className="material-symbols-outlined text-base">expand_more</span>
              </div>
            </div>
          </section>

          <section className="mt-6 space-y-4">
            {apologetas.map((apologeta) => (
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
                <div className="mt-5 flex items-center justify-between border-t border-outline-variant/20 pt-4">
                  <div>
                    <p className="font-headline text-4xl leading-none text-on-surface">{apologeta.defensas}</p>
                    <p className="mt-1 font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">Defensas realizadas</p>
                  </div>
                  <button className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/30 text-primary">
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>
              </article>
            ))}
          </section>
        </main>

        <button className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_14px_35px_rgba(113,89,24,0.35)]">
          <span className="material-symbols-outlined text-2xl">add</span>
        </button>

        <nav className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-1.5rem)] max-w-sm -translate-x-1/2 items-center justify-between rounded-[2rem] bg-surface-container-low px-6 py-4 shadow-[0_14px_35px_rgba(26,28,26,0.12)]">
          {[
            { label: 'Dashboard', icon: 'dashboard', active: false, action: goToDashboard },
            { label: 'Misiones', icon: 'menu_book', active: false, action: () => {} },
            { label: 'Apologetas', icon: 'shield', active: true, action: goToApologetas },
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
              <span className="font-label">Nuevo Perfil</span>
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
            <button className="flex w-full items-center gap-4 rounded-l-full px-4 py-3 text-left text-[#1a1c1a] opacity-60 transition-all duration-300 hover:bg-[#715918]/10 hover:opacity-100">
              <span className="material-symbols-outlined">explore_nearby</span>
              <span className="font-label">Misiones</span>
            </button>
            <button className="flex w-full items-center gap-4 rounded-l-full bg-[#715918]/5 px-4 py-3 text-left font-bold text-[#715918] transition-all duration-300">
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
                  placeholder="Buscar apologeta..."
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
                <p className="font-label text-xs uppercase tracking-[0.28em] text-secondary">DEFENSORES FIDEI</p>
                <h2 className="mt-3 font-headline text-7xl leading-[0.95] text-on-surface">Modulo de Apologetas</h2>
                <p className="mt-6 max-w-2xl text-xl leading-9 text-on-surface-variant">
                  Custodios de la tradicion y la razon. Una asamblea de servidores dedicados a la defensa intelectual y espiritual del magisterio.
                </p>
              </div>
              <div className="flex min-w-[240px] gap-10 border-l border-outline-variant/40 pl-10">
                {resumen.map((item) => (
                  <div key={item.etiqueta}>
                    <p className="font-headline text-5xl leading-none text-primary">{item.valor}</p>
                    <p className="mt-2 font-label text-xs uppercase tracking-[0.14em] text-on-surface-variant">{item.etiqueta}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-10 grid grid-cols-[minmax(0,1fr)_230px] gap-4">
              <div className="flex items-center justify-between rounded-[1.4rem] bg-surface-container-low px-6 py-6">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary">filter_alt</span>
                  <span className="text-lg font-medium text-on-surface">{filtros[0]}</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">expand_more</span>
              </div>
              <div className="flex items-center justify-between rounded-[1.4rem] bg-surface-container-low px-6 py-6">
                <span className="text-lg text-on-surface-variant">Ordenar por</span>
                <div className="flex items-center gap-2 font-semibold text-primary">
                  <span>{ordenes[0]}</span>
                  <span className="material-symbols-outlined text-base">expand_more</span>
                </div>
              </div>
            </section>

            <section className="mt-10 grid grid-cols-3 gap-6">
              {apologetas.map((apologeta) => (
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

                  <div className="mt-auto flex items-end justify-between border-t border-outline-variant/20 pt-6">
                    <div>
                      <p className="font-headline text-5xl leading-none text-on-surface">{apologeta.defensas}</p>
                      <p className="mt-2 font-label text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">Defensas realizadas</p>
                    </div>
                    <button className="flex h-10 w-10 items-center justify-center rounded-full text-primary">
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </div>
                </article>
              ))}
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

        <button className="fixed bottom-8 right-8 z-40 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_18px_40px_rgba(113,89,24,0.35)]">
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      </div>
    </div>
  );
};

export default Apologetas;
