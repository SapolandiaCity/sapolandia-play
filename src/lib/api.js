const BASE = import.meta.env.VITE_API_URL || '';
const TOKEN_KEY = 'spl_token';
const ADMIN_KEY = 'spl_admin_token';

export const hasBackend = () => Boolean(BASE);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));
export const getAdmin = () => localStorage.getItem(ADMIN_KEY);
export const setAdmin = (t) => (t ? localStorage.setItem(ADMIN_KEY, t) : localStorage.removeItem(ADMIN_KEY));

async function call(path, { method = 'GET', body } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

async function adminCall(path, opts = {}) {
  const res = await fetch(BASE + path, {
    ...opts,
    headers: { 'Content-Type': 'application/json', 'x-admin-token': getAdmin() || '' }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

export const api = {
  register: (payload) => call('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => call('/auth/login', { method: 'POST', body: payload }),
  me: () => call('/me'),
  createDeposit: (amount) => call('/deposits', { method: 'POST', body: { amount } }),
  deposits: () => call('/deposits'),
  requestWithdrawal: (payload) => call('/withdrawals', { method: 'POST', body: payload })
};

export const adminApi = {
  login: (password) => adminCall('/admin/login', { method: 'POST', body: JSON.stringify({ password }) }),
  stats: () => adminCall('/admin/stats'),
  deposits: () => adminCall('/admin/deposits'),
  confirmDeposit: (id) => adminCall(`/admin/deposits/${id}/confirm`, { method: 'POST' }),
  withdrawals: () => adminCall('/admin/withdrawals'),
  users: () => adminCall('/admin/users')
};
