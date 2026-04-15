import React from 'react';
import { useNavigate } from 'react-router-dom';

const mobileStats = [
  {
    title: 'Apologetas',
    value: '148',
    icon: 'shield',
    iconColor: 'text-secondary',
  },
  {
    title: 'Alertas sectas',
    value: '03',
    icon: 'flare',
    iconColor: 'text-error',
  },
];

const mobileActivities = [
  {
    title: 'Nueva Tesis Defensiva',
    description: 'Refutacion sobre el neo-gnosticismo contemporaneo publicada por el P. Julian.',
    time: 'hace 2 horas',
    icon: 'shield',
    accent: 'bg-primary',
  },
  {
    title: 'Mision Itinerante Iniciada',
    description: 'El equipo Alfa ha llegado a la Diocesis de San Juan para la Cruzada de Verano.',
    time: 'hace 5 horas',
    icon: 'location_on',
    accent: 'bg-secondary',
  },
];

const desktopActivities = [
  {
    title: 'Nuevo Avistamiento: Gnosticismo Moderno',
    description: 'Detectada actividad proselitista en la zona norte de Queretaro.',
    time: 'Hace 2 horas',
    icon: 'new_releases',
    border: 'border-error',
    iconColor: 'text-error',
  },
  {
    title: 'Actualizacion de Expediente',
    description: 'Fr. Carlos actualizo la ficha sobre neopaganismo en areas rurales.',
    time: 'Hace 5 horas',
    icon: 'assignment',
    border: 'border-secondary',
    iconColor: 'text-secondary',
  },
  {
    title: 'Mision Completada',
    description: 'Taller de apologetica en Parroquia de San Juan finalizado con exito.',
    time: 'Ayer',
    icon: 'verified',
    border: 'border-primary',
    iconColor: 'text-primary',
  },
];

