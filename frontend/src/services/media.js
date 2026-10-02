import { isMockMode } from '@/lib/adminMode';
import { apiBaseUrl, apiRequest } from '@/services/api';

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export function validateImageFile(file) {
  if (!file) throw new Error('Please choose an image.');
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) throw new Error('Only JPG, PNG, WEBP and GIF images are supported.');
  if (file.size > MAX_IMAGE_BYTES) throw new Error('Image must be 5 MB or smaller.');
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Unable to read the image.'));
    reader.readAsDataURL(file);
  });
}

export async function uploadImage(file, folder = 'general') {
  validateImageFile(file);
  const data = await fileToDataUrl(file);
  const result = await apiRequest('/api/media', { method: 'POST', auth: true, body: { fileName: file.name, mimeType: file.type, data, folder } });
  return result.item;
}

export async function listMedia() {
  if (isMockMode) return (await apiRequest('/api/media', { auth: true })).items ?? [];
  return (await apiRequest('/api/media', { auth: true })).items ?? [];
}

export async function removeMedia(id) {
  await apiRequest(`/api/media/${id}`, { method: 'DELETE', auth: true });
}

export function resolveMediaUrl(url) {
  if (!url) return '';
  if (/^(https?:|data:|blob:)/i.test(url)) return url;
  return `${apiBaseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}
