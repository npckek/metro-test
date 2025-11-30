import axios from 'axios';
import type { Station } from '../types/station';

const API_BASE_URL = "http://localhost:8000/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Место для обработки тоекенов аутентификации
});


export const getStations = async (): Promise<Station[]> => {
  try {
    const response = await apiClient.get<Station[]>('/stations/');
    return response.data;
  } catch (error) {
    console.error("API Error in getStations:", error);
    throw new Error("Ошибка при получении данных о станциях.");
  }
};