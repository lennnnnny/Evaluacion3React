import { API_URL } from '@/constants/config';
import ServiceError from '@/errors/ServiceError';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(cb: () => void) {
  onUnauthorized = cb;
}

async function getToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem('@auth_token');
  } catch (e) {
    return null;
  }
}

async function request(method: 'get' | 'post' | 'put' | 'patch' | 'delete', path: string, data?: any, params?: any) {
  try {
    const token = await getToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json', Accept: 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const url = `${API_URL}${path}`;
    const response = await axios({ method, url, data, params, headers });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      if (status === 401 && onUnauthorized) {
        onUnauthorized();
      }
      const message = error.response.data?.message || `Request failed with status ${status}`;
      throw new ServiceError(message);
    }
    throw new ServiceError(error.message || 'Network error');
  }
}

export const api = {
  get: (path: string, params?: any) => request('get', path, undefined, params),
  post: (path: string, data?: any) => request('post', path, data),
  put: (path: string, data?: any) => request('put', path, data),
  patch: (path: string, data?: any) => request('patch', path, data),
  del: (path: string) => request('delete', path),
};

export default api;
