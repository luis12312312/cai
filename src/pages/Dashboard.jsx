import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApi } from '../api';
import RankProgress from '../components/RankProgress';
import RankAdministration from '../components/RankAdministration';
import LearningPanel from '../components/LearningPanel';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Icono personalizado para el mapa (dorado acorde al diseño)
const customIcon = L.divIcon({
  className: 'cai-map-marker',
  html: '<span class="cai-map-marker-dot" aria-hidden="true"></span>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -14],
});

// Límites del mapa para evitar que el usuario se salga del mundo
const mapBounds = [
  [-85.0511, -180], // Suroeste: límite de la proyección del mapa
  [85.0511, 180]    // Noreste
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [progress, setProgress] = useState(null);
  const [history, setHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [locations, setLocations] = useState([]);
  const [mapError, setMapError] = useState('');
  const [currentMissions, setCurrentMissions] = useState([]);
  const [featured, setFeatured] = useState(null);
  useEffect(() => {
    let active = true;
    Promise.all([fetchApi('assignments.list', { data: { pageSize: 100 } }), fetchApi('missions.list', { data: { pageSize: 100 } })]).then(([a, m]) => {
      if (!active) return;
      setCurrentMissions(a.items.filter(item => item.userId === user.id && ['ASSIGNED', 'PENDING', 'REJECTED'].includes(item.status)));
      const eligible = m.items.filter(item => item.publicationState === 'PUBLISHED' && !item.rules.field);
      const month = new Date().getUTCFullYear() * 12 + new Date().getUTCMonth();
      setFeatured(eligible[month % Math.max(1, eligible.length)] || null);
    }).catch(e => { if (active) setMissionError(e.message); });
    return () => { active = false; };
  }, []);
  const [missionError, setMissionError] = useState('');
  useEffect(() => {
    let active=true;
    fetchApi('sectRegistry.list', {data:{pageSize:100}}).then(data => {if(active) setLocations(data.items.filter(s => typeof s.latitude==='number' && typeof s.longitude==='number'));}).catch(e => {if(active) setMapError(e.message);});
    return () => {active=false;};
  }, []);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'SUPER_ADMIN' || user.role === 'REGISTRADOR';

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAdmin) {
          const [data, pendingUsers] = await Promise.all([
            fetchApi('overview.get'),
            fetchApi('users.list', { data: { role: 'SOLDADO_PENDING', page: 1, pageSize: 1 } })
          ]);
          setOverview(data);
          if (pendingUsers && typeof pendingUsers.total !== 'undefined') {
            setPendingCount(pendingUsers.total);
          }
        } else if (user.role === 'SOLDADO_ACTIVE') {
          const [prog, hist] = await Promise.all([
            fetchApi('progress.get'),
            fetchApi('history.get')
          ]);
          setProgress(prog);
          setHistory(hist);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isAdmin, user.role]);

  const getStats = () => {
    if (isAdmin) {
      return [
        {
          title: 'Apologetas Pendientes',
          value: pendingCount || 0,
          icon: 'how_to_reg',
          color: 'text-[#d8c08b]',
          action: () => navigate('/apologetas-pendientes')
        },
        {
          title: 'Misiones por Revisar',
          value: overview?.missionSubmissions?.pendingCount || 0,
          icon: 'menu_book',
          color: 'text-white',
        },
        {
          title: 'Alertas de Sectas',
          value: overview?.sectReports?.pendingCount || 0,
          icon: 'warning',
          color: 'text-[#cf5d67]',
          badge: 'Crítico',
        },
      ];
    } else {
      return [
        {
          title: 'Misiones Completadas',
          value: history?.completedMissionTotal || 0,
          icon: 'task_alt',
          color: 'text-[#d8c08b]',
        },
        {
          title: 'Rango Actual',
          value: progress?.rank?.name || 'Postulante',
          icon: 'military_tech',
          color: 'text-white',
        },
        {
          title: 'Puntos acumulados',
          value: progress?.totalPoints || 0,
          icon: 'workspace_premium',
          color: 'text-[#d8c08b]',
        },
      ];
    }
  };

  const stats = getStats();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col gap-2">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#d8c08b]/70 font-semibold">Pax et Bonum</p>
        <h1 className="cai-display text-3xl md:text-5xl text-white">
          Bienvenido a la <span className="italic text-[#d8c08b]">Cruzada Apologética Itinerante</span>
        </h1>
        <div className="h-0.5 w-16 bg-gradient-to-r from-[#cf5d67] to-[#d8c08b] mt-2"></div>
      </header>
      {isAdmin ? <RankAdministration /> : <RankProgress />}
      <LearningPanel admin={isAdmin} records={!isAdmin} />
      <section className="cai-card rounded-2xl p-5 text-white">
        <h2 className="cai-display text-2xl text-[#d8c08b]">Misiones en curso</h2>
        {missionError && <p role="alert" className="mt-3 text-[#cf5d67]">{missionError}</p>}
        <ul className="mt-3 space-y-2 text-sm">{currentMissions.map(m => <li key={m.id}>{m.missionTitle} · {({ ASSIGNED: 'Asignada', PENDING: 'En revisión', REJECTED: 'Por corregir' })[m.status]}</li>)}</ul>
        {featured && <div className="mt-4"><p className="text-sm text-[#d8c08b]">Misión emergente del mes: {featured.title}</p><p className="mt-2 text-xs text-white/60">Cuatro semanas consecutivas con una misión validada: +25 puntos de constancia.</p></div>}
        <Link to="/misiones" className="mt-4 inline-block text-sm text-[#d8c08b]">Ir a Misiones</Link>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <article
            key={stat.title}
            onClick={stat.action}
            className={`cai-card rounded-2xl p-6 border border-white/5 relative overflow-hidden group ${stat.action ? 'cursor-pointer hover:border-[#d8c08b]/30 transition-colors' : ''}`}
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
              <span className={`material-symbols-outlined text-8xl ${stat.color}`}>{stat.icon}</span>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className={`material-symbols-outlined text-2xl ${stat.color}`}>{stat.icon}</span>
                {stat.badge && (
                  <span className="bg-[#cf5d67] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">
                    {stat.badge}
                  </span>
                )}
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-1">{stat.title}</p>
              <p className={`cai-display text-4xl md:text-5xl ${stat.color}`}>{stat.value}</p>
            </div>
          </article>
        ))}
      </section>

      {/* 
      <section className="cai-panel rounded-2xl p-8 border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#04060b] via-[#04060b]/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-lg">
          <h3 className="cai-display text-2xl md:text-3xl text-[#d8c08b] mb-3">Biblioteca de Doctrina</h3>
          <p className="text-sm text-white/70 leading-relaxed mb-6">
            Accede a los manuscritos sagrados de la apologética bíblica y teológica. Refuerza tu conocimiento para la defensa de la fe.
          </p>
          <button className="cai-button-secondary rounded-full px-6 py-2.5 text-xs uppercase tracking-widest font-semibold text-[#d8c08b] border border-[#d8c08b]/30 hover:bg-[#d8c08b]/10 transition-colors">
            Consultar Archivos
          </button>
        </div>
      </section>
      */}

      <section className="cai-panel rounded-2xl p-4 md:p-8 border border-white/5 relative overflow-hidden flex flex-col gap-4">
        <div>
          <h3 className="cai-display text-2xl md:text-3xl text-[#d8c08b]">Despliegue Global</h3>
          <p className="text-sm text-white/50">Fichas aprobadas con ubicación pública en el mapa.</p>
          {mapError && <p className="mt-2 text-xs text-[#cf5d67]">{mapError}</p>}
        </div>
        <div className="h-[400px] w-full rounded-xl overflow-hidden border border-[#d8c08b]/20 relative z-10">
          <MapContainer 
            center={[15, -40]} 
            zoom={2}
            minZoom={2}
            maxZoom={19}
            maxBounds={mapBounds}
            maxBoundsViscosity={1.0}
            zoomControl={true}
            attributionControl={true}
            style={{ height: '100%', width: '100%', background: '#04060b' }}
          >
            <TileLayer
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              maxZoom={19}
              noWrap={true}
              referrerPolicy="strict-origin-when-cross-origin"
            />
            {locations.map((loc) => (
              <Marker key={loc.id} position={[loc.latitude,loc.longitude]} icon={customIcon}>
                <Popup>
                  <div className="text-center p-1">
                    <p className="font-bold text-[#04060b] mb-1">{loc.sectName}</p>
                    <p className="text-xs text-gray-600">{loc.locationDescription}</p>
                    <p className="mt-2 text-xs text-gray-600">{loc.referenceNote}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
