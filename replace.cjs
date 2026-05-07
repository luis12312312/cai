const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'Apologetas.jsx');
let file = fs.readFileSync(filePath, 'utf8');

const searchStr = '  return (\\n    <div className="min-h-screen bg-surface text-on-background">\\n      {renderMissionDetail()}\\n      <div className="md:hidden">';

const idx = file.indexOf('  return (\n    <div className="min-h-screen bg-surface text-on-background">');

if (idx === -1) {
  console.log("String not found");
  process.exit(1);
}

const newReturn = `  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {renderMissionDetail()}
      <header className="flex flex-col gap-2">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#cf5d67] font-semibold">Defensores Fidei</p>
        <h1 className="cai-display text-3xl md:text-5xl text-white">
          Módulo de <span className="italic text-[#d8c08b]">Apologetas</span>
        </h1>
        <div className="h-0.5 w-16 bg-gradient-to-r from-[#cf5d67] to-[#d8c08b] mt-2"></div>
      </header>

      <p className="text-sm leading-relaxed text-white/70 max-w-2xl">
        Custodios de la tradición y la razón. Una red de apologetas con formación pastoral y académica accesible.
      </p>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {resumenApologetas.map((item) => (
          <article key={item.etiqueta} className="cai-card rounded-2xl p-5 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <span className="material-symbols-outlined text-6xl text-[#d8c08b]">shield</span>
            </div>
            <p className="cai-display text-3xl text-[#d8c08b] relative z-10">{item.valor}</p>
            <p className="mt-1 text-[9px] uppercase tracking-widest text-white/50 relative z-10">{item.etiqueta}</p>
          </article>
        ))}
      </section>

      {renderReviewRequests()}

      <section className="mt-8 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="cai-display text-2xl text-white">Soldados Activos</h2>
        </div>

        {isLoadingApologetas ? (
          <div className="text-center py-10 text-white/50">Cargando soldados...</div>
        ) : apologetasList.length === 0 ? (
          <div className="cai-panel rounded-2xl p-8 border border-white/5 text-center">
            <span className="material-symbols-outlined text-4xl text-white/20 mb-2">group_off</span>
            <p className="text-sm text-white/50">No se encontraron soldados registrados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apologetasList.map((soldado) => (
              <article key={soldado.id} className="cai-card rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
                <div className="flex items-center gap-4 relative z-10">
                  <div className="h-14 w-14 rounded-full border-2 border-[#d8c08b]/20 bg-black/40 flex items-center justify-center text-[#d8c08b] overflow-hidden">
                    {soldado.avatar ? (
                      <img src={soldado.avatar} alt={soldado.nombre} className="h-full w-full object-cover opacity-80" />
                    ) : (
                      <span className="material-symbols-outlined text-2xl">shield_person</span>
                    )}
                  </div>
                  <div>
                    <h3 className="cai-display text-lg text-white group-hover:text-[#d8c08b] transition-colors">{soldado.nombre}</h3>
                    <p className="text-[10px] uppercase tracking-widest text-white/50">{soldado.rango}</p>
                  </div>
                </div>
                
                <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4 relative z-10">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-[#cf5d67]">Estado</p>
                    <p className="mt-1 text-xs font-semibold text-white/80">{soldado.estado}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-[#cf5d67]">Registro</p>
                    <p className="mt-1 text-xs font-semibold text-white/80">{soldado.ultimaActividad}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Apologetas;
`;

fs.writeFileSync(filePath, file.substring(0, idx) + newReturn);
console.log("Done");