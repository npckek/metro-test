import axios from 'axios';
import type { Station } from '../types/station';
import type { TokenRequest} from '../types/auth';

const API_BASE_URL = "http://localhost:8000/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// --- Утилиты для Аутентификации ---
export const loginAdmin = async (credentials: TokenRequest): Promise<void> => {
  // Запрос POST просто устанавливает куку на бэкенде.
  await apiClient.post('/auth/token', credentials);
  // Теперь токен автоматически отправляется с каждым последующим запросом.
};

export const logoutAdmin = async (): Promise<void> => {
  // Запрос POST удаляет куку на бэкенде.
  await apiClient.post('/auth/logout');
};

export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    // Вызов защищенного роута. Если кука валидна, получим 200.
    await apiClient.get('/auth/status'); 
    return true;
  } catch {
    // Если кука отсутствует или невалидна, FastAPI вернет 401, и Axios бросит ошибку.
    return false;
  }
};

// --- Публичные API ---
export const getStations = async (): Promise<Station[]> => {
  try {
    const response = await apiClient.get<Station[]>('/stations/');
    return response.data;
  } catch (error) {
    console.error("API Error in getStations:", error);
    throw new Error("Ошибка при получении данных о станциях.");
  }
};

export { apiClient };