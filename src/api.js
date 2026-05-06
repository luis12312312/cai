// Cuando estamos en desarrollo, usamos el proxy configurado en vite.config.js bajo '/api'
// Cuando construyamos para producción, podemos usar la URL real.
const isDev = import.meta.env.MODE === 'development';
const API_URL = isDev ? '/api' : (import.meta.env.VITE_API_URL || 'https://cai-backend-ft29.onrender.com');

export const fetchApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // If body is FormData, don't set Content-Type so the browser sets it with boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || 'Error en la petición');
  }

  // Some endpoints might return empty response (204)
  if (response.status === 204) {
    return null;
  }

  return response.json();
};