const desktopStats = [
  {
    title: 'Misiones Activas',
    value: '24',
    icon: 'map',
    iconColor: 'text-primary',
    bg: 'bg-primary/5',
    note: '+2 este mes',
    noteColor: 'text-[#2e7d32]',
  },
  {
    title: 'Apologetas Registrados',
    value: '158',
    icon: 'groups',
    iconColor: 'text-secondary',
    bg: 'bg-secondary/5',
    note: 'Cuerpo Academico',
    noteColor: 'text-on-surface-variant opacity-60',
  },
  {
    title: 'Alertas de Sectas',
    value: '09',
    icon: 'warning',
    iconColor: 'text-error',
    bg: 'bg-error/5',
    badge: 'Critico',
  },
];

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface text-on-background">
      <div className="md:hidden">
        <main className="mx-auto min-h-screen max-w-sm px-5 pb-32 pt-5">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/10 bg-surface-container-low shadow-sm">
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  shield_person
                </span>
              </div>
              <div>
                <p className="font-headline text-[1.45rem] font-bold leading-tight text-primary">
                  Plataforma Cruzada Apologetica Itinerante
                </p>
              </div>
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-primary">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </header>

          <section className="mt-8">
            <p className="font-label text-[10px] uppercase tracking-[0.35em] text-on-surface-variant">PAX ET BONUM</p>
            <h1 className="mt-4 font-headline text-[3rem] leading-[1.02] text-on-surface">
              Bienvenido al
              <br />
              <span className="italic text-primary">Santuario Digital</span>
            </h1>
            <div className="mt-5 h-1 w-10 rounded-full bg-primary"></div>
          </section>

          <section className="mt-8 rounded-[1.9rem] bg-surface-container-low p-6 shadow-[0_10px_30px_rgba(26,28,26,0.06)]">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined">menu_book</span>
              </div>
              <span className="material-symbols-outlined text-[5.5rem] leading-none text-primary/10">church</span>
            </div>
            <div className="-mt-4">
              <p className="font-label text-xs uppercase tracking-[0.22em] text-on-surface-variant">Misiones activas</p>
              <p className="mt-2 font-headline text-6xl leading-none text-primary">12</p>
            </div>
          </section>

          <section className="mt-4 grid grid-cols-2 gap-4">
            {mobileStats.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl bg-surface-container-lowest p-5 shadow-[0_8px_24px_rgba(26,28,26,0.05)]"
              >
                <span className={`material-symbols-outlined text-xl ${item.iconColor}`}>{item.icon}</span>
                <p className={`mt-6 font-headline text-4xl leading-none ${item.iconColor}`}>{item.value}</p>
                <p className="mt-2 font-label text-[11px] uppercase tracking-[0.2em] text-on-surface-variant">
                  {item.title}
                </p>
              </article>
            ))}
          </section>

          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-4xl text-on-surface">Actividad Reciente</h2>
              <button className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Ver todo
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {mobileActivities.map((activity) => (
                <article
                  key={activity.title}
                  className="rounded-2xl bg-surface-container-lowest p-4 shadow-[0_8px_24px_rgba(26,28,26,0.05)]"
                >
                  <div className="flex gap-4">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white ${activity.accent}`}>
                      <span className="material-symbols-outlined text-lg">{activity.icon}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[1.05rem] font-semibold leading-snug text-on-surface">{activity.title}</h3>
                      <p className="mt-1 text-sm leading-5 text-on-surface-variant">{activity.description}</p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section
            className="mt-6 overflow-hidden rounded-2xl"
            style={{
              backgroundImage:
                "linear-gradient(0deg, rgba(0,0,0,0.66), rgba(0,0,0,0.18)), url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="px-5 py-7 text-white">
              <h3 className="max-w-[14rem] font-headline text-3xl leading-tight">Biblioteca de Doctrina</h3>
              <p className="mt-2 max-w-[15rem] text-sm leading-5 text-white/90">
                Accede a los manuscritos sagrados de la apologetica biblica y teologica.
              </p>
              <button className="mt-5 rounded-full border border-white/30 px-4 py-2 font-label text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                Consultar archivos
              </button>
            </div>
          </section>
        </main>

        <nav className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-1.5rem)] max-w-sm -translate-x-1/2 items-center justify-between rounded-[2rem] bg-surface-container-low px-6 py-4 shadow-[0_14px_35px_rgba(26,28,26,0.12)]">
          {[
            { label: 'Dashboard', icon: 'dashboard', active: true },
            { label: 'Misiones', icon: 'menu_book' },
            { label: 'Apologetas', icon: 'shield' },
            { label: 'Sectas', icon: 'flare' },
          ].map((item) => (
            <button key={item.label} className="flex flex-col items-center gap-1">
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
                  alt="Vatican Insignia"
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsA9vxxIuSP7qNG1e99bXXi-5fFMtg83C45ejeEN0AP56SQTm_kmFT9-NJPL-fRJ9dbSzB7PXCHNEyeXrgzlBENs8oajQkFV5sVOnmPrG9IPtkmqYJF9tQMCtvqZFHACLprAUlENal-TockvP34u0U4NECCLbyBKv4EXczJ1pJxv8ArWR6jvKEifgjVOv0Xp1szkGrJPVApiKGw0gPYk6btrJBeovJwSundEl4zuc2JDbBVBE_mWCv7dkKRsOlAQtJoTuG54GL"
                />
              </div>
              <div>
                <h2 className="font-headline text-lg font-bold leading-tight text-[#715918]">Fr. Julian</h2>
                <p className="text-xs font-label uppercase tracking-widest opacity-60">Presbitero</p>
              </div>
            </div>
            <button className="vatican-gradient flex w-full items-center justify-center gap-2 rounded-xl py-3 font-medium text-on-primary shadow-lg shadow-primary/10 transition-transform hover:scale-[1.02] active:scale-[0.98]">
              <span className="material-symbols-outlined text-sm">add</span>
              <span className="font-label">Nueva Mision</span>
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            <a className="flex items-center gap-4 rounded-l-full bg-[#715918]/5 px-4 py-3 font-bold text-[#715918] transition-all duration-300" href="#">
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-label">Dashboard</span>
            </a>
            <a className="flex items-center gap-4 rounded-l-full px-4 py-3 text-[#1a1c1a] opacity-60 transition-all duration-300 hover:bg-[#715918]/10 hover:opacity-100" href="#">
              <span className="material-symbols-outlined">explore_nearby</span>
              <span className="font-label">Misiones</span>
            </a>
            <a className="flex items-center gap-4 rounded-l-full px-4 py-3 text-[#1a1c1a] opacity-60 transition-all duration-300 hover:bg-[#715918]/10 hover:opacity-100" href="#">
              <span className="material-symbols-outlined">menu_book</span>
              <span className="font-label">Apologetas</span>
            </a>
            <a className="flex items-center gap-4 rounded-l-full px-4 py-3 text-[#1a1c1a] opacity-60 transition-all duration-300 hover:bg-[#715918]/10 hover:opacity-100" href="#">
              <span className="material-symbols-outlined">gavel</span>
              <span className="font-label">Sectas</span>
            </a>
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
                  placeholder="Buscar registros..."
                  type="text"
                />
                <span className="material-symbols-outlined absolute right-3 top-1.5 text-lg text-primary/40">search</span>
              </div>
              <div className="flex items-center gap-4 text-primary">
                <button className="transition-opacity hover:opacity-70">
                  <span className="material-symbols-outlined">notifications</span>
                </button>
                <button className="transition-opacity hover:opacity-70">
                  <span className="material-symbols-outlined">church</span>
                </button>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-secondary/10 bg-secondary-container/20">
                  <img
                    alt="Fr. Julian profile"
                    className="h-full w-full rounded-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4FPW5a5r2emMl-FP0G6anRID7uZKA82HEHefYctG5RS-JpV6n3uxzl-8WPyjlYC9DzyWSMx-xeb9bHOFCG6yYvx0Vz8wS4M7UkVK0xODhoLKc7_WRq8nXNucuDXP6xWWEYNetgg_O1UB671Hm0REOGXtESY4fkT7SqFdLn_rO-ff1F1sJ9IyIqyEli4dFk6xgCNw6R9coWJBmK28V3PkkVD178YXiwyVNBvacOwEBADcLaz_F1V6v3Ahrf_lg9_3KJK-qRrwv"
                  />
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl space-y-12 p-12">
            <section className="flex items-end justify-between">
              <div className="max-w-2xl">
                <h2 className="font-headline text-5xl font-bold leading-tight text-on-surface">Estado de la Defensa de la Fe</h2>
                <p className="mt-4 text-lg leading-relaxed text-on-surface-variant">
                  Bienvenido, Fr. Julian. El despliegue itinerante se mantiene activo en 14 diocesis. El rigor academico y
                  la caridad pastoral guian nuestra mision.
                </p>
              </div>
              <div className="text-right">
                <p className="mb-1 text-xs font-label uppercase tracking-widest text-primary">Ultima actualizacion</p>
                <p className="font-headline text-xl font-medium">12 de Octubre, 2023</p>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-8 xl:grid-cols-3">
              {desktopStats.map((stat) => (
                <article
                  key={stat.title}
                  className="group flex h-64 flex-col justify-between rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-8 transition-all duration-300 hover:border-primary/20"
                >
                  <div className="flex items-start justify-between">
                    <div className={`rounded-lg p-3 ${stat.bg} ${stat.iconColor}`}>
                      <span className="material-symbols-outlined text-3xl">{stat.icon}</span>
                    </div>
                    {stat.badge ? (
                      <span className="rounded-full bg-error px-2 py-1 text-[10px] font-bold uppercase tracking-tighter text-on-error">
                        {stat.badge}
                      </span>
                    ) : (
                      <span className={`text-xs font-label font-bold ${stat.noteColor}`}>{stat.note}</span>
                    )}
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-label uppercase tracking-widest text-on-surface-variant">{stat.title}</p>
                    <h3 className={`font-headline text-5xl font-bold ${stat.iconColor}`}>{stat.value}</h3>
                  </div>
                </article>
              ))}
            </section>

            <section className="grid grid-cols-1 gap-12 lg:grid-cols-5">
              <div className="space-y-6 lg:col-span-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-headline text-2xl font-bold">Estado de las Misiones</h4>
                  <button className="text-sm font-label text-primary underline decoration-primary/30 underline-offset-4">
                    Ver reporte extendido
                  </button>
                </div>
                <div className="relative flex aspect-video items-end justify-between gap-4 overflow-hidden rounded-xl border border-outline-variant/5 bg-surface-container-low p-10">
                  {['CDMX', 'Gto.', 'Jal.', 'Pue.', 'Ver.'].map((city, index) => {
                    const heights = ['h-24', 'h-40', 'h-56', 'h-32', 'h-44'];
                    const containerHeights = ['h-32', 'h-48', 'h-64', 'h-40', 'h-56'];
                    return (
                      <div key={city} className="flex flex-1 flex-col items-center gap-4">
                        <div className={`relative w-full rounded-t-full bg-primary/20 ${containerHeights[index]}`}>
                          <div className={`absolute bottom-0 w-full rounded-t-full bg-primary transition-all duration-500 ${heights[index]}`}></div>
                        </div>
                        <span className="text-[10px] font-label uppercase tracking-tighter opacity-50">{city}</span>
                      </div>
                    );
                  })}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'radial-gradient(circle, #715918 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                  ></div>
                </div>
              </div>

              <div className="space-y-6 lg:col-span-2">
                <h4 className="font-headline text-2xl font-bold">Actividad de Sectas</h4>
                <div className="space-y-4">
                  {desktopActivities.map((activity) => (
                    <article key={activity.title} className={`flex items-start gap-4 rounded-xl border-l-4 bg-surface-container-lowest p-5 ${activity.border}`}>
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-high">
                        <span className={`material-symbols-outlined ${activity.iconColor}`}>{activity.icon}</span>
                      </div>
                      <div>
                        <h5 className="text-sm font-bold">{activity.title}</h5>
                        <p className="mt-1 text-xs text-on-surface-variant">{activity.description}</p>
                        <span className="mt-2 block text-[10px] font-label uppercase text-on-surface-variant opacity-50">{activity.time}</span>
                      </div>
                    </article>
                  ))}
                </div>
                <button className="w-full rounded-xl bg-primary/5 py-4 text-sm font-label font-bold uppercase tracking-widest text-primary transition-colors hover:bg-primary/10">
                  Ver Todo el Historial
                </button>
              </div>
            </section>

            <footer className="flex items-center justify-between border-t border-outline-variant/10 pt-12 text-xs font-label text-on-surface-variant opacity-40">
              <p>© 2023 Plataforma Cruzada Apologetica Itinerante | Ad maiorem Dei gloriam</p>
              <div className="flex gap-6">
                <a className="hover:underline" href="#">Manual de Protocolo</a>
                <a className="hover:underline" href="#">Directorio Ecclesiastico</a>
                <a className="hover:underline" href="#">Seguridad de Datos</a>
              </div>
            </footer>
          </div>
        </main>

        <div className="arch-mask group fixed bottom-8 right-8 flex h-20 w-12 cursor-pointer flex-col items-center justify-center border border-primary/10 bg-primary/5 text-primary opacity-50 backdrop-blur-md transition-all hover:bg-primary/10 hover:opacity-100">
          <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-y-1">expand_less</span>
          <div className="mt-2 h-8 w-[1px] bg-primary/20"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
