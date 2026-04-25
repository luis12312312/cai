import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [hasId, setHasId] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    certificateId: '',
    certificateFile: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logica de registro simulada
    if (hasId) {
      console.log('Registro con ID:', formData.email, formData.certificateId);
    } else {
      console.log('Registro Manual:', formData.email, formData.certificateFile?.name);
    }
    
    // Redirigir de vuelta al login
    navigate('/login');
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
        {/* Main Register Card */}
        <div className="bg-surface-container-lowest shadow-[0px_0px_40px_rgba(26,28,26,0.06)] overflow-hidden rounded-xl border border-outline-variant/10">
          
          {/* Header */}
          <div className="px-10 pt-10 pb-6 text-center border-b border-outline-variant/10">
            <h1 className="font-headline text-2xl font-bold text-primary tracking-tight leading-tight">
              Registro de<br/>
              <span className="text-lg font-normal italic opacity-80">Apologeta</span>
            </h1>
            <div className="mt-4 flex justify-center items-center gap-4">
              <div className="h-px w-8 bg-outline-variant/40"></div>
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>how_to_reg</span>
              <div className="h-px w-8 bg-outline-variant/40"></div>
            </div>
          </div>

          {/* Content Container */}
          <div className="px-10 py-8">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Switch Type of Registration */}
              <div className="flex flex-col gap-3 mb-6 bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
                <label className="font-label text-xs font-bold text-outline uppercase tracking-widest text-center">
                  ¿Posee un ID de certificado válido?
                </label>
                <div className="flex gap-2 justify-center mt-1">
                  <button
                    type="button"
                    onClick={() => setHasId(true)}
                    className={`px-4 py-2 text-xs font-label uppercase tracking-widest rounded-lg transition-all ${
                      hasId ? 'bg-primary text-white shadow-md' : 'bg-transparent text-on-surface-variant hover:bg-primary/5'
                    }`}
                  >
                    Sí, poseo ID
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasId(false)}
                    className={`px-4 py-2 text-xs font-label uppercase tracking-widest rounded-lg transition-all ${
                      !hasId ? 'bg-primary text-white shadow-md' : 'bg-transparent text-on-surface-variant hover:bg-primary/5'
                    }`}
                  >
                    No poseo ID
                  </button>
                </div>
              </div>

              {!hasId && (
                <div className="bg-[#fff8e1]/50 border-l-4 border-secondary p-4 rounded-r-lg mb-6">
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    <strong className="text-secondary block mb-1">Aviso de proceso manual</strong>
                    Al no contar con un ID previo, su solicitud entrará en una fase de revisión manual. Por favor, adjunte su certificado y espere a que un administrador apruebe su acceso.
                  </p>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-1">
                <label className="block font-label text-[11px] font-medium text-outline uppercase tracking-widest px-1" htmlFor="email">
                  Correo Electrónico
                </label>
                <div className="relative group">
                  <input 
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-1 text-on-surface focus:ring-0 focus:border-primary transition-all duration-300 placeholder:text-on-surface/20" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ej. veritas@cruzada.org" 
                    required 
                    type="email"
                  />
                </div>
              </div>

              {/* Dynamic Field: ID or File */}
              {hasId ? (
                <div className="space-y-1">
                  <label className="block font-label text-[11px] font-medium text-outline uppercase tracking-widest px-1" htmlFor="certificateId">
                    ID de Certificado
                  </label>
                  <div className="relative">
                    <input 
                      className="w-full bg-transparent border-0 border-b border-outline-variant py-3 px-1 text-on-surface focus:ring-0 focus:border-primary transition-all duration-300 placeholder:text-on-surface/20" 
                      id="certificateId" 
                      name="certificateId" 
                      value={formData.certificateId}
                      onChange={handleChange}
                      placeholder="Ej. AP-001"
                      required 
                      type="text"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="block font-label text-[11px] font-medium text-outline uppercase tracking-widest px-1" htmlFor="certificateFile">
                    Adjuntar Certificado (PDF / Imagen)
                  </label>
                  <div className="relative pt-2">
                    <input 
                      className="block w-full text-xs text-on-surface file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:font-label file:text-[10px] file:uppercase file:tracking-widest file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                      id="certificateFile" 
                      name="certificateFile" 
                      onChange={handleChange}
                      required 
                      type="file"
                      accept=".pdf,image/*"
                    />
                  </div>
                </div>
              )}

              {/* Submit Action */}
              <div className="pt-6">
                <button 
                  className="w-full vatican-gradient py-4 rounded-md text-white font-label font-semibold tracking-widest uppercase text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3" 
                  type="submit"
                >
                  Enviar Solicitud
                  <span className="material-symbols-outlined text-sm">send</span>
                </button>
              </div>

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <span className="font-label text-[11px] text-outline uppercase tracking-widest">¿Ya posee cuenta? </span>
                <button 
                  type="button"
                  onClick={() => navigate('/login')}
                  className="font-label text-[11px] text-primary font-bold hover:text-primary/80 transition-colors duration-300 underline decoration-primary/20 underline-offset-4 uppercase tracking-widest"
                >
                  Volver al inicio
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Global Footer Branding */}
        <footer className="mt-8 text-center flex flex-col items-center gap-4 w-full">
          <div className="h-px w-12 bg-outline-variant opacity-40"></div>
          <p className="font-label text-[10px] text-on-surface/40 tracking-[0.2em] uppercase">
            © MMXXIV Plataforma Cruzada Apologética Itinerante
          </p>
        </footer>
      </main>

      {/* Decorative Corner Element */}
      <div className="fixed bottom-0 right-0 p-12 opacity-5 hidden md:block">
        <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 100" }}>app_registration</span>
      </div>
    </div>
  );
};

export default Register;
