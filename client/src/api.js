const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';
export const getToken = () => localStorage.getItem('mystery_token');
export async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}), ...options.headers };
  const response = await fetch(`${BASE}${path}`, { ...options, headers });
  const body = response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.error?.message || body?.message || 'Something went wrong. Please try again.');
  return body;
}
