// api.js — All HTTP calls to the backend in one place
const BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` };
}

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  // Auth
  register: (data) => request('POST', '/auth/register', data),
  login: (data) => request('POST', '/auth/login', data),

  // Artisans
  getArtisans: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request('GET', `/artisans${q ? '?' + q : ''}`);
  },
  getArtisan: (id) => request('GET', `/artisans/${id}`),
  updateProfile: (data) => request('PUT', '/artisans/profile', data),

  // Demandes
  createDemande: (data) => request('POST', '/demandes', data),
  getMyDemandes: () => request('GET', '/demandes'),
  updateDemande: (id, data) => request('PATCH', `/demandes/${id}`, data),

  // Messages
  getMessages: (roomId) => request('GET', `/messages/${roomId}`),
};
