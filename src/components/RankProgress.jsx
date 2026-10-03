import { useEffect, useState } from 'react';
import { fetchApi } from '../api';

export default function RankProgress({ onChange }) {
  const [progress, setProgress] = useState(null);
  const [catalog, setCatalog] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [birthDate, setBirthDate] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    let active = true;
    Promise.all([fetchApi('progress.get'), fetchApi('ranks.get')])
      .then(async ([p, c]) => { const l = await fetchApi('points.list', { data: { pageSize: 100 } }); if (active) { setProgress(p); setCatalog(c.ranks); setLedger(l.items); } })
      .catch(e => { if (active) setMessage(e.message); });
    return () => { active = false; };
  }, []);
  async function saveBirth(event) {
    event.preventDefault(); setSaving(true); setMessage('');
    try { const p = await fetchApi('profile.update', { data: { birthDate } }); setProgress(p); onChange?.(p); }
    catch(e) { setMessage(e.message); } finally { setSaving(false); }
  }
  const points = progress?.totalPoints || 0;
  const next = progress?.nextRank;
  const percent = next ? Math.min(100, Math.max(0, (points - progress.rank.threshold) / (next.threshold - progress.rank.threshold) * 100)) : 100;
  return <section className="cai-card min-w-0 rounded-2xl border border-[#d8c08b]/20 p-5 sm:p-7">
    {message && <p role="alert" className="mb-4 text-sm text-[#cf5d67]">{message}</p>}
    {progress ? <>
      <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
        <img src={progress.rank.shieldUrl} alt={`Escudo de ${progress.rank.name}`} className="h-24 w-24 shrink-0 rounded-xl bg-white object-contain p-2" />
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-widest text-[#d8c08b]">Rango {progress.rank.level} de 10 · {progress.reserve ? 'Reserva' : 'Activo'}</p>
          <h2 className="cai-display mt-2 break-words text-2xl text-white">{progress.rank.name}</h2>
          <p className="mt-1 whitespace-pre-line text-sm italic text-white/60">{progress.rank.motto}</p>
          <p className="mt-3 text-lg text-[#d8c08b]">{points.toLocaleString()} puntos · {progress.completedMissionTotal} misiones validadas</p>
        </div>
      </div>
      {next && <div className="mt-5 space-y-2">
        <p className="text-sm text-white/70">Próximo rango: {next.name} · umbral {next.threshold} puntos</p>
        <progress aria-label={`Puntos hacia ${next.name}`} value={percent} max="100" className="h-2 w-full accent-[#d8c08b]" />
        <p className="text-xs leading-relaxed text-white/60">{progress.nextMilestone?.name}: {progress.nextMilestone?.completed ? 'Validado' : 'Pendiente'}. {progress.nextMilestone?.requirement}</p>
        {!progress.entryApproved && <p className="text-xs text-[#d8c08b]">Ingreso pendiente: entrevista, referencia y 30 días de formación; lo valida el administrador.</p>}
        {next.level >= 4 && !progress.hospitalityCurrent && <p className="text-xs text-[#d8c08b]">Para ascender necesitas una misión de Hospitalidad validada en los últimos 90 días.</p>}
        <p className="text-xs text-white/40">El ascenso requiere puntos y el hito; la barra mide solamente los puntos.</p>
      </div>}
      {progress.reserve && <p className="mt-4 text-sm text-[#d8c08b]">Tu rango y puntos se conservan. Pide al administrador la reincorporación para reportar misiones.</p>}
      {!progress.birthDate && <form onSubmit={saveBirth} className="mt-5 flex flex-col gap-3 rounded-xl bg-white/5 p-4 sm:flex-row sm:items-end">
        <label className="min-w-0 flex-1 text-xs text-white/70">Fecha de nacimiento · necesaria antes de reportar
          <input type="date" required value={birthDate} onChange={e => setBirthDate(e.target.value)} className="mt-2 block w-full rounded-lg bg-[#111827] p-3 text-white" />
        </label>
        <button disabled={saving} className="cai-button-primary rounded-xl px-5 py-3 text-sm disabled:opacity-50">{saving ? 'Guardando...' : 'Guardar fecha'}</button>
      </form>}
      {progress.birthDate && !progress.parentalConsent && new Date(progress.birthDate) > new Date(new Date().setFullYear(new Date().getFullYear() - 18)) && <p className="mt-4 text-sm text-[#d8c08b]">El administrador debe verificar el consentimiento de tus padres. Solo puedes realizar Formación, Vigilia y Hospitalidad.</p>}
      <details className="mt-5 text-sm text-white/70"><summary className="cursor-pointer text-[#d8c08b]">Rangos, funciones y movimientos de puntos</summary>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">{catalog.map(rank => <article key={rank.code} className="min-w-0 rounded-xl bg-white/5 p-4">
          <p className="font-semibold text-white">{rank.level}. {rank.name} · {rank.threshold} puntos</p>
          <p className="mt-2 text-xs leading-relaxed">{rank.functions}</p>
          <p className="mt-2 text-xs text-[#d8c08b]">Bono de ascenso: +{rank.bonus}</p>
        </article>)}</div>
        <ul className="mt-4 space-y-2">{ledger.map(item => <li key={item.id} className="flex justify-between gap-3 rounded-lg bg-white/5 p-3"><span className="min-w-0 break-words">{item.description}</span><span className="shrink-0">{item.points > 0 ? '+' : ''}{item.points}</span></li>)}</ul>
        <p className="mt-2 text-xs text-white/40">Últimos 100 movimientos. Los puntos no caducan.</p>
      </details>
    </> : !message && <p className="text-sm text-white/60">Cargando tu progreso...</p>}
  </section>;
}
