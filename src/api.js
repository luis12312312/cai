// VITE_API_URL es el origen de Render, sin /api. Vite usa un proxy en desarrollo.
const configuredUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '');
const API_URL = import.meta.env.DEV ? '/api' : `${configuredUrl || ''}/api`;

export const fetchApi = async (action, options = {}) => {
  if (!import.meta.env.DEV && !configuredUrl) {
    throw new Error('Configura VITE_API_URL con la URL del backend en Vercel.');
  }
  const token = localStorage.getItem('token');
  const headers = { ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  let body;
  if (options.file) {
    body = new FormData();
    body.append('file', options.file);
    body.append('action', action);
    body.append('data', JSON.stringify(options.data || {}));
  } else {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify({ action, data: options.data || {} });
  }
  const response = await fetch(API_URL, { method: 'POST', headers, body, signal: options.signal });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && !['auth.login', 'auth.register'].includes(action)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.assign('/login');
    }
    const error = new Error(result.message || 'No se pudo completar la solicitud.');
    error.status = response.status;
    error.code = result.error;
    throw error;
  }
  return result;
};

export const refreshUser = async () => {
  const user = await fetchApi('auth.me');
  localStorage.setItem('user', JSON.stringify(user));
  return user;
};

export const logout = async () => {
  try { await fetchApi('auth.logout'); }
  finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.assign('/login');
  }
};

export const downloadFile = async (id) => {
  const file = await fetchApi('files.get', { data: { id } });
  const bytes = Uint8Array.from(atob(file.base64), (character) => character.charCodeAt(0));
  const url = URL.createObjectURL(new Blob([bytes], { type: file.contentType }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = file.name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
