import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { Station } from '@/types/station';
import { Loader2 } from 'lucide-react';
import AdminStationForm from "./AdminStationForm";
import { deleteStation } from "@/api/adminApi";
import { useLoadStations } from "@/hooks/useLoadStations";

const AdminStationList: React.FC = () => {
    const [openForm, setOpenForm] = useState(false);
    const [editingStation, setEditingStation] = useState<Station | null>(null);
    const { stations, loading, error, reload } = useLoadStations();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Загрузка данных...
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 p-4">{error}</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Управление Станциями ({stations.length})</h2>
                <Button onClick={() => { setEditingStation(null); setOpenForm(true); }}>
                    Создать Станцию
                </Button>
            </div>
                <AdminStationForm
                    open={openForm}
                    onClose={() => setOpenForm(false)}
                    station={editingStation}
                    onSaved={reload}
                /> 
            
            <div className="overflow-x-auto rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-20">ID Станции</TableHead>
                            <TableHead>Название</TableHead>
                            <TableHead>Тип</TableHead>
                            <TableHead>Координаты</TableHead>
                            <TableHead className="text-center">Входы 7-9 ч.</TableHead>
                            <TableHead className="text-center">Входы 17-19 ч.</TableHead>
                            <TableHead className="text-center">Выходы 7-9 ч.</TableHead>
                            <TableHead className="text-center">Выходы 17-19 ч.</TableHead>
                            <TableHead className="text-right w-[150px]">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {stations.map((station) => (
                            <TableRow key={station.id}>
                                <TableCell>{station.id}</TableCell>
                                <TableCell>{station.station_id}</TableCell>
                                <TableCell>{station.station_name}</TableCell>
                                <TableCell>{station.transport_type}</TableCell>
                                <TableCell>
                                    X: {station.coordinates[0] || 'N/A'}<br/> Y: {station.coordinates[1]|| 'N/A'}
                                </TableCell>
                                <TableCell className="text-center">{station.entrance_cnt_7}, {station.entrance_cnt_8}, {station.entrance_cnt_9}</TableCell>
                                <TableCell className="text-center">{station.entrance_cnt_17}, {station.entrance_cnt_18}, {station.entrance_cnt_19}</TableCell>
                                <TableCell className="text-center">{station.exit_cnt_7}, {station.exit_cnt_8}, {station.exit_cnt_9}</TableCell>
                                <TableCell className="text-center">{station.exit_cnt_17}, {station.exit_cnt_18}, {station.exit_cnt_19}</TableCell>
                                <TableCell className="text-right space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setEditingStation(station);
                                        setOpenForm(true);
                                    }}
                                    >
                                    Редактировать
                                </Button>

                                <Button
                                    variant="destructive"
                                    onClick={async () => {
                                    let ok = confirm(`Вы уверены, что хотите удалить станцию №${station.station_id}?`);
                                    if (!ok) return;

                                    await deleteStation(station.station_id);
                                    reload();
                                    }}
                                >
                                    Удалить
                                </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminStationList