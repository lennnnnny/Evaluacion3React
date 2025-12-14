import { API_URL } from '@/constants/config';
import ServiceError from '@/errors/ServiceError';
import { getAuthToken } from '@/utils/storage';
import axios from 'axios';

function buildAuthHeader(token?: string) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function uploadImage(fileUri: string, onProgress?: (percent: number) => void) {
  try {
    const token = await getAuthToken();
    const form = new FormData();
    const filename = fileUri.split('/').pop() || 'image.jpg';
    const ext = filename.split('.').pop() || 'jpg';
    const mime = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'application/octet-stream';
    // @ts-ignore - React Native FormData file object
    form.append('image', { uri: fileUri, name: filename, type: mime });

    const headers: any = { 'Content-Type': 'multipart/form-data', Accept: 'application/json', ...buildAuthHeader(token || undefined) };

    const res = await axios.post(`${API_URL}/images`, form as any, {
      headers,
      onUploadProgress: (progressEvent: any) => {
        try {
          if (onProgress && progressEvent.total) {
            const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            onProgress(percent);
          }
        } catch (e) {
          // ignore
        }
      },
    });
    return res.data;
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      if (status === 413) {
        throw new ServiceError('Archivo demasiado grande. Reduce la resolución o el tamaño de la imagen (413).');
      }
      const message = error.response.data?.message || `Upload failed with status ${status}`;
      throw new ServiceError(message);
    }
    throw new ServiceError(error.message || 'Network error on image upload');
  }
}

export async function deleteImageByKey(key: string) {
  try {
    const token = await getAuthToken();
    const headers = { Accept: 'application/json', ...buildAuthHeader(token || undefined) };
    const res = await axios.delete(`${API_URL}/images/${encodeURIComponent(key)}`, { headers });
    return res.data;
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      // Treat 404 as non-fatal: image already not present on server
      if (status === 404) {
        return null;
      }
      const message = error.response.data?.message || `Delete failed with status ${status}`;
      throw new ServiceError(message);
    }
    throw new ServiceError(error.message || 'Network error on image delete');
  }
}

export async function deleteImageByUrl(url: string) {
  try {
    if (!url) return null;
    try {
      const parsed = new URL(url);
      const key = parsed.pathname.replace(/^\//, '');
      return await deleteImageByKey(key);
    } catch (e) {
      // If URL parsing fails, attempt to strip origin manually
      const parts = url.split('/').slice(3); // remove protocol and domain
      const key = parts.join('/');
      return await deleteImageByKey(key);
    }
  } catch (err) {
    throw err;
  }
}

export default { uploadImage, deleteImageByKey, deleteImageByUrl };
