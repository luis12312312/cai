import { useEffect, useState } from 'react';
import { fetchApi } from '../api';

const field = 'mt-2 block w-full min-w-0 rounded-xl border border-white/10 bg-[#111827] p-3 text-sm text-white';
const btn = 'w-full whitespace-normal rounded-xl border border-[#d8c08b]/30 px-4 py-3 text-sm text-[#d8c08b] disabled:opacity-50';
const flags = {
  'HIT-ING': [['interviewVerified', 'Entrevista con Comendador o superior verificada']],
  'HIT-CAB': [['doctrinalExamVerified', 'Examen doctrinal integral aprobado'], ['ledFieldMissionVerified', 'Misión de campo liderada verificada']],
  'HIT-COM': [['localCommandVerified', 'Encomienda local activa y sostenida verificada']],
  'HIT-MAR': [['distinctLocationsVerified', 'Las tres congregaciones están en ciudades o barrios distintos']],
  'HIT-GM': [['chapterElectionVerified', 'Elección del Capítulo General acreditada en el acta']],
};
export default function RankAdministration() {
  const [users, setUsers] = useState([]);
  const [catalog, setCatalog] = useState({ ranks: [], milestones: [] });
  const [alerts, setAlerts] = useState([]);
  const [reports, setReports] = useState([]);
  const [member, setMember] = useState('');
  const [profile, setProfile] = useState({ birthDate: '', parentalConsentVerified: false, reserve: false, sponsorId: '', reviewNote: '', liftSanction: false });
  const [hito, setHito] = useState({ code: 'HIT-ING', reviewNote: '', requirementsVerified: false, referenceMemberId: '' });
  const [act, setAct] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [resolution, setResolution] = useState('');
  const me = JSON.parse(localStorage.getItem('user') || '{}');
  const isSuper = me.role === 'SUPER_ADMIN';
  async function load() {
    const [u, c, a, r] = await Promise.all([fetchApi('users.list', { data: { pageSize: 100 } }), fetchApi('ranks.get'), fetchApi('activity.list', { data: { pageSize: 100 } }), fetchApi('conduct.list', { data: { pageSize: 100 } })]);
    setUsers(u.items); setTotal(u.total); setPage(1); setCatalog(c); setAlerts(a.items); setReports(r.items);
  }
  useEffect(() => { load().catch(e => setMessage(e.message)); }, []);
  function choose(id) {
    const u = users.find(x => x.id === id); setMember(id);
    setProfile({ birthDate: u?.profile?.birthDate || '', parentalConsentVerified: u?.profile?.parentalConsent || false, reserve: u?.profile?.reserve || false, sponsorId: u?.profile?.sponsorId || '', reviewNote: '', liftSanction: false });
  }
  async function run(task) { setBusy(true); setMessage(''); try { await task(); } catch(e) { setMessage(e.message); } finally { setBusy(false); } }
  const milestone = catalog.milestones.find(h => h.code === hito.code);
  return <section className="cai-card min-w-0 rounded-2xl border border-white/10 p-5 sm:p-7">
    <h2 className="cai-display text-2xl text-[#d8c08b]">Rangos y acompañamiento</h2>
    {message && <p role="status" className="mt-4 break-words text-sm text-[#d8c08b]">{message}</p>}
    <details className="mt-5 text-sm text-white/70"><summary className="cursor-pointer">Validar hitos y gestionar perfiles</summary>
      <label className="mt-4 block text-xs">Miembro<select value={member} onChange={e => choose(e.target.value)} className={field}><option value="">Selecciona un miembro</option>{users.filter(u => u.id !== me.id).map(u => <option key={u.id} value={u.id}>{u.fullName} · {catalog.ranks.find(r => r.code === u.rankCode)?.name || u.rankCode}</option>)}</select></label>
      {users.length < total && <button disabled={busy} onClick={() => run(async () => { const u = await fetchApi('users.list', { data: { page: page + 1, pageSize: 100 } }); setUsers(v => [...v, ...u.items]); setPage(page + 1); })} className={`${btn} mt-3`}>Cargar más miembros</button>}
      {member && <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <form onSubmit={e => { e.preventDefault(); run(async () => { await fetchApi('profile.update', { data: { userId: member, ...profile, sponsorId: profile.sponsorId || undefined } }); await load(); setMessage('Perfil actualizado.'); }); }} className="space-y-4 rounded-xl bg-white/5 p-4">
          <h3 className="font-semibold text-white">Perfil y estado</h3><label className="block text-xs">Fecha de nacimiento verificada<input type="date" required value={profile.birthDate} onChange={e => setProfile(p => ({ ...p, birthDate: e.target.value }))} className={field} /></label>
          <label className="flex gap-2"><input type="checkbox" checked={profile.parentalConsentVerified} onChange={e => setProfile(p => ({ ...p, parentalConsentVerified: e.target.checked }))} />Consentimiento de los padres verificado</label>
          <label className="flex gap-2"><input type="checkbox" checked={profile.reserve} onChange={e => setProfile(p => ({ ...p, reserve: e.target.checked }))} />En reserva (desmarca para reincorporar)</label>
          <label className="block text-xs">Padrino<select value={profile.sponsorId} onChange={e => setProfile(p => ({ ...p, sponsorId: e.target.value }))} className={field}><option value="">Sin padrino</option>{users.filter(u => u.id !== member && u.role === 'SOLDADO_ACTIVE' && (catalog.ranks.find(r => r.code === u.rankCode)?.level || 0) >= 5).map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}</select></label>
          {isSuper && <label className="flex gap-2"><input type="checkbox" checked={profile.liftSanction} onChange={e => setProfile(p => ({ ...p, liftSanction: e.target.checked }))} />Levantar el bloqueo de ascensos por decisión del Capítulo</label>}
          <textarea required maxLength={2000} value={profile.reviewNote} onChange={e => setProfile(p => ({ ...p, reviewNote: e.target.value }))} placeholder="Motivo y verificaciones realizadas" className={field} /><button disabled={busy} className={btn}>Guardar perfil</button>
        </form>
        <form onSubmit={e => { e.preventDefault(); run(async () => { await fetchApi('milestones.validate', { data: { userId: member, ...hito }, file: act }); await load(); setAct(null); setMessage('Hito validado; el ascenso se comprobará con puntos y Hospitalidad.'); }); }} className="space-y-4 rounded-xl bg-white/5 p-4">
          <h3 className="font-semibold text-white">Acta de hito</h3>
          <select value={hito.code} onChange={e => { setHito({ code: e.target.value, requirementsVerified: false, reviewNote: '', referenceMemberId: '' }); setAct(null); }} className={field}>{catalog.milestones.filter(h => !['HIT-DOM', 'HIT-PROX', 'HIT-FUN'].includes(h.code)).map(h => <option key={h.code} value={h.code}>{h.code} · {h.name}</option>)}</select>
          <p className="text-xs leading-relaxed">{milestone?.requirement}</p>
          <p className="text-xs text-white/40">Doméstica, Proximidad y Fundamentos se verifican al aprobar sus misiones. Ningún acta reemplaza los requisitos pendientes.</p>
          {(flags[hito.code] || []).map(([key, label]) => <label key={key} className="flex items-start gap-2 text-xs"><input type="checkbox" required checked={hito[key] || false} onChange={e => setHito(h => ({ ...h, [key]: e.target.checked }))} />{label}</label>)}
          {hito.code === 'HIT-ING' && <select required value={hito.referenceMemberId} onChange={e => setHito(h => ({ ...h, referenceMemberId: e.target.value }))} className={field}><option value="">Miembro activo que da la referencia</option>{users.filter(u => u.role === 'SOLDADO_ACTIVE' && u.id !== member).map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}</select>}
          <label className="flex items-start gap-2 text-xs"><input type="checkbox" required checked={hito.requirementsVerified} onChange={e => setHito(h => ({ ...h, requirementsVerified: e.target.checked }))} />Verifiqué todos los requisitos y la autenticidad del acta.</label>
          {isSuper && hito.code !== 'HIT-GM' && <label className="flex items-start gap-2 text-xs"><input type="checkbox" checked={hito.foundingValidation || false} onChange={e => setHito(h => ({...h,foundingValidation:e.target.checked}))} />Validación fundacional del Capítulo, si aún no existe un administrador con rango suficiente.</label>}
          <label className="block text-xs">Acta firmada, PDF (máximo 5 MB)<input type="file" required accept=".pdf" onChange={e => setAct(e.target.files?.[0] || null)} className={field} /></label>
          <textarea required maxLength={2000} value={hito.reviewNote} onChange={e => setHito(h => ({ ...h, reviewNote: e.target.value }))} placeholder="Detalle de la validación" className={field} /><button disabled={busy || !act} className={btn}>Validar hito</button>
        </form>
      </div>}
    </details>
    <details className="mt-5 text-sm text-white/70"><summary className="cursor-pointer">Alertas de inactividad ({alerts.length})</summary><div className="mt-3 space-y-3">{!alerts.length && <p className="text-xs">Sin alertas de 60 días o más.</p>}{alerts.map(a => <article key={a.id} className="rounded-xl bg-white/5 p-4"><p>{a.fullName} · {a.daysInactive} días sin misión · {a.reserve ? 'Reserva' : 'Contactar al miembro'}</p><p className="mt-2 text-xs">Última actividad: {new Date(a.lastMissionAt).toLocaleDateString()}. Rango y puntos conservados.</p><button onClick={() => choose(a.id)} className={`${btn} mt-3`}>Seleccionar perfil para reincorporar</button></article>)}</div></details>
    <details className="mt-5 text-sm text-white/70"><summary className="cursor-pointer">Reportes de conducta ({reports.filter(r => r.status === 'PENDING').length} pendientes)</summary>
      {isSuper && <textarea maxLength={2000} value={resolution} onChange={e => setResolution(e.target.value)} placeholder="Resolución del Capítulo para el reporte seleccionado" className={field} />}
      <div className="mt-3 space-y-3">{reports.map(r => <article key={r.id} className="rounded-xl bg-white/5 p-4"><p>{users.find(u => u.id === r.targetId)?.fullName || r.targetId} · {r.status}</p><p className="mt-2 whitespace-pre-wrap break-words text-sm">{r.note}</p>{r.resolution && <p className="mt-2 text-xs">{r.resolution}</p>}{isSuper && r.status === 'PENDING' && <div className="mt-3 grid gap-3 sm:grid-cols-2">{[[true, 'Confirmar humillación y retirar rango'], [false, 'Desestimar reporte']].map(([upheld, label]) => <button key={label} disabled={busy || !resolution.trim()} onClick={() => run(async () => { await fetchApi('conduct.review', { data: { id: r.id, upheld, reviewNote: resolution } }); await load(); setMessage('Resolución registrada.'); })} className={btn}>{label}</button>)}</div>}</article>)}</div>
    </details>
  </section>;
}
