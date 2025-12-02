import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Station, StationCreate, StationUpdate } from "@/types/station";
import { createStation, updateStation } from "@/api/adminApi";

interface Props {
  open: boolean;
  onClose: () => void;
  station?: Station | null;
  onSaved: () => void;
}

const AdminStationForm: React.FC<Props> = ({
  open,
  onClose,
  station,
  onSaved,
}) => {
  const isEditing = Boolean(station);

  const createInitialForm = (station?: Station | null): StationCreate => ({
    id: station?.id ?? 0,
    station_id: station?.station_id ?? 0,
    station_name: station?.station_name ?? "",
    transport_type: station?.transport_type ?? "",
    start_line_id: station?.start_line_id ?? 1,
    geometry_type: station?.geometry_type ?? "Point",
    coordinates: station?.coordinates ?? ["0", "0"],

    entrance_cnt_7: station?.entrance_cnt_7 ?? 0,
    entrance_cnt_8: station?.entrance_cnt_8 ?? 0,
    entrance_cnt_9: station?.entrance_cnt_9 ?? 0,
    entrance_cnt_17: station?.entrance_cnt_17 ?? 0,
    entrance_cnt_18: station?.entrance_cnt_18 ?? 0,
    entrance_cnt_19: station?.entrance_cnt_19 ?? 0,

    exit_cnt_7: station?.exit_cnt_7 ?? 0,
    exit_cnt_8: station?.exit_cnt_8 ?? 0,
    exit_cnt_9: station?.exit_cnt_9 ?? 0,
    exit_cnt_17: station?.exit_cnt_17 ?? 0,
    exit_cnt_18: station?.exit_cnt_18 ?? 0,
    exit_cnt_19: station?.exit_cnt_19 ?? 0,
  });

  const [form, setForm] = useState<StationCreate>(() =>
    createInitialForm(station),
  );

  useEffect(() => {
    if (open) {
      setForm(createInitialForm(station));
    }
  }, [open, station]);

  const validateForm = (form: StationCreate): string | null => {
    if (!form.station_id || form.station_id <= 0) {
      return "ID станции должен быть положительным числом.";
    }

    if (!form.station_name.trim()) {
      return "Название станции не может быть пустым.";
    }

    if (!form.transport_type.trim()) {
      return "Тип транспорта обязателен.";
    }

    if (
      !form.coordinates ||
      form.coordinates.length !== 2 ||
      form.coordinates.some((c) => isNaN(Number(c)))
    ) {
      return "Координаты должны содержать два корректных числа.";
    }

    const numericFields = [
      "entrance_cnt_7",
      "entrance_cnt_8",
      "entrance_cnt_9",
      "entrance_cnt_17",
      "entrance_cnt_18",
      "entrance_cnt_19",
      "exit_cnt_7",
      "exit_cnt_8",
      "exit_cnt_9",
      "exit_cnt_17",
      "exit_cnt_18",
      "exit_cnt_19",
    ] as (keyof StationCreate)[];

    for (const key of numericFields) {
      const value = Number(form[key] as number);
      if (value < 0 || Number.isNaN(value)) {
        return `Поле "${key}" должно быть числом ≥ 0.`;
      }
    }

    return null;
  };

  const handleChange = (field: keyof StationCreate, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCoordChange = (index: number, value: string) => {
    const coords = [...form.coordinates];
    coords[index] = value;
    setForm((prev) => ({ ...prev, coordinates: coords }));
  };

  const entranceKeys: (keyof StationCreate)[] = [
    "entrance_cnt_7",
    "entrance_cnt_8",
    "entrance_cnt_9",
    "entrance_cnt_17",
    "entrance_cnt_18",
    "entrance_cnt_19",
  ];

  const exitKeys: (keyof StationCreate)[] = [
    "exit_cnt_7",
    "exit_cnt_8",
    "exit_cnt_9",
    "exit_cnt_17",
    "exit_cnt_18",
    "exit_cnt_19",
  ];

  const renderNumberGroup = (label: string, keys: (keyof StationCreate)[]) => (
    <>
      <h3 className="font-semibold">{label}</h3>

      <div className="grid grid-cols-3 gap-3">
        {keys.map((key) => {
          const hour = key.match(/\d+/)?.[0] ?? key;
          return (
            <div key={key}>
              <Label>{hour}</Label>
              <Input
                type="number"
                value={form[key]}
                onChange={(e) => handleChange(key, Number(e.target.value))}
              />
            </div>
          );
        })}
      </div>
    </>
  );

  const handleSubmit = async () => {
    const error = validateForm(form);
    if (error) {
      alert(error);
      return;
    }

    try {
      if (isEditing) {
        await updateStation(form.station_id, form as StationUpdate);
      } else {
        await createStation(form as StationCreate);
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error("Ошибка при сохранении станции:", err);
      alert("Не удалось сохранить станцию");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Редактировать Станцию" : "Создать Станцию"}
          </DialogTitle>
          <DialogDescription>
            Заполните форму и нажмите "Сохранить".
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-2">
          {/* Базовая информация */}
          <div className="grid gap-3">
            <div>
              <Label>ID станции</Label>
              <Input
                type="number"
                value={form.station_id}
                onChange={(e) =>
                  handleChange("station_id", Number(e.target.value))
                }
              />
            </div>

            <div>
              <Label>Название</Label>
              <Input
                value={form.station_name}
                onChange={(e) => handleChange("station_name", e.target.value)}
              />
            </div>

            <div>
              <Label>Тип транспорта</Label>
              <Input
                value={form.transport_type}
                onChange={(e) => handleChange("transport_type", e.target.value)}
              />
            </div>
            <div>
              <Label>Номер линии</Label>
              <Input
                value={form.start_line_id}
                onChange={(e) =>
                  handleChange("start_line_id", Number(e.target.value))
                }
              />
            </div>
          </div>

          {/* Координаты */}
          <h3 className="font-semibold">Координаты</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>X</Label>
              <Input
                value={form.coordinates[0]}
                onChange={(e) => handleCoordChange(0, e.target.value)}
              />
            </div>
            <div>
              <Label>Y</Label>
              <Input
                value={form.coordinates[1]}
                onChange={(e) => handleCoordChange(1, e.target.value)}
              />
            </div>
          </div>

          {/* Блоки входов/выходов */}
          {renderNumberGroup("Входы", entranceKeys)}
          {renderNumberGroup("Выходы", exitKeys)}

          {/* Кнопка */}
          <Button onClick={handleSubmit} className="w-full mt-4">
            {isEditing ? "Сохранить изменения" : "Создать станцию"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminStationForm;
