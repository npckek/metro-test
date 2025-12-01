import React, { useState, useEffect } from "react";
import { getStations } from "@/api/stations";
import type { Station } from "@/types/station";
import StationCard from "./StationCard";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const StationShowcase: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await getStations();
        setStations(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Произошла неизвестная ошибка."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-bold mb-6">Витрина Станций</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="h-[250px] p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full mt-4" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-red-600 font-semibold">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">
        Витрина Станций ({stations.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stations.map((station) => (
          <StationCard key={station.id} station={station} />
        ))}
      </div>
    </div>
  );
};

export default StationShowcase;
