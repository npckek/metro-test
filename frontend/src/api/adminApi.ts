import { apiClient } from './stations';
import type { Station, StationCreate, StationUpdate } from '@/types/station';

export const createStation = async (stationData: StationCreate): Promise<Station> => {
  const response = await apiClient.post<Station>('/', stationData);
  return response.data;
};

export const updateStation = async (stationId: number, stationData: StationUpdate): Promise<Station> => {
  const response = await apiClient.put<Station>(`/${stationId}`, stationData);
  return response.data;
};

export const deleteStation = async (stationId: number): Promise<void> => {
  await apiClient.delete(`/${stationId}`);
};
