import { useEffect, useState } from 'react';
import { fetchApi } from '../api';

const field = 'mt-2 w-full rounded-xl border border-white/10 bg-[#111827] p-3 text-sm text-white';
const exams = [['FOR-03', '20 versículos clave'], ['CREDO', 'I · Credo'], ['SACRAMENTOS', 'II · Sacramentos'], ['VIDA', 'III · Vida'], ['ORACION', 'IV · Oración']];
export default function LearningPanel({ admin = false, records = false }) {
  const [settings, setSettings] = useState(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [journal, setJournal] = useState([]);
  const [day, setDay] = useState(new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima' }).format(new Date()));
  const [kind, setKind] = useState('PRAYER');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});
  useEffect(() => {
    let active = true;
    fetchApi('learning.get').then(s => { if (active) setSettings(s); }).catch(e => { if (active) setMessage(e.message); });
    if (records) fetchApi('spiritual.list').then(r => { if (active) setJournal(r.items); }).catch(e => { if (active) setMessage(e.message); });
    return () => { active = false; };
  }, [records]);
  async function run(task) { setBusy(true); setMessage(''); try { await task(); } catch (e) { setMessage(e.message); } finally { setBusy(false); } }
  function edit() {
    setDraft({ courseUrl: settings?.courseUrl || '', waitingGroupUrl: settings?.waitingGroupUrl || '', ...Object.fromEntries(exams.map(([key]) => [key, (settings?.exams?.[key] || []).join('\n')])) });
    setEditing(true);
  }
  return <section className="cai-card rounded-2xl p-5 text-white">
    <h2 className="cai-display text-2xl text-[#d8c08b]">Bienvenida y formación</h2>
    {message && <p role="status" className="mt-3 text-sm text-[#d8c08b]">{message}</p>}
    {settings && <div className="mt-3 space-y-3 text-sm">{[['courseUrl', 'Curso de la Orden'], ['waitingGroupUrl', 'Grupo de espera']].map(([key, label]) => <p key={key}>{settings[key] ? <a href={settings[key]} target="_blank" rel="noopener noreferrer" className="text-[#d8c08b]">{label}</a> : `${label}: pendiente de configuración.`}</p>)}<p className="text-white/60">Los exámenes se responden en Misiones y requieren revisión del administrador. {exams.filter(([key]) => settings.exams?.[key]?.length).length} de 5 cuestionarios configurados.</p></div>}
    {admin && <button onClick={edit} className="mt-4 text-sm text-[#d8c08b]">Configurar curso, grupo y exámenes</button>}
    {admin && editing && <form onSubmit={e => { e.preventDefault(); run(async () => {
      const value = { courseUrl: draft.courseUrl, waitingGroupUrl: draft.waitingGroupUrl, exams: Object.fromEntries(exams.map(([key]) => [key, draft[key].split('\n').map(q => q.trim()).filter(Boolean)])) };
      await fetchApi('learning.update', { data: value }); setSettings(value); setEditing(false); setMessage('Configuración guardada.');
    }); }} className="mt-4 space-y-4">
      {['courseUrl', 'waitingGroupUrl'].map((key, i) => <label key={key} className="block text-xs">{i === 0 ? 'Enlace HTTPS al curso' : 'Enlace HTTPS al grupo de espera'}<input type="url" value={draft[key]} onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))} className={field} /></label>)}
      {exams.map(([key, label]) => <label key={key} className="block text-xs">{label} · una pregunta por línea{key === 'FOR-03' && ' (mínimo 20)'}<textarea value={draft[key]} onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))} rows="5" className={field} /></label>)}
      <p className="text-xs text-white/60">Deja vacío el cuestionario que aún no tengas. Las respuestas abiertas se califican mediante revisión; solo aprobarlas acredita puntos.</p>
      <button disabled={busy} className="cai-button-primary rounded-xl p-3">Guardar configuración</button>
    </form>}
    {records && <details className="mt-5"><summary className="cursor-pointer text-[#d8c08b]">Registro de oración y rosario</summary><p className="mt-3 text-xs text-white/60">Registra cada día para VIG-01 y cada rosario para VIG-06. Después reporta la misión para su validación.</p>
      <form onSubmit={e => { e.preventDefault(); run(async () => { await fetchApi('spiritual.record', { data: { kind, day } }); setJournal((await fetchApi('spiritual.list')).items); setMessage('Actividad registrada.'); }); }} className="mt-3 flex flex-wrap items-end gap-3">
        <label className="text-xs">Fecha (Lima)<input required type="date" value={day} onChange={e => setDay(e.target.value)} className={field} /></label>
        <label className="text-xs">Actividad<select value={kind} onChange={e => setKind(e.target.value)} className={field}><option value="PRAYER">Oración diaria</option><option value="ROSARY">Rosario</option></select></label>
        <button disabled={busy} className="cai-button-primary rounded-xl p-3">Registrar</button>
      </form><ul className="mt-3 space-y-1 text-xs text-white/60">{journal.map(r => <li key={`${r.kind}-${r.day}`}>{r.day} · {r.kind === 'PRAYER' ? 'Oración' : 'Rosario'}</li>)}</ul>
    </details>}
  </section>;
}
