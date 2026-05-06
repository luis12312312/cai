import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApi } from '../api';

const Register = () => {
  const navigate = useNavigate();
  const [hasId, setHasId] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    certificateId: '',
    certificateFile: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const registerRes = await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
        }),
      });

      localStorage.setItem('token', registerRes.accessToken);
      localStorage.setItem('user', JSON.stringify(registerRes.user));

      if (hasId && formData.certificateId) {
        await fetchApi('/activation/certificate-number', {
          method: 'POST',
          body: JSON.stringify({ certificateNumber: formData.certificateId }),
        });
      } else if (!hasId && formData.certificateFile) {
        const formPayload = new FormData();
        formPayload.append('certificateNumber', formData.certificateId || 'S/N');
        formPayload.append('certificatePhoto', formData.certificateFile);

        await fetchApi('/activation/review-request', {
          method: 'POST',
          body: formPayload,
        });
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Error en el registro');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cai-auth-shell relative min-h-screen overflow-hidden text-white flex flex-col">
      <div className="absolute inset-0 bg-[#04060b]" aria-hidden="true" />
      <div className="cai-overlay-grid absolute inset-0 opacity-30" aria-hidden="true" />
      <div
        className="absolute inset-0 opacity-35 mix-blend-screen"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 18% 18%, rgba(232,197,110,0.14), transparent 20%), radial-gradient(circle at 82% 22%, rgba(120,24,42,0.25), transparent 24%), radial-gradient(circle at 72% 76%, rgba(22,48,88,0.3), transparent 30%)',
        }}
      />
      <div className="absolute inset-y-0 left-0 w-full opacity-20" aria-hidden="true">
        <img
          alt=""
          className="h-full w-full object-cover object-center"
          src="https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1600&q=80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070c] via-[#07101a]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070c] via-[#05070c]/50 to-[#05070c]/90" />
      </div>

      <main className="relative z-20 flex-grow flex items-center justify-center px-4 pt-10 pb-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="cai-panel rounded-[2rem] p-6 sm:p-8">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <img src="/images/Logo.png" alt="CAI Logo" className="h-24 w-auto object-contain" />
                </div>
                <h2 className="cai-display text-3xl font-semibold text-white">Registro</h2>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                {error && (
                  <div className="rounded-2xl border border-[#cf5d67]/30 bg-[#5f1620]/30 px-4 py-3 text-sm text-[#ffd8dc]">
                    {error}
                  </div>
                )}

                <div className="rounded-2xl border border-[#d8c08b]/16 bg-[#0c121d]/80 p-4 text-center">
                  <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/70">
                    ¿Posee un ID valido?
                  </label>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setHasId(true)}
                      className={`rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition-all ${
                        hasId
                          ? 'cai-button-primary text-white'
                          : 'border border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.05]'
                      }`}
                    >
                      Si
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasId(false)}
                      className={`rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition-all ${
                        !hasId
                          ? 'cai-button-primary text-white'
                          : 'border border-white/10 bg-white/[0.03] text-white/70 hover:bg-white/[0.05]'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {!hasId && (
                  <div className="rounded-2xl border border-[#d8c08b]/18 bg-[#2a1b0a]/35 px-4 py-4 text-sm leading-6 text-white/78 text-center">
                    <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[#e5cd95]">Revision manual</p>
                    <p className="mt-1 text-xs">
                      Envie su certificado para revision. Su solicitud quedara pendiente de aprobacion.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/70" htmlFor="fullName">
                    Nombre completo
                  </label>
                  <input
                    className="cai-input w-full rounded-2xl px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-white/30"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Ej. Juan Perez"
                    required
                    type="text"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/70" htmlFor="email">
                    Correo electronico
                  </label>
                  <input
                    className="cai-input w-full rounded-2xl px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-white/30"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ej. veritas@cruzada.org"
                    required
                    type="email"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/70" htmlFor="password">
                    Contrasena
                  </label>
                  <div className="relative">
                    <input
                      className="cai-input w-full rounded-2xl px-4 py-3.5 pr-12 text-sm text-white outline-none transition-all placeholder:text-white/30"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimo 8 caracteres"
                      required
                      minLength={8}
                      type={showPassword ? 'text' : 'password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                      title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    >
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0" }}>
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {hasId ? (
                  <div className="space-y-2">
                    <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/70" htmlFor="certificateId">
                      ID de certificado
                    </label>
                    <input
                      className="cai-input w-full rounded-2xl px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-white/30"
                      id="certificateId"
                      name="certificateId"
                      value={formData.certificateId}
                      onChange={handleChange}
                      placeholder="Ej. AP-001"
                      required
                      type="text"
                    />
                  </div>
                ) : (
                  <div className="space-y-4 rounded-2xl border border-white/8 bg-black/10 p-4">
                    <div className="space-y-2">
                      <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/70" htmlFor="certificateId">
                        Numero de certificado
                      </label>
                      <input
                        className="cai-input w-full rounded-2xl px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-white/30"
                        id="certificateId"
                        name="certificateId"
                        value={formData.certificateId}
                        onChange={handleChange}
                        placeholder="Opcional o S/N"
                        type="text"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/70" htmlFor="certificateFile">
                        Adjuntar certificado
                      </label>
                      <input
                        className="block w-full text-sm text-white/72 file:mr-4 file:rounded-full file:border file:border-[#d8c08b]/20 file:bg-[#c89d45]/12 file:px-4 file:py-2.5 file:text-xs file:font-semibold file:uppercase file:tracking-[0.18em] file:text-[#f3dcaa] hover:file:bg-[#c89d45]/20"
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

                <button
                  className="cai-button-primary flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-white transition-all disabled:cursor-not-allowed disabled:opacity-60"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Enviando solicitud...' : 'Enviar solicitud'}
                  {!isLoading && <span className="material-symbols-outlined text-sm">send</span>}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-white/65">
                <span>¿Ya posee cuenta? </span>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="font-semibold uppercase tracking-[0.18em] text-[#e5cd95] transition-colors hover:text-white"
                >
                  Volver al inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-20 mt-auto border-t border-white/8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-center text-sm text-white/55 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>CAI · Registro y validacion institucional</p>
        </div>
      </footer>
    </div>
  );
};

export default Register;
