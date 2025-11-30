import React, { useState, useEffect } from 'react';
import { getStations } from '@/api/stations';
import type { Station } from '@/types/station';

const StationList: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await getStations();
        setStations(data);
      } catch (err) {
        // Ошибка, переброшенная из api.ts
        setError(err instanceof Error ? err.message : "Произошла неизвестная ошибка.");
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Загрузка данных...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600 font-semibold">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Список Станций Метро ({stations.length})</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Название</th>
              <th className="py-2 px-4 border-b">Тип</th>
              <th className="py-2 px-4 border-b">Координаты (долгота, широта)</th>
            </tr>
          </thead>
          <tbody>
            {stations.slice(0, 10).map((station) => (
              <tr key={station.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b text-center">{station.station_id}</td>
                <td className="py-2 px-4 border-b">{station.station_name}</td>
                <td className="py-2 px-4 border-b text-center">{station.transport_type}</td>
                <td className="py-2 px-4 border-b text-sm font-mono">
                  {station.coordinates.join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-sm text-gray-500">Отображены первые 10 записей.</p>
      </div>
    </div>
  );
};

export default StationList;