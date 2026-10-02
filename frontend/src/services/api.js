import { getIdToken } from 'firebase/auth';
import { firebaseAuth } from '@/lib/firebase';
import { isMockMode } from '@/lib/adminMode';

export const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000').replace(/\/$/, '');

async function getAccessToken() {
  if (isMockMode) return 'mock-development-token';
  if (!firebaseAuth?.currentUser) return null;
  return getIdToken(firebaseAuth.currentUser, false);
}

export async function apiRequest(path, { method = 'GET', body, auth = false, signal } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = await getAccessToken();
    if (!token) throw new Error('Your session has expired. Please sign in again.');
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(`${apiBaseUrl}${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), signal });
  const payload = await response.json().catch(() => ({}));
  if (response.status === 401) window.dispatchEvent(new CustomEvent('p2care-auth-expired'));
  if (!response.ok || payload.ok === false) {
    const message = payload?.error?.message || payload?.error || `Request failed with status ${response.status}.`;
    const error = new Error(message);
    error.code = payload?.error?.code; error.details = payload?.error?.details; error.status = response.status;
    throw error;
  }
  return payload.data ?? payload;
}
export function getApiAccessToken() { return getAccessToken(); }
