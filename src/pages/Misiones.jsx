import { useEffect, useState } from 'react';
import { fetchApi, downloadFile } from '../api';
import RankProgress from '../components/RankProgress';
import LearningPanel from '../components/LearningPanel';

const input = 'mt-2 block w-full min-w-0 rounded-xl border border-white/10 bg-[#111827] p-3 text-sm text-white';
const button = 'w-full min-w-0 whitespace-normal break-words rounded-xl px-4 py-3 text-sm disabled:opacity-50';
const nowLocal = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
const initialReport = () => ({ submissionNote: '', occurredAt: nowLocal(), endedAt: nowLocal(), companionId: '', evidenceUrl: '', moduleCode: 'CREDO', honorReport: false, recordingIncluded: false, recordingConsent: false, respectConfirmed: false, privacyConfirmed: false, safeFieldConfirmed: false, noVulnerableTargets: false, mentionsMinors: false, linkedMissionId: '' });

export default function Misiones() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = ['SUPER_ADMIN', 'REGISTRADOR'].includes(user.role);
  const [missions, setMissions] = useState([]);
  const [ranks, setRanks] = useState([]);
  const [members, setMembers] = useState([]);
  const [registry, setRegistry] = useState([]);
  const [learning, setLearning] = useState({ exams: {} });
  useEffect(() => { fetchApi('learning.get').then(setLearning).catch(e => setError(e.message)); }, []);
  const [level, setLevel] = useState(1);
  const [category, setCategory] = useState('Todas');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [reportMission, setReportMission] = useState(null);
  const [report, setReport] = useState(initialReport);
  const [file, setFile] = useState(null);
  const [invitation, setInvitation] = useState(null);
  const [reviewMission, setReviewMission] = useState(null);
  const [deleteMission, setDeleteMission] = useState(null);
  const [notice, setNotice] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [review, setReview] = useState({ reviewNote: '', rejectionReason: 'OTHER', requirementsVerified: false, excellent: false, teamBonus: false, firstRegistryBonus: false, sectReportId: '' });
  const [creating, setCreating] = useState(false);
  const [newMission, setNewMission] = useState({ title: '', description: '', missionType: 'FORMATIVA', minimumRankCode: 'CABALLERO_TEMPLE', badgeWeight: 40, evidenceRequirement: '', fieldMission: false });
  const [conduct, setConduct] = useState({ targetId: '', note: '' });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const featured = missions.filter(m => m.publicationState === 'PUBLISHED' && !m.rules.field)[(new Date().getUTCFullYear() * 12 + new Date().getUTCMonth()) % Math.max(1, missions.filter(m => m.publicationState === 'PUBLISHED' && !m.rules.field).length)];
  async function loadMissions(current = page) {
    const data = await fetchApi('missions.list', { data: { page: current, pageSize: 100 } });
    setMissions(data.items); setTotal(data.total);
  }
  useEffect(() => {
    let active = true;
    Promise.all([fetchApi('missions.list', { data: { page: 1, pageSize: 100 } }), fetchApi('ranks.get'), fetchApi('members.list', { data: { pageSize: 100 } }), fetchApi('progress.get'), fetchApi('sectReports.list', { data: { status:'APPROVED',pageSize:100 } })])
      .then(([m, r, u, p, s]) => { if (active) { setMissions(m.items); setTotal(m.total); setRanks(r.ranks); setMembers(u.items); setLevel(p.rank.level); setRegistry(s.items.filter(item => item.reportedByUserId === user.id)); } })
      .catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  async function run(task) {
    setBusy(true); setError('');
    try { await task(); } catch(e) { setError(e.message); } finally { setBusy(false); }
  }
  async function assign(m) {
    await run(async () => { await fetchApi('missions.assign', { data: { id: m.id } }); await loadMissions(); setFeedback(f => ({ ...f, [m.id]: 'Misión asignada. Puedes reportarla y subir la evidencia después.' })); });
  }
  async function removeMission() {
    await run(async () => {
      const id = deleteMission.id;
      await fetchApi('missions.delete', { data: { id } });
      setMissions(items => items.filter(m => m.id !== id));
      setTotal(value => Math.max(0, value - 1));
      setDeleteMission(null);
      setNotice('Misión eliminada del catálogo. El historial y los puntos se conservaron.');
      const current = missions.length === 1 && page > 1 ? page - 1 : page;
      setPage(current);
      await loadMissions(current);
    });
  }
  async function submit(event) {
    event.preventDefault();
    await run(async () => {
      let invitationFileId;
      if (reportMission.rules.invitationRequired) {
        if (!invitation) throw new Error('Adjunta la invitación escrita en PDF.');
        invitationFileId = (await fetchApi('evidence.upload', { file: invitation })).id;
      }
      await fetchApi('submissions.create', { data: { ...report, missionId: reportMission.id, occurredAt: new Date(report.occurredAt).toISOString(), endedAt: new Date(report.endedAt).toISOString(), invitationFileId }, file });
      setFeedback(f => ({ ...f, [reportMission.id]: 'Reporte enviado para revisión.' })); setReportMission(null); setFile(null); setInvitation(null); await loadMissions();
    });
  }
  async function openReviews(m) {
    await run(async () => { const s = await fetchApi('submissions.list', { data: { missionId: m.id, pageSize: 100 } }); setSubmissions(s.items); setReviewMission(m); });
  }
  async function decide(id, status) {
    await run(async () => {
      await fetchApi('submissions.review', { data: { id, status, ...review } });
      setSubmissions((await fetchApi('submissions.list', { data: { missionId: reviewMission.id, pageSize: 100 } })).items);
      await loadMissions();
    });
  }
  const check = (name, label, required = false) => <label className="flex items-start gap-3 text-sm leading-relaxed text-white/70">
    <input type="checkbox" required={required} checked={report[name]} onChange={e => setReport(v => ({ ...v, [name]: e.target.checked }))} className="mt-1 shrink-0 accent-[#d8c08b]" />{label}
  </label>;
  const modal = (title, close, children) => <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6">
    <section role="dialog" aria-modal="true" aria-label={title} className="cai-card max-h-[90dvh] w-full min-w-0 max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#04060b] p-5 sm:p-7">
      <div className="flex items-start justify-between gap-4"><h2 className="cai-display min-w-0 break-words text-2xl text-[#d8c08b]">{title}</h2><button type="button" disabled={busy} onClick={close} aria-label="Cerrar" className="shrink-0 p-2 text-white">✕</button></div>
      {error && <p role="alert" className="mt-4 text-sm text-[#cf5d67]">{error}</p>}{children}
    </section>
  </div>;
  return <div className="min-w-0 space-y-6">
    <header><p className="text-xs uppercase tracking-widest text-[#cf5d67]">Cruzada Apologética Itinerante</p><h1 className="cai-display mt-2 text-4xl text-white">Misiones de la Orden</h1><p className="mt-3 text-sm text-white/60">Asígnate una misión; completa sus requisitos y envía la evidencia cuando termines.</p></header>
    {!isAdmin && <RankProgress onChange={p => { setLevel(p.rank.level); loadMissions().catch(e => setError(e.message)); }} />}
    {!isAdmin && <LearningPanel records />}
    {featured && <aside className="rounded-2xl border border-[#d8c08b]/20 bg-[#d8c08b]/5 p-5"><p className="text-xs uppercase tracking-widest text-[#d8c08b]">Misión destacada del mes</p><p className="mt-2 text-sm text-white">{featured.title}</p><p className="mt-2 text-xs text-white/50">Cuatro semanas seguidas con al menos una misión validada otorgan +25 puntos de constancia.</p></aside>}
    {error && !reportMission && !reviewMission && !deleteMission && !creating && <p role="alert" className="rounded-xl bg-[#cf5d67]/10 p-4 text-sm text-[#cf5d67]">{error}</p>}
    {notice && <p role="status" className="rounded-xl border border-[#d8c08b]/20 p-4 text-sm text-[#d8c08b]">{notice}</p>}
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <label className="text-xs text-white/60">Área del catálogo<select value={category} onChange={e => setCategory(e.target.value)} className={input}><option>Todas</option>{[...new Set(missions.map(m => m.rules.category))].map(c => <option key={c}>{c}</option>)}</select></label>
      {(isAdmin || level >= 5) && <button type="button" onClick={() => { setError(''); setCreating(true); }} className={`${button} cai-button-primary sm:w-auto`}>Crear misión propia</button>}
    </div>
    {loading && <p className="text-white/60">Cargando misiones...</p>}
    <section className="grid min-w-0 gap-5 lg:grid-cols-2">
      {missions.filter(m => category === 'Todas' || category === m.rules.category).map(m => {
        const status = m.myAssignment?.status;
        const repeatable = m.rules.repeatLimit !== 1;
        return <article key={m.id} className="cai-card flex min-w-0 flex-col rounded-2xl border border-white/10 p-5 sm:p-6">
          <div className="flex flex-wrap justify-between gap-2 text-xs text-[#d8c08b]"><span>{m.rules.code || 'Misión propia'} · {m.rules.area}</span><span>{m.badgeWeight} puntos</span></div>
          <h2 className="cai-display mt-3 break-words text-2xl text-white">{m.title}</h2>
          <p className="mt-3 break-words text-sm leading-relaxed text-white/60">{m.description}</p>
          <p className="mt-4 break-words text-xs leading-relaxed text-white/70"><strong>Evidencia exigida:</strong> {m.rules.evidence}</p>
          <div className="mt-3 space-y-1 text-xs text-white/50"><p>Rango mínimo: {ranks.find(r => r.code === m.minimumRankCode)?.name || m.minimumRankCode}</p><p>{m.rules.repeatLimit ? `Hasta ${m.rules.repeatLimit} ${m.rules.repeatLimit === 1 ? 'vez' : 'veces'}` : 'Repetible'} · {m.rules.monthlyCap ? `Tope: ${m.rules.monthlyCap} puntos al mes` : 'Sin tope mensual'}</p>{m.rules.honorAllowed && <p>Autoreporte de honor: 50% de los puntos, tras aceptación.</p>}</div>
          {((level === 1 && m.rules.code === 'PRX-02') || (level === 6 && m.rules.code === 'PRE-03')) && <p className="mt-2 text-xs text-[#d8c08b]">Misión llave disponible para preparar el siguiente rango.</p>}
          <div className="mt-auto grid min-w-0 gap-3 pt-5">
            {isAdmin ? <><button disabled={busy} onClick={() => openReviews(m)} className={`${button} border border-[#d8c08b]/30 text-[#d8c08b]`}>Revisar evidencias</button>{m.publicationState === 'DRAFT' && <button disabled={busy} onClick={() => run(async () => { await fetchApi('missions.publish', { data: { id: m.id } }); await loadMissions(); })} className={`${button} cai-button-primary`}>Publicar misión</button>}<button type="button" disabled={busy} onClick={() => { setError(''); setNotice(''); setDeleteMission(m); }} className={`${button} border border-[#cf5d67]/40 text-[#cf5d67]`}>Eliminar misión</button></> : m.publicationState !== 'PUBLISHED' ? <p className="text-sm text-white/50">Borrador · pendiente de publicación por el administrador</p> : <>
              {status && <p className="text-sm text-[#d8c08b]">{({ ASSIGNED: 'Asignada · evidencia pendiente', PENDING: 'Reporte en revisión', APPROVED: 'Misión validada', REJECTED: 'Reporte rechazado · puedes corregirlo' })[status]}</p>}
              {!status ? <button disabled={busy} onClick={() => assign(m)} className={`${button} cai-button-primary`}>Asignarme esta misión</button> : status !== 'PENDING' && (status !== 'APPROVED' || repeatable) && <button disabled={busy} onClick={() => { setReportMission(m); setReport(initialReport()); setFile(null); setInvitation(null); setError(''); }} className={`${button} cai-button-primary`}>{status === 'APPROVED' ? 'Reportar otra realización' : 'Subir evidencia / reportar misión'}</button>}
            </>}
            {feedback[m.id] && <p role="status" className="break-words text-xs text-white/60">{feedback[m.id]}</p>}
          </div>
        </article>;
      })}
    </section>
    {total > 100 && <div className="flex gap-3"><button disabled={busy || page === 1} onClick={() => run(async () => { await loadMissions(page - 1); setPage(page - 1); })} className={`${button} border border-white/20`}>Anterior</button><span className="self-center text-white">{page}</span><button disabled={busy || page * 100 >= total} onClick={() => run(async () => { await loadMissions(page + 1); setPage(page + 1); })} className={`${button} border border-white/20`}>Siguiente</button></div>}
    <details className="cai-card rounded-2xl p-5 text-white/70"><summary className="cursor-pointer text-sm text-[#d8c08b]">Reportar una conducta al Capítulo</summary><form onSubmit={e => { e.preventDefault(); run(async () => { await fetchApi('conduct.create', { data: conduct }); setConduct({ targetId: '', note: '' }); setError('Reporte enviado al equipo administrador.'); }); }} className="mt-4 space-y-3"><select required value={conduct.targetId} onChange={e => setConduct(c => ({ ...c, targetId: e.target.value }))} className={input}><option value="">Miembro involucrado</option>{members.filter(m => m.id !== user.id).map(m => <option key={m.id} value={m.id}>{m.fullName}</option>)}</select><textarea required maxLength={2000} placeholder="Describe los hechos para que el Capítulo los revise de forma privada." value={conduct.note} onChange={e => setConduct(c => ({ ...c, note: e.target.value }))} className={input} /><button disabled={busy} className={`${button} border border-white/20`}>Enviar reporte privado</button></form></details>
    {isAdmin && deleteMission && modal('Eliminar misión', () => setDeleteMission(null), <div className="mt-5 space-y-4">
      <p className="break-words text-sm text-white">¿Eliminar «{deleteMission.title}»?</p>
      <p className="text-sm leading-relaxed text-white/70">La misión desaparecerá del catálogo y no admitirá nuevas asignaciones ni reportes. Se conservarán el historial, las evidencias y los puntos ya obtenidos. No podrás restaurarla desde esta pantalla.</p>
      {deleteMission.rules.code && <p className="text-sm leading-relaxed text-[#d8c08b]">Esta misión forma parte del catálogo de rangos. Al eliminarla, los miembros ya no podrán completarla para cumplir sus requisitos.</p>}
      <div className="grid gap-3 sm:grid-cols-2"><button type="button" disabled={busy} onClick={() => setDeleteMission(null)} className={`${button} border border-white/20 text-white`}>Cancelar</button><button type="button" disabled={busy} onClick={removeMission} className={`${button} border border-[#cf5d67]/40 bg-[#cf5d67]/10 text-[#cf5d67]`}>{busy ? 'Eliminando...' : 'Confirmar eliminación'}</button></div>
    </div>)}
    {reportMission && modal('Reportar misión', () => setReportMission(null), <form onSubmit={submit} className="mt-5 space-y-4">
      <p className="text-sm text-white">{reportMission.title}</p><p className="text-xs leading-relaxed text-[#d8c08b]">{reportMission.rules.evidence}</p>
      <label className="block text-xs text-white/70">Fecha y hora de realización (tu zona local)<input type="datetime-local" required value={report.occurredAt} onChange={e => setReport(r => ({ ...r, occurredAt: e.target.value }))} className={input} /></label>
      {reportMission.rules.code === 'FOR-04' && <label className="block text-xs text-white/70">Módulo<select value={report.moduleCode} onChange={e => setReport(r => ({ ...r, moduleCode: e.target.value, examAnswers: [] }))} className={input}><option value="CREDO">I · Credo</option><option value="SACRAMENTOS">II · Sacramentos</option><option value="VIDA">III · Vida</option><option value="ORACION">IV · Oración</option></select></label>}
      {['FOR-03', 'FOR-04'].includes(reportMission.rules.code) && <div className="space-y-3 rounded-xl bg-white/5 p-4">
        <h3 className="text-sm text-[#d8c08b]">Examen · respuestas abiertas</h3>
        {!(learning.exams?.[reportMission.rules.code === 'FOR-03' ? 'FOR-03' : report.moduleCode]?.length) && <p role="status" className="text-sm text-white/60">Examen pendiente de configuración por el administrador.</p>}
        {(learning.exams?.[reportMission.rules.code === 'FOR-03' ? 'FOR-03' : report.moduleCode] || []).map((question, i) => <label key={`${report.moduleCode}-${i}`} className="block text-xs text-white/70">{i + 1}. {question}<textarea required maxLength={2000} value={report.examAnswers?.[i] || ''} onChange={e => setReport(r => { const answers = [...(r.examAnswers || [])]; answers[i] = e.target.value; return { ...r, examAnswers: answers }; })} className={input} /></label>)}
      </div>}
      {!reportMission.rules.field && <label className="block text-xs text-white/70">Compañero de actividad (opcional, para trabajo en equipo)<select value={report.companionId} onChange={e => setReport(r => ({...r,companionId:e.target.value}))} className={input}><option value="">Actividad individual</option>{members.filter(m => m.id !== user.id).map(m => <option key={m.id} value={m.id}>{m.fullName}</option>)}</select></label>}
      <label className="block text-xs text-white/70">Bitácora o explicación de la evidencia<textarea required minLength={30} maxLength={2000} value={report.submissionNote} onChange={e => setReport(r => ({ ...r, submissionNote: e.target.value }))} className={`${input} min-h-[120px]`} placeholder="Actividad, objeción, respuesta y resultado. Omite nombres y datos personales de los interlocutores." /></label>
      {reportMission.rules.honorAllowed && check('honorReport', 'Autoreporte bajo palabra de honor: se acredita la mitad del puntaje al aceptarse.')}
      {!report.honorReport && <><label className="block text-xs text-white/70">Archivo (JPG, PNG, WebP, GIF o PDF; máximo 5 MB)<input type="file" accept=".jpg,.jpeg,.png,.webp,.gif,.pdf" onChange={e => setFile(e.target.files?.[0] || null)} className={input} /></label><label className="block text-xs text-white/70">Enlace HTTPS a evidencia o grabación<input type="url" value={report.evidenceUrl} onChange={e => setReport(r => ({ ...r, evidenceUrl: e.target.value }))} className={input} placeholder="https://..." /></label>{check('recordingIncluded', 'La evidencia incluye audio o vídeo de personas.')}{report.recordingIncluded && check('recordingConsent', 'Cuento con el consentimiento explícito de las personas grabadas.', true)}</>}
      {reportMission.rules.field && <div className="space-y-4 rounded-xl bg-white/5 p-4"><p className="text-xs leading-relaxed text-[#d8c08b]">Nunca abordes a menores ni a personas en duelo, crisis o enfermas para debatir. Salidas entre 06:00 y 20:00, hora de Lima; mínimo dos miembros, con acceso autorizado.</p><label className="block text-xs text-white/70">Fin de la actividad<input type="datetime-local" required value={report.endedAt} onChange={e => setReport(r => ({ ...r, endedAt: e.target.value }))} className={input} /></label><select required value={report.companionId} onChange={e => setReport(r => ({ ...r, companionId: e.target.value }))} className={input}><option value="">Selecciona compañero de misión</option>{members.filter(m => m.id !== user.id).map(m => <option key={m.id} value={m.id}>{m.fullName} · {ranks.find(r => r.code === m.rankCode)?.name}</option>)}</select>{check('safeFieldConfirmed', 'Actuamos acompañados, en un entorno seguro y con permiso de acceso.', true)}{check('noVulnerableTargets', 'No abordamos a menores ni a personas vulnerables con fines de debate.', true)}</div>}
      {reportMission.rules.invitationRequired && <label className="block text-xs text-white/70">Invitación escrita obligatoria (PDF)<input type="file" required accept=".pdf" onChange={e => setInvitation(e.target.files?.[0] || null)} className={input} /></label>}
      {reportMission.rules.code === 'VIG-05' && <select required value={report.linkedMissionId} onChange={e => setReport(r => ({ ...r, linkedMissionId: e.target.value }))} className={input}><option value="">Misión por la que ofreciste el ayuno</option>{missions.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}</select>}
      {reportMission.rules.code === 'CAR-01' && <label className="block text-xs text-white/70">Ficha propia aprobada (créala primero en Sectas, con coordenadas)<select required value={report.sectReportId || ''} onChange={e => setReport(r => ({ ...r, sectReportId:e.target.value }))} className={input}><option value="">Selecciona tu ficha</option>{registry.map(s => <option key={s.id} value={s.id}>{s.sectName} · {s.locationDescription}</option>)}</select></label>}
      {check('respectConfirmed', 'La misión se realizó y se reporta con mansedumbre, respeto y veracidad.', true)}
      {check('privacyConfirmed', 'Anonimicé la bitácora. Tengo permiso escrito para cualquier nombre, fotografía o dirección de una persona que aparezca en la evidencia.', true)}
      {check('mentionsMinors', 'La bitácora menciona a menores; solicito revisión especial del administrador.')}
      <div className="grid gap-3 sm:grid-cols-2"><button type="button" disabled={busy} onClick={() => setReportMission(null)} className={`${button} border border-white/20 text-white`}>Subir después</button><button disabled={busy} className={`${button} cai-button-primary`}>{busy ? 'Enviando...' : 'Enviar a revisión'}</button></div>
    </form>)}
    {isAdmin && reviewMission && modal('Validar evidencias', () => setReviewMission(null), <div className="mt-5 space-y-5">
      <p className="text-sm text-white/70">{reviewMission.title} · {reviewMission.rules.evidence}</p>
      {user.role === 'SUPER_ADMIN' && <label className="flex items-start gap-2 text-xs text-white/60"><input type="checkbox" checked={review.foundingValidation || false} onChange={e => setReview(r => ({...r,foundingValidation:e.target.checked}))} />Validación fundacional del Capítulo: solo si todavía no existe un administrador con rango suficiente. Explica la decisión en la nota.</label>}
      <div className="space-y-3 rounded-xl bg-white/5 p-4"><label className="flex gap-2 text-sm text-white"><input type="checkbox" checked={review.requirementsVerified} onChange={e => setReview(r => ({ ...r, requirementsVerified: e.target.checked }))} />Verifiqué todos los requisitos y la autenticidad de la evidencia.</label>{[['excellent', 'Calidad excelente: +20%'], ['teamBonus', 'Equipo con apadrinado de rango inferior: +15'], ['firstRegistryBonus', 'Primera ficha de secta: +25']].map(([key, title]) => <label key={key} className="flex gap-2 text-xs text-white/70"><input type="checkbox" checked={review[key]} onChange={e => setReview(r => ({ ...r, [key]: e.target.checked }))} />{title}</label>)}{review.firstRegistryBonus && <input placeholder="ID de la ficha nueva aprobada" value={review.sectReportId} onChange={e => setReview(r => ({ ...r, sectReportId: e.target.value }))} className={input} />}<textarea placeholder="Motivo de revisión (obligatorio al rechazar)" value={review.reviewNote} onChange={e => setReview(r => ({ ...r, reviewNote: e.target.value }))} className={input} /><select value={review.rejectionReason} onChange={e => setReview(r => ({ ...r, rejectionReason: e.target.value }))} className={input}><option value="OTHER">Rechazo sin sanción</option><option value="DISRESPECT">Burla, desprecio o engaño: −20 puntos</option><option value="FALSE_EVIDENCE">Evidencia falsa: pérdida de puntos del mes; segunda vez, descenso</option></select></div>
      {!submissions.length && <p className="text-sm text-white/50">Todavía no hay reportes.</p>}{submissions.map(s => <article key={s.id} className="space-y-3 rounded-xl border border-white/10 p-4"><p className="text-white">{s.fullName} · {s.status}</p><p className="whitespace-pre-wrap break-words text-sm text-white/70">{s.submissionNote}</p><p className="text-xs text-white/50">{new Date(s.report.occurredAt).toLocaleString()} · {s.report.moduleCode || ''} · {s.report.pointsAwarded} puntos{ s.report.honorReport ? ' · Autoreporte de honor' : ''}</p>{s.report.details.mentionsMinors && <p className="text-sm text-[#cf5d67]">Revisión especial: el reporte menciona menores.</p>}{s.report.details.exam && <div className="space-y-2 text-sm text-white/70">{s.report.details.exam.questions.map((q, i) => <div key={i}><p className="text-[#d8c08b]">{i + 1}. {q}</p><p className="whitespace-pre-wrap">{s.report.details.exam.answers[i]}</p></div>)}</div>}{s.fileId && <button disabled={busy} onClick={() => run(() => downloadFile(s.fileId))} className={`${button} border border-white/20 text-white`}>Descargar evidencia</button>}{s.report.details.invitationFileId && <button disabled={busy} onClick={() => run(() => downloadFile(s.report.details.invitationFileId))} className={`${button} border border-white/20 text-white`}>Descargar invitación</button>}{s.report.details.evidenceUrl && <a href={s.report.details.evidenceUrl} target="_blank" rel="noopener noreferrer" className="block break-all text-sm text-[#d8c08b]">Abrir enlace de evidencia</a>}{s.reviewNote && <p className="text-xs text-white/60">{s.reviewNote}</p>}{s.status === 'PENDING' && <div className="grid gap-3 sm:grid-cols-2"><button disabled={busy || !review.requirementsVerified} onClick={() => decide(s.id, 'APPROVED')} className={`${button} cai-button-primary`}>Aprobar</button><button disabled={busy || !review.reviewNote.trim()} onClick={() => decide(s.id, 'REJECTED')} className={`${button} border border-[#cf5d67]/40 text-[#cf5d67]`}>Rechazar</button></div>}</article>)}
    </div>)}
    {creating && modal('Crear misión propia', () => setCreating(false), <form onSubmit={e => { e.preventDefault(); run(async () => { await fetchApi('missions.create', { data: newMission }); setCreating(false); await loadMissions(); }); }} className="mt-5 space-y-4">{[['title','Título'],['description','Descripción'],['evidenceRequirement','Evidencia exigida']].map(([key,label]) => <label key={key} className="block text-xs text-white/70">{label}<textarea required value={newMission[key]} onChange={e => setNewMission(m => ({ ...m, [key]: e.target.value }))} className={input} /></label>)}<select value={newMission.missionType} onChange={e => setNewMission(m => ({ ...m, missionType: e.target.value, fieldMission: e.target.value === 'OPERACIONAL' }))} className={input}><option value="FORMATIVA">Formativa</option><option value="ESPIRITUAL">Espiritual</option><option value="OPERACIONAL">Campo / operacional</option></select><select value={newMission.minimumRankCode} onChange={e => setNewMission(m => ({ ...m, minimumRankCode: e.target.value }))} className={input}>{ranks.map(r => <option key={r.code} value={r.code}>{r.name}</option>)}</select><label className="block text-xs text-white/70">Puntos<input type="number" min="1" max="1000" required value={newMission.badgeWeight} onChange={e => setNewMission(m => ({ ...m, badgeWeight: Number(e.target.value) }))} className={input} /></label><p className="text-xs text-white/50">Se guardará como borrador para publicación por el administrador.</p><button disabled={busy} className={`${button} cai-button-primary`}>Guardar borrador</button></form>)}
  </div>;
}
