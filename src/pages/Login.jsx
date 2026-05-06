import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApi } from '../api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cai-auth-shell relative min-h-screen overflow-hidden text-white flex flex-col">
      <div className="absolute inset-0 bg-[#04060b]" aria-hidden="true" />
      <div className="cai-overlay-grid absolute inset-0 opacity-30" aria-hidden="true" />
      <div
        className="absolute inset-0 opacity-30 mix-blend-screen"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(232,197,110,0.18), transparent 20%), radial-gradient(circle at 80% 18%, rgba(120,24,42,0.28), transparent 24%), radial-gradient(circle at 70% 72%, rgba(26,54,93,0.3), transparent 32%)',
        }}
      />
      <div className="absolute inset-y-0 right-0 w-full opacity-25" aria-hidden="true">
        <img
          alt=""
          className="h-full w-full object-cover object-center"
          src="https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1600&q=80"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-[#05070c] via-[#07101a]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070c] via-[#05070c]/50 to-[#05070c]/90" />
      </div>

      <header className="fixed inset-x-0 top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <div className="cai-panel rounded-full px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.38em] text-[#d8c08b]">CAI</p>
                <h1 className="cai-display text-sm font-semibold text-white sm:text-base">
                  Cruzada Apologetica Itinerante
                </h1>
              </div>
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="rounded-full border border-[#d8c08b]/30 px-4 py-2 text-sm text-white transition-colors hover:border-[#d8c08b]/60 hover:bg-white/5"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-20 flex-grow flex items-center justify-center px-4 pt-24 pb-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="cai-panel rounded-[2rem] p-6 sm:p-8">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6 text-center">
              <span className="material-symbols-outlined text-4xl text-[#d8c08b] mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
              <p className="text-[0.68rem] uppercase tracking-[0.32em] text-[#d8c08b]">Acceso seguro</p>
              <h3 className="cai-display mt-3 text-3xl font-semibold text-white">Ingresar</h3>

              <form onSubmit={handleSubmit} className="mt-8 text-left space-y-5">
                {error && (
                  <div className="rounded-2xl border border-[#cf5d67]/30 bg-[#5f1620]/30 px-4 py-3 text-sm text-[#ffd8dc]">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/70" htmlFor="email">
                    Correo electronico
                  </label>
                  <input
                    className="cai-input w-full rounded-2xl px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-white/30"
                    id="email"
                    name="email"
                    placeholder="ej. veritas@cruzada.org"
                    required
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label className="block text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/70" htmlFor="password">
                      Contrasena
                    </label>
                  </div>
                  <input
                    className="cai-input w-full rounded-2xl px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-white/30"
                    id="password"
                    name="password"
                    placeholder="Ingrese su contrasena"
                    required
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
                  <label className="flex items-center gap-3 text-sm text-white/72" htmlFor="remember">
                    <input
                      className="h-4 w-4 rounded border-white/20 bg-transparent text-[#d8c08b] focus:ring-[#d8c08b]/25"
                      id="remember"
                      name="remember"
                      type="checkbox"
                    />
                    Mantener sesion
                  </label>
                  <button
                    type="button"
                    className="text-xs uppercase tracking-[0.24em] text-[#d8c08b]/80 transition-colors hover:text-[#d8c08b]"
                  >
                    Soporte
                  </button>
                </div>

                <button
                  className="cai-button-primary flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 text-sm font-semibold uppercase tracking-[0.24em] text-white transition-all disabled:cursor-not-allowed disabled:opacity-60"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Accediendo...' : 'Acceder'}
                  {!isLoading && <span className="material-symbols-outlined text-sm">login</span>}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-white/65">
                <span>¿No tiene una cuenta? </span>
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="font-semibold uppercase tracking-[0.18em] text-[#e5cd95] transition-colors hover:text-white"
                >
                  Registrarse
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-20 mt-auto border-t border-white/8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-center text-sm text-white/55 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>CAI · Plataforma Cruzada Apologetica Itinerante</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
