import { useState, useEffect, useCallback } from "react";
import { getStations } from "@/api/stations";
import type { Station } from "@/types/station";

export const useLoadStations = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getStations();
      setStations(data);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Не удалось загрузить данные станций.";

      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStations();
  }, [loadStations]);

  return { stations, loading, error, reload: loadStations };
};
