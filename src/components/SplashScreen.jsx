import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Duración total de la pantalla de carga: 2.5 segundos
    const duration = 2500;
    const interval = 25;
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsExiting(true);
          setTimeout(onFinish, 800); // Esperar que termine la animación de salida (fade out)
          return 100;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-between bg-[#04060b] px-8 py-16 overflow-hidden transition-all duration-700 ease-in-out ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Fondo estilo amanecer dorado (Vaticano/Roma) con imágenes proporcionadas */}
      <div className="absolute inset-0 z-0">
        {/* Imagen para celular (visible en pantallas móviles, oculta en desktop) */}
        <div className="md:hidden absolute inset-0 bg-[url('/images/paracelular.png')] bg-cover bg-center"></div>
        {/* Imagen para desktop (visible en pantallas md y mayores, oculta en móvil) */}
        <div className="hidden md:block absolute inset-0 bg-[url('/images/paradesktop.png')] bg-cover bg-center"></div>

        {/* Sutil oscurecimiento en la parte inferior para asegurar que la barra de carga resalte */}
        <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#04060b] via-[#04060b]/50 to-transparent"></div>
      </div>

      {/* Logo Central */}
      <div className="flex-1 flex items-center justify-center relative z-10 w-full max-w-sm mt-10">
         <img 
           src="/images/Logo.png" 
           alt="CAI Logo" 
           className="w-full max-w-[280px] h-auto object-contain drop-shadow-[0_0_35px_rgba(216,192,139,0.4)] animate-in zoom-in duration-1000" 
         />
      </div>

      {/* Área inferior: Textos y barra de progreso */}
      <div className="w-full max-w-[320px] flex flex-col items-center gap-8 relative z-10 animate-in slide-in-from-bottom-10 fade-in duration-1000 delay-300 mb-6">
        <p className="cai-display text-center text-[#d8c08b] text-base md:text-lg uppercase tracking-[0.15em] leading-relaxed drop-shadow-md">
          Preparando el camino<br/>de la verdad
        </p>

        <div className="w-full relative py-2">
          {/* Contenedor de la barra de progreso */}
          <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)] border border-[#d8c08b]/20">
            <div 
              className="h-full bg-gradient-to-r from-[#cf5d67] via-[#d8c08b] to-[#fff3c7] rounded-full transition-all duration-75 ease-linear relative"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Destello brillante en la punta de la barra */}
          {progress > 0 && progress < 100 && (
            <>
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-[#fff3c7] rounded-full blur-[10px] opacity-80 transition-all duration-75 ease-linear mix-blend-screen"
                style={{ left: `calc(${progress}% - 20px)` }}
              ></div>
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full blur-[2px] transition-all duration-75 ease-linear shadow-[0_0_10px_#fff]"
                style={{ left: `calc(${progress}% - 6px)` }}
              ></div>
            </>
          )}
        </div>

        <p className="text-[11px] text-[#d8c08b]/70 uppercase tracking-[0.5em] font-bold">
          Cargando...
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;