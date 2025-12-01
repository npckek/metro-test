import React from "react";
import type { Station } from "@/types/station";
import StationCard from "./StationCard";

interface StationListProps {
  stations: Station[];
}

const StationList: React.FC<StationListProps> = ({ stations }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {stations.map((station) => (
        <StationCard key={station.id} station={station} />
      ))}
    </div>
  );
};

export default StationList;
