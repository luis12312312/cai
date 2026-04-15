import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login
    navigate('/dashboard');
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Architectural Motif */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <img 
          alt="" 
          className="w-full h-full object-cover grayscale" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgjmRHDMsIitW5NaB6l6C00CvYAAfhEyGJkW4WcTh_lZv8G4ApkVJ01QjNbFYwAp0H-mIZiNkg-2Bo8_NfZ3kfzwbrHe4PRuPpNqh5Q9aisu_c2QU9R7hhWy02D9lCnbMslxgQi3tcLh25fzjo7mZk5LHbppcrqpF0nNyeooHEd297Ir-yAo4uTqk0FamcMmuxaqWsYFMlDUF7wBB8Li7fjB2Ud-0vs2i42y_MA1-hD3CrRF3Un9n08NmD3FiuutAqfLCyUrhE"
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-outline-variant opacity-30 z-10"></div>

      <main className="relative z-20 w-full max-w-md">
        {/* Main Login Card */}
        <div className="bg-surface-container-lowest shadow-[0px_0px_40px_rgba(26,28,26,0.06)] overflow-hidden rounded-xl border border-outline-variant/10">
          {/* Arched Visual Header */}
          <div className="h-32 relative arched-header overflow-hidden mx-4 mt-4">
            <img 
              alt="" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJhNBRCnFu-YR3P-dnoFY3n2WrO0E5DOVG63XCLYJBv9TqKfgyk5PPwMGkYKLnorkp-C_YzjaUfH7dz03Hi4oi3mTPqkIivktv75mjRr0GfGglSoGuvR0zZlc2S7tHgJHjd8v1iroeTirBzi3DPyZtEWY6ZeKDxkTgK0GAQQbxSBB3X8cU-BPfdWp3jmN-kVSJeRBVFUwhXLObVxK1d5fHnIUaFJMQu_Vpi52XDfMdC-_1pn5n0Vv3xVYNTy1GUnlfrHcKs6-m"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
            <div className="absolute bottom-4 left-6">
              <span className="text-white/80 font-label text-[10px] tracking-[0.2em] uppercase">Ecclesia Digitum</span>
            </div>
          </div>

          {/* Content Container */}
          <div className="px-10 py-12">
            {/* Branding */}
            <header className="text-center mb-10">
              <h1 className="font-headline text-2xl font-bold text-primary tracking-tight leading-tight">
                Plataforma Cruzada<br/>
                <span className="text-lg font-normal italic opacity-80">Apologética Itinerante</span>
              </h1>
              <div className="mt-4 flex justify-center items-center gap-4">
                <div className="h-px w-8 bg-outline-variant/40"></div>
                <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
                <div className="h-px w-8 bg-outline-variant/40"></div>
              </div>
            </header>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Username Field */}
              <div className="space-y-1">
                <label className="block font-label text-[11px] font-medium text-outline uppercase tracking-widest px-1" htmlFor="email">
                  Correo o ID de Usuario
                </label>
                <div className="relative group">
                  <input 
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-1 text-on-surface focus:ring-0 focus:border-primary transition-all duration-300 placeholder:text-on-surface/20" 
                    id="email" 
                    name="email" 
                    placeholder="ej. veritas@cruzada.org" 
                    required 
                    type="text"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="flex justify-between items-end px-1">
                  <label className="block font-label text-[11px] font-medium text-outline uppercase tracking-widest" htmlFor="password">
                    Contraseña
                  </label>
                  <a className="font-label text-[10px] text-primary/70 hover:text-primary transition-colors duration-300 underline decoration-primary/20 underline-offset-4" href="#">
                    ¿Olvidó su contraseña?
                  </a>
                </div>
                <div className="relative">
                  <input 
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-1 text-on-surface focus:ring-0 focus:border-primary transition-all duration-300" 
                    id="password" 
                    name="password" 
                    required 
                    type="password"
                  />
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center space-x-3 px-1">
                <div className="relative flex items-center">
                  <input 
                    className="h-4 w-4 rounded-sm border-outline-variant text-primary focus:ring-primary/20 bg-transparent" 
                    id="remember" 
                    name="remember" 
                    type="checkbox"
                  />
                </div>
                <label className="font-label text-xs text-on-surface-variant font-medium" htmlFor="remember">
                  Mantener sesión iniciada
                </label>
              </div>

              {/* Submit Action */}
              <div className="pt-4">
                <button 
                  className="w-full vatican-gradient py-4 rounded-md text-white font-label font-semibold tracking-widest uppercase text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3" 
                  type="submit"
                >
                  Acceder
                  <span className="material-symbols-outlined text-sm">login</span>
                </button>
              </div>

              <div className="mt-6 text-center">
                <span className="font-label text-[11px] text-outline uppercase tracking-widest">¿No tiene una cuenta? </span>
                <a className="font-label text-[11px] text-primary font-bold hover:text-primary/80 transition-colors duration-300 underline decoration-primary/20 underline-offset-4 uppercase tracking-widest" href="#">Registrarse</a>
              </div>
            </form>

            {/* Footer Support */}
            <div className="mt-12 text-center">
              <p className="font-label text-[10px] text-outline uppercase tracking-[0.15em] leading-relaxed">Sub lumine Ecclesiae</p>
            </div>
          </div>
        </div>

        {/* Global Footer Branding (Static for Login) */}
        <footer className="mt-8 text-center flex flex-col items-center gap-4 w-full">
          <div className="h-px w-12 bg-outline-variant opacity-40"></div>
          <p className="font-label text-[10px] text-on-surface/40 tracking-[0.2em] uppercase">
            © MMXXIV Plataforma Cruzada Apologética Itinerante
          </p>
          <div className="flex gap-6 opacity-40">
            <a className="font-label text-[10px] uppercase tracking-widest hover:opacity-100 transition-opacity" href="#">Privacidad</a>
            <a className="font-label text-[10px] uppercase tracking-widest hover:opacity-100 transition-opacity" href="#">Términos de Fe</a>
          </div>
        </footer>
      </main>

      {/* Decorative Corner Element */}
      <div className="fixed bottom-0 right-0 p-12 opacity-5 hidden md:block">
        <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 100" }}>policy</span>
      </div>
    </div>
  );
};

export default Login;
