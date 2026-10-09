import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchApi } from '../api';
import { loadApologetas } from '../data/loadApologetas';

const field = 'w-full rounded-xl border border-white/10 bg-[#111827] p-3 text-sm text-white';
const areas = ['El Scriptorium', 'La Vigilia', 'Las Primeras Batallas', 'El Mapa', 'La Escaramuza', 'El Campo de Batalla', 'El Heraldo', 'La Preceptoría', 'El Estandarte', 'La Hospitalidad'];
export default function Apologetas() {
  const [data, setData] = useState({ items: [], ranks: [], total: 0 });
  const [filters, setFilters] = useState({ q: '', rankCode: '', country: '', city: '', area: '', activity: '' });
  const [query, setQuery] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    loadApologetas(fetchApi, true, { ...query, page }).then(value => { if (active) setData(value); })
      .catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [query, page, retry]);
  const change = e => setFilters(f => ({ ...f, [e.target.name]: e.target.value }));
  return <div className="space-y-6">
    <header><h1 className="cai-display text-4xl text-[#d8c08b]">Apologetas</h1><p className="mt-3 text-sm text-white/60">Directorio de miembros, rangos y actividad validada.</p></header>
    <div className="flex flex-wrap gap-5 text-white"><p>{loading || error ? '—' : data.total} miembros encontrados</p><p>{data.totalMisiones ?? '—'} misiones</p><Link className="text-[#d8c08b]" to="/misiones">Validar evidencias pendientes</Link></div>
    <form onSubmit={e => { e.preventDefault(); setPage(1); setQuery({ ...filters }); }} className="grid gap-3 md:grid-cols-3">
      <input aria-label="Nombre" name="q" placeholder="Buscar por nombre" value={filters.q} onChange={change} className={field} />
      <input aria-label="País" name="country" placeholder="País" value={filters.country} onChange={change} className={field} />
      <input aria-label="Ciudad" name="city" placeholder="Ciudad" value={filters.city} onChange={change} className={field} />
      <select aria-label="Rango" name="rankCode" value={filters.rankCode} onChange={change} className={field}><option value="">Todos los rangos</option>{data.ranks.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}</select>
      <select aria-label="Área de actividad" name="area" value={filters.area} onChange={change} className={field}><option value="">Todas las áreas</option>{areas.map(area => <option key={area}>{area}</option>)}</select>
      <select aria-label="Actividad" name="activity" value={filters.activity} onChange={change} className={field}><option value="">Todos los estados</option><option value="ACTIVE">Activo</option><option value="RESERVE">Reserva</option><option value="INACTIVE_60">Sin actividad durante 60 días</option></select>
      <button className="cai-button-primary rounded-xl p-3">Buscar</button>
    </form>
    {error ? <div role="alert" className="cai-card rounded-xl p-5 text-[#cf5d67]"><p>No se pudo cargar el listado de apologetas</p><p>{error}</p><button onClick={() => setRetry(r => r + 1)} className="mt-3 text-[#d8c08b]">Reintentar</button></div> : loading ? <p className="text-white/60">Cargando apologetas...</p> : <>
      {data.hasPartialError && <p role="status" className="text-[#d8c08b]">No se pudieron cargar todos los rangos o el total de misiones.</p>}
      {!data.items.length && <p className="text-white/60">No hay miembros que coincidan con la búsqueda.</p>}
      <div className="grid gap-4 xl:grid-cols-2">{data.items.map(member => <article key={member.id} className="cai-card rounded-2xl p-6 text-white">
        <h2 className="cai-display text-2xl">{member.fullName}</h2><p className="mt-2 text-[#d8c08b]">{data.ranks.find(r => r.code === member.rankCode)?.name || member.rankCode}</p>
        <p className="mt-2 text-sm text-white/60">{[member.profile?.city || member.city, member.profile?.country || member.country].filter(Boolean).join(', ') || 'Ubicación sin registrar'} · {member.profile?.reserve ? 'Reserva' : 'Activo'}</p>
        <p className="mt-2 text-sm text-white/60">{member.profile?.areas?.join(', ') || 'Sin misiones validadas por área'}</p>
        <button onClick={() => setSelected(selected === member.id ? null : member.id)} className="mt-4 text-sm text-[#d8c08b]">{selected === member.id ? 'Cerrar perfil' : 'Ver perfil'}</button>
        {selected === member.id && <div className="mt-3 border-t border-white/10 pt-3 text-sm text-white/70"><p>{member.email}</p><p>Última actividad: {member.profile?.lastActivityAt ? new Date(member.profile.lastActivityAt).toLocaleDateString() : 'Sin registrar'}</p></div>}
      </article>)}</div>
      {data.total > 50 && <div className="flex items-center justify-center gap-5 text-white"><button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Anterior</button><span>Página {page} de {Math.ceil(data.total / 50)}</span><button disabled={page * 50 >= data.total} onClick={() => setPage(p => p + 1)}>Siguiente</button></div>}
    </>}
  </div>;
}
