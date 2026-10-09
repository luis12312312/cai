import { useEffect, useRef, useState } from 'react';
import { fetchApi } from '../api';
import { countries } from '../data/countries';

const field = 'mt-2 block w-full rounded-xl border border-white/10 bg-[#111827] p-3 text-sm text-white';
export default function LocationPicker({ value, onChange, required = true, disabled = false }) {
  const [results, setResults] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const request = useRef(null);
  useEffect(() => () => request.current?.abort(), []);
  function change(next) {
    request.current?.abort(); setBusy(false); setError(''); setResults([]);
    onChange({ ...value, ...next, locationId: '' });
  }
  async function search() {
    request.current?.abort(); const controller = new AbortController(); request.current = controller;
    setBusy(true); setError(''); setResults([]);
    try {
      const data = await fetchApi('locations.search', { data: { q: value.city, countryCode: value.countryCode }, signal: controller.signal });
      if (!controller.signal.aborted) { setResults(data.items); if (!data.items.length) setError('No se encontraron ciudades. Prueba el nombre completo o una ciudad cercana.'); }
    } catch (e) { if (!controller.signal.aborted) setError(e.message); }
    finally { if (!controller.signal.aborted) setBusy(false); }
  }
  return <fieldset disabled={disabled} className="min-w-0 space-y-3 text-sm text-white/70">
    <legend className="text-[#d8c08b]">País y ciudad</legend>
    <label className="block">País<select required={required} value={value.countryCode || ''} onChange={e => change({ countryCode: e.target.value, country: countries.find(c => c.code === e.target.value)?.name || '', city: '' })} className={field}>
      <option value="">Selecciona tu país</option>{countries.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
    </select></label>
    <label className="block">Ciudad<input required={required} maxLength={100} value={value.city || ''} onChange={e => change({ city: e.target.value })} placeholder="Escribe tu ciudad" className={field} /></label>
    <button type="button" disabled={busy || !value.countryCode || value.city?.trim().length < 2} onClick={search} className="rounded-xl border border-[#d8c08b]/30 px-4 py-2 text-[#d8c08b] disabled:opacity-50">{busy ? 'Buscando...' : 'Buscar ciudad'}</button>
    {!!results.length && <label className="block">Selecciona la ubicación<select required={required} value={value.locationId || ''} onChange={e => { const city = results.find(c => c.id === e.target.value); if (city) onChange({ ...city, locationId: city.id }); else onChange({ ...value, locationId: '' }); }} className={field}>
      <option value="">Selecciona una ciudad de los resultados</option>{results.map(c => <option key={c.id} value={c.id}>{c.city}{c.region ? `, ${c.region}` : ''}, {c.country}</option>)}
    </select></label>}
    {error && <p role="alert" className="text-[#cf5d67]">{error}</p>}
    <p className="text-xs text-white/50">{value.locationId ? `${value.city}, ${value.country}: ubicación seleccionada.` : 'Busca y selecciona una ciudad para situar tu punto en el mapa.'} Se muestra la ubicación de la ciudad al aprobar tu cuenta.</p>
    <p className="text-xs text-white/40">Ciudades: <a href="https://open-meteo.com/en/docs/geocoding-api" target="_blank" rel="noreferrer">Open-Meteo</a> / <a href="https://www.geonames.org/" target="_blank" rel="noreferrer">GeoNames</a>.</p>
  </fieldset>;
}
