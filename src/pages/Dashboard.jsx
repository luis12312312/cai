import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="bg-surface text-on-background min-h-screen">
      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 h-full flex flex-col py-8 px-4 border-r border-[#715918]/5 bg-[#faf9f5] w-72 z-40">
        <div className="mb-10 px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-primary/20">
              <img 
                alt="Vatican Insignia" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsA9vxxIuSP7qNG1e99bXXi-5fFMtg83C45ejeEN0AP56SQTm_kmFT9-NJPL-fRJ9dbSzB7PXCHNEyeXrgzlBENs8oajQkFV5sVOnmPrG9IPtkmqYJF9tQMCtvqZFHACLprAUlENal-TockvP34u0U4NECCLbyBKv4EXczJ1pJxv8ArWR6jvKEifgjVOv0Xp1szkGrJPVApiKGw0gPYk6btrJBeovJwSundEl4zuc2JDbBVBE_mWCv7dkKRsOlAQtJoTuG54GL"
              />
            </div>
            <div>
              <h2 className="text-[#715918] font-headline font-bold text-lg leading-tight">Fr. Julián</h2>
              <p className="text-xs font-label uppercase tracking-widest opacity-60">Presbítero</p>
            </div>
          </div>
          <button className="w-full vatican-gradient text-on-primary py-3 rounded-xl font-medium shadow-lg shadow-primary/10 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <span className="material-symbols-outlined text-sm">add</span>
            <span className="font-label">Nueva Misión</span>
          </button>
        </div>
        <nav className="flex-1 space-y-2">
          <a className="flex items-center gap-4 px-4 py-3 text-[#715918] bg-[#715918]/5 rounded-l-full font-bold transition-all duration-300" href="#">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label">Dashboard</span>
          </a>
          <a className="flex items-center gap-4 px-4 py-3 text-[#1a1c1a] opacity-60 hover:bg-[#715918]/10 hover:opacity-100 rounded-l-full transition-all duration-300" href="#">
            <span className="material-symbols-outlined">explore_nearby</span>
            <span className="font-label">Misiones</span>
          </a>
          <a className="flex items-center gap-4 px-4 py-3 text-[#1a1c1a] opacity-60 hover:bg-[#715918]/10 hover:opacity-100 rounded-l-full transition-all duration-300" href="#">
            <span className="material-symbols-outlined">menu_book</span>
            <span className="font-label">Apologetas</span>
          </a>
          <a className="flex items-center gap-4 px-4 py-3 text-[#1a1c1a] opacity-60 hover:bg-[#715918]/10 hover:opacity-100 rounded-l-full transition-all duration-300" href="#">
            <span className="material-symbols-outlined">gavel</span>
            <span className="font-label">Sectas</span>
          </a>
        </nav>
        <div className="pt-6 border-t border-primary/5 space-y-2">
          <a className="flex items-center gap-4 px-4 py-3 text-[#1a1c1a] opacity-60 hover:opacity-100 transition-all" href="#">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-label">Ajustes</span>
          </a>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 text-error opacity-80 hover:opacity-100 transition-all"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-72 min-h-screen">
        {/* TopNavBar */}
        <header className="sticky top-0 w-full flex justify-between items-center px-12 h-16 bg-[#faf9f5]/80 backdrop-blur-xl border-b border-[#715918]/10 z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-headline font-bold tracking-tight text-[#715918]">Plataforma Cruzada Apologética Itinerante</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <input 
                className="bg-surface-container-low border-none rounded-full px-5 py-1.5 text-sm w-64 focus:ring-1 focus:ring-primary/30 transition-all font-body" 
                placeholder="Buscar registros..." 
                type="text"
              />
              <span className="material-symbols-outlined absolute right-3 top-1.5 text-primary/40 text-lg">search</span>
            </div>
            <div className="flex items-center gap-4 text-primary">
              <button className="hover:opacity-70 transition-opacity"><span className="material-symbols-outlined">notifications</span></button>
              <button className="hover:opacity-70 transition-opacity"><span className="material-symbols-outlined">church</span></button>
              <div className="h-8 w-8 rounded-full bg-secondary-container/20 flex items-center justify-center border border-secondary/10">
                <img 
                  alt="Fr. Julián profile" 
                  className="w-full h-full object-cover rounded-full" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4FPW5a5r2emMl-FP0G6anRID7uZKA82HEHefYctG5RS-JpV6n3uxzl-8WPyjlYC9DzyWSMx-xeb9bHOFCG6yYvx0Vz8wS4M7UkVK0xODhoLKc7_WRq8nXNucuDXP6xWWEYNetgg_O1UB671Hm0REOGXtESY4fkT7SqFdLn_rO-ff1F1sJ9IyIqyEli4dFk6xgCNw6R9coWJBmK28V3PkkVD178YXiwyVNBvacOwEBADcLaz_F1V6v3Ahrf_lg9_3KJK-qRrwv"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Canvas */}
        <div className="p-12 space-y-12 max-w-7xl mx-auto">
          {/* Hero Title & Context */}
          <section className="flex justify-between items-end">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-headline font-bold text-on-surface leading-tight">Estado de la Defensa de la Fe</h2>
              <p className="mt-4 text-lg text-on-surface-variant font-body leading-relaxed">Bienvenido, Fr. Julián. El despliegue itinerante se mantiene activo en 14 diócesis. El rigor académico y la caridad pastoral guían nuestra misión.</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-label uppercase tracking-widest text-primary mb-1">Última actualización</p>
              <p className="text-xl font-headline font-medium">12 de Octubre, 2023</p>
            </div>
          </section>

          {/* Bento Grid Overview */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Active Missions Card */}
            <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10 flex flex-col justify-between group hover:border-primary/20 transition-all duration-300 h-64">
              <div className="flex justify-between items-start">
                <div className="bg-primary/5 p-3 rounded-lg text-primary">
                  <span className="material-symbols-outlined text-3xl">map</span>
                </div>
                <span className="text-xs font-label text-[#2e7d32] flex items-center gap-1 font-bold">+2 este mes</span>
              </div>
              <div>
                <p className="text-sm font-label uppercase tracking-widest text-on-surface-variant mb-1">Misiones Activas</p>
                <h3 className="text-5xl font-headline font-bold text-primary">24</h3>
              </div>
            </div>

            {/* Registered Apologetas Card */}
            <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10 flex flex-col justify-between group hover:border-secondary/20 transition-all duration-300 h-64">
              <div className="flex justify-between items-start">
                <div className="bg-secondary/5 p-3 rounded-lg text-secondary">
                  <span className="material-symbols-outlined text-3xl">groups</span>
                </div>
                <span className="text-xs font-label text-on-surface-variant opacity-60">Cuerpo Académico</span>
              </div>
              <div>
                <p className="text-sm font-label uppercase tracking-widest text-on-surface-variant mb-1">Apologetas Registrados</p>
                <h3 className="text-5xl font-headline font-bold text-secondary">158</h3>
              </div>
            </div>

            {/* Sect Alerts Card */}
            <div className="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10 flex flex-col justify-between group hover:border-error/20 transition-all duration-300 h-64">
              <div className="flex justify-between items-start">
                <div className="bg-error/5 p-3 rounded-lg text-error">
                  <span className="material-symbols-outlined text-3xl">warning</span>
                </div>
                <span className="px-2 py-1 bg-error text-on-error text-[10px] font-bold rounded-full uppercase tracking-tighter">Crítico</span>
              </div>
              <div>
                <p className="text-sm font-label uppercase tracking-widest text-on-surface-variant mb-1">Alertas de Sectas</p>
                <h3 className="text-5xl font-headline font-bold text-error">09</h3>
              </div>
            </div>
          </section>

          {/* Secondary Layout: Chart and Activities */}
          <section className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Mission Status Chart (Visual Representation) */}
            <div className="lg:col-span-3 space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-2xl font-headline font-bold">Estado de las Misiones</h4>
                <button className="text-sm font-label text-primary underline underline-offset-4 decoration-primary/30">Ver reporte extendido</button>
              </div>
              <div className="bg-surface-container-low p-10 rounded-xl aspect-video relative flex items-end justify-between gap-4 overflow-hidden border border-outline-variant/5">
                {/* Simulated Chart Bars */}
                {['CDMX', 'Gto.', 'Jal.', 'Pue.', 'Ver.'].map((city, index) => {
                  const heights = ['h-24', 'h-40', 'h-56', 'h-32', 'h-44'];
                  const containerHeights = ['h-32', 'h-48', 'h-64', 'h-40', 'h-56'];
                  return (
                    <div key={city} className="flex-1 flex flex-col items-center gap-4">
                      <div className={`w-full bg-primary/20 rounded-t-full ${containerHeights[index]} relative group`}>
                        <div className={`absolute bottom-0 w-full bg-primary ${heights[index]} transition-all duration-500 rounded-t-full group-hover:brightness-110`}></div>
                      </div>
                      <span className="text-[10px] font-label uppercase tracking-tighter opacity-50">{city}</span>
                    </div>
                  );
                })}
                {/* Background Texture */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #715918 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
              </div>
            </div>

            {/* Recent Activity (Sectas) */}
            <div className="lg:col-span-2 space-y-6">
              <h4 className="text-2xl font-headline font-bold">Actividad de Sectas</h4>
              <div className="space-y-4">
                {/* Activity Item 1 */}
                <div className="bg-surface-container-lowest p-5 rounded-xl border-l-4 border-error flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-error">new_releases</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-sm">Nuevo Avistamiento: Gnosticismo Moderno</h5>
                    <p className="text-xs text-on-surface-variant mt-1">Detectada actividad proselitista en la zona norte de Querétaro.</p>
                    <span className="text-[10px] text-on-surface-variant opacity-50 mt-2 block font-label uppercase">Hace 2 horas</span>
                  </div>
                </div>
                {/* Activity Item 2 */}
                <div className="bg-surface-container-lowest p-5 rounded-xl border-l-4 border-secondary flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary">assignment</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-sm">Actualización de Expediente</h5>
                    <p className="text-xs text-on-surface-variant mt-1">Fr. Carlos actualizó la ficha sobre neopaganismo en áreas rurales.</p>
                    <span className="text-[10px] text-on-surface-variant opacity-50 mt-2 block font-label uppercase">Hace 5 horas</span>
                  </div>
                </div>
                {/* Activity Item 3 */}
                <div className="bg-surface-container-lowest p-5 rounded-xl border-l-4 border-primary flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary">verified</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-sm">Misión Completada</h5>
                    <p className="text-xs text-on-surface-variant mt-1">Taller de apologética en Parroquia de San Juan finalizado con éxito.</p>
                    <span className="text-[10px] text-on-surface-variant opacity-50 mt-2 block font-label uppercase">Ayer</span>
                  </div>
                </div>
              </div>
              <button className="w-full py-4 text-sm font-label font-bold text-primary bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors uppercase tracking-widest">Ver Todo el Historial</button>
            </div>
          </section>

          {/* Institutional Footer Note */}
          <footer className="pt-12 border-t border-outline-variant/10 flex justify-between items-center text-on-surface-variant opacity-40 text-xs font-label">
            <p>© 2023 Plataforma Cruzada Apologética Itinerante | Ad maiorem Dei gloriam</p>
            <div className="flex gap-6">
              <a className="hover:underline" href="#">Manual de Protocolo</a>
              <a className="hover:underline" href="#">Directorio Ecclesiástico</a>
              <a className="hover:underline" href="#">Seguridad de Datos</a>
            </div>
          </footer>
        </div>
      </main>

      {/* Floating Back to Top Decoration (Subtle Arch) */}
      <div className="fixed bottom-8 right-8 w-12 h-20 bg-primary/5 border border-primary/10 arch-mask backdrop-blur-md flex flex-col items-center justify-center text-primary hover:bg-primary/10 transition-all cursor-pointer opacity-50 hover:opacity-100 group">
        <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-y-1">expand_less</span>
        <div className="w-[1px] h-8 bg-primary/20 mt-2"></div>
      </div>
    </div>
  );
};

export default Dashboard;
