import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { config } from '../lib/config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadRoot = path.resolve(__dirname, '../../uploads/media');
const metadataFile = path.join(uploadRoot, 'media.json');
const allowedMimeTypes = new Map([['image/jpeg', 'jpg'], ['image/png', 'png'], ['image/webp', 'webp'], ['image/gif', 'gif']]);
export const MAX_MEDIA_BYTES = 5 * 1024 * 1024;
function matchesMagicBytes(mimeType, buffer) {
  if (!buffer || buffer.length < 4) return false;
  if (mimeType === 'image/jpeg') return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  if (mimeType === 'image/png') return buffer.subarray(0, 8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]));
  if (mimeType === 'image/webp') return buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP';
  if (mimeType === 'image/gif') return ['GIF87a', 'GIF89a'].includes(buffer.subarray(0, 6).toString('ascii'));
  return false;
}
function safeName(name = 'image') { return String(name).toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 100) || 'image'; }
async function readMetadata() { try { return JSON.parse(await fs.readFile(metadataFile, 'utf8')); } catch (_) { return []; } }
async function writeMetadata(items) { await fs.mkdir(uploadRoot, { recursive: true }); await fs.writeFile(metadataFile, JSON.stringify(items, null, 2)); }
export function validateMedia({ mimeType, size }) {
  if (!allowedMimeTypes.has(mimeType)) throw new Error('Only JPG, PNG, WEBP and GIF images are supported.');
  if (!Number.isFinite(size) || size <= 0 || size > MAX_MEDIA_BYTES) throw new Error('Image must be between 1 byte and 5 MB.');
}
export async function uploadMedia({ fileName, mimeType, buffer, folder = 'general' }) {
  validateMedia({ mimeType, size: buffer.length });
  if (!matchesMagicBytes(mimeType, buffer)) throw new Error('The uploaded file does not match the declared image format.');
  const extension = allowedMimeTypes.get(mimeType);
  const id = crypto.randomUUID();
  const cleanFolder = safeName(folder);
  const cleanBase = safeName(path.parse(fileName || 'image').name);
  const objectPath = `${cleanFolder}/${id}-${cleanBase}.${extension}`;
  const fullPath = path.join(uploadRoot, objectPath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, buffer);
  const url = `${config.backendPublicUrl}/uploads/media/${objectPath.split('/').map(encodeURIComponent).join('/')}`;
  const item = { id, name: fileName || `${id}.${extension}`, path: objectPath, url, mimeType, size: buffer.length, created_at: new Date().toISOString() };
  const metadata = await readMetadata();
  metadata.unshift(item);
  await writeMetadata(metadata);
  return item;
}
export async function listMedia() { return readMetadata(); }
export async function removeMedia(id) {
  const metadata = await readMetadata();
  const item = metadata.find((entry) => entry.id === id);
  if (!item) return false;
  await fs.rm(path.join(uploadRoot, item.path), { force: true });
  await writeMetadata(metadata.filter((entry) => entry.id !== id));
  return true;
}
