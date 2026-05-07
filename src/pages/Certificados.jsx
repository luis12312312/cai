import React, { useState, useEffect } from 'react';
import { fetchApi } from '../api';

const formatCertificateDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const Certificados = () => {
  const [certificates, setCertificates] = useState([]);
  const [certificateForm, setCertificateForm] = useState({
    identifier: '',
    name: '',
  });
  const [certificateFeedback, setCertificateFeedback] = useState({
    type: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const data = await fetchApi('/admin/certificates?page=1&pageSize=100');
      if (data && data.items) {
        setCertificates(
          data.items.map((item) => ({
            id: item.id,
            identifier: item.certificateNumber,
            name: item.issuedToName || 'Sin nombre',
            status: item.isUsed ? 'Usado' : 'Vigente',
            uploadedAt: formatCertificateDate(item.createdAt || new Date()),
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    }
  };

  const handleCertificateFieldChange = (field) => (event) => {
    const value = event.target.value;

    setCertificateForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (certificateFeedback.message) {
      setCertificateFeedback({ type: '', message: '' });
    }
  };

  const handleCertificateSubmit = async (event) => {
    event.preventDefault();

    const identifier = certificateForm.identifier.trim();
    const name = certificateForm.name.trim();

    if (!identifier) {
      setCertificateFeedback({
        type: 'error',
        message: 'Completa el identificador del certificado.',
      });
      return;
    }

    setIsLoading(true);
    try {
      await fetchApi('/admin/certificates', {
        method: 'POST',
        body: JSON.stringify({
          certificateNumber: identifier,
          issuedToName: name || null,
        }),
      });

      setCertificateFeedback({
        type: 'success',
        message: `Certificado ${identifier} registrado correctamente.`,
      });
      setCertificateForm({ identifier: '', name: '' });
      fetchCertificates(); // Refresh list
    } catch (error) {
      setCertificateFeedback({
        type: 'error',
        message: error.message || 'Error al registrar el certificado.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-2">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#cf5d67] font-semibold">Archivo Doctrinal</p>
        <h1 className="cai-display text-3xl md:text-5xl text-white">
          Módulo de <span className="italic text-[#d8c08b]">Certificados</span>
        </h1>
        <div className="h-0.5 w-16 bg-gradient-to-r from-[#cf5d67] to-[#d8c08b] mt-2"></div>
      </header>

      <p className="text-sm leading-relaxed text-white/70 max-w-2xl">
        Centraliza la carga y la consulta de certificados con un identificador único y su nombre asociado para la validación de apologetas.
      </p>

      <section className="grid grid-cols-2 gap-4">
        <article className="cai-card rounded-2xl p-5 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <span className="material-symbols-outlined text-6xl text-[#d8c08b]">workspace_premium</span>
          </div>
          <p className="cai-display text-4xl text-[#d8c08b] relative z-10">{certificates.length}</p>
          <p className="mt-2 text-[10px] uppercase tracking-widest text-white/50 relative z-10">Registrados</p>
        </article>
        <article className="cai-card rounded-2xl p-5 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <span className="material-symbols-outlined text-6xl text-[#d8c08b]">verified</span>
          </div>
          <p className="cai-display text-4xl text-[#d8c08b] relative z-10">
            {certificates.filter((c) => c.status === 'Vigente').length}
          </p>
          <p className="mt-2 text-[10px] uppercase tracking-widest text-white/50 relative z-10">Vigentes</p>
        </article>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)] gap-6">
        <article className="cai-panel rounded-[1.5rem] border border-white/5 p-6 h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d8c08b]/10 text-[#d8c08b]">
              <span className="material-symbols-outlined">add_circle</span>
            </div>
            <div>
              <h3 className="cai-display text-xl text-white">Nuevo certificado</h3>
              <p className="text-[10px] uppercase tracking-widest text-white/50 mt-1">Ingresa los datos</p>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleCertificateSubmit}>
            <label className="block">
              <span className="text-[10px] uppercase tracking-widest text-[#cf5d67] font-semibold">Identificador único</span>
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-[#d8c08b]/50 focus:ring-1 focus:ring-[#d8c08b]/30 placeholder:text-white/20"
                onChange={handleCertificateFieldChange('identifier')}
                placeholder="Ej. AP-003"
                type="text"
                value={certificateForm.identifier}
              />
            </label>

            <label className="block">
              <span className="text-[10px] uppercase tracking-widest text-[#cf5d67] font-semibold">Nombre (Opcional)</span>
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-[#d8c08b]/50 focus:ring-1 focus:ring-[#d8c08b]/30 placeholder:text-white/20"
                onChange={handleCertificateFieldChange('name')}
                placeholder="Ej. Juan Pérez"
                type="text"
                value={certificateForm.name}
              />
            </label>

            {certificateFeedback.message && (
              <div
                className={`rounded-xl px-4 py-3 text-xs font-medium border ${
                  certificateFeedback.type === 'error'
                    ? 'bg-[#cf5d67]/10 text-[#cf5d67] border-[#cf5d67]/20'
                    : 'bg-[#d8c08b]/10 text-[#d8c08b] border-[#d8c08b]/20'
                }`}
              >
                {certificateFeedback.message}
              </div>
            )}

            <button
              className="w-full rounded-full bg-[#d8c08b] px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-[#04060b] transition-all hover:bg-white disabled:opacity-50"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Registrar Certificado'}
            </button>
          </form>
        </article>

        <article className="cai-panel rounded-[1.5rem] border border-white/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="cai-display text-2xl text-white">Listado de Certificados</h3>
              <p className="text-[10px] uppercase tracking-widest text-white/50 mt-1">Registros cargados</p>
            </div>
            <span className="rounded-full bg-[#d8c08b]/10 border border-[#d8c08b]/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#d8c08b]">
              {certificates.length} activos
            </span>
          </div>

          <div className="space-y-4">
            {certificates.length === 0 ? (
              <div className="text-center py-10 text-white/50 text-sm">No hay certificados registrados aún.</div>
            ) : (
              certificates.map((certificate) => (
                <div
                  key={certificate.id}
                  className="cai-card rounded-2xl border border-white/10 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="rounded-full bg-[#cf5d67]/20 border border-[#cf5d67]/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#cf5d67]">
                        {certificate.identifier}
                      </span>
                      <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[9px] uppercase tracking-widest text-white/60">
                        {certificate.status}
                      </span>
                    </div>
                    <h4 className="text-lg font-medium text-white group-hover:text-[#d8c08b] transition-colors">{certificate.name}</h4>
                  </div>

                  <div className="md:text-right border-t border-white/10 md:border-t-0 pt-3 md:pt-0">
                    <p className="text-[9px] uppercase tracking-widest text-[#cf5d67] font-semibold">Fecha de Creación</p>
                    <p className="mt-1 text-sm font-medium text-white/80">{certificate.uploadedAt}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </article>
      </div>
    </div>
  );
};

export default Certificados;