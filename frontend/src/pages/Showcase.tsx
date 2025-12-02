import React from "react";
import StationList from "@/components/StationList";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { useLoadStations } from "@/hooks/useLoadStations";

const StationShowcase: React.FC = () => {
  const { stations, loading, error } = useLoadStations();

  return (
    <div className="container mx-auto p-4">
      {/* --- Верхняя панель с кнопкой --- */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Витрина Станций</h2>

        <Link
          to="/login"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition"
        >
          Войти
        </Link>
      </div>

      {/* --- Контент загрузки --- */}
      {loading && (
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
      )}

      {/* --- Ошибка --- */}
      {error && <div className="p-8 text-red-600 font-semibold">{error}</div>}

      {/* --- Список станций --- */}
      {!loading && !error && <StationList stations={stations} />}
    </div>
  );
};

export default StationShowcase;
