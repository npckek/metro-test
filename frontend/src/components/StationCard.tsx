import React from "react";
import type { StationBase } from "@/types/station";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface StationCardProps {
  station: StationBase;
}

const StationCard: React.FC<StationCardProps> = ({ station }) => {
  // Форматируем координаты для отображения
  const [lon, lat] = station.coordinates;

  // Вычисляем суммарный вход/выход для краткого отображения
  const totalEntrance = (
    station.entrance_cnt_7 +
    station.entrance_cnt_8 +
    station.entrance_cnt_9 +
    station.entrance_cnt_17 +
    station.entrance_cnt_18 +
    station.entrance_cnt_19
  ).toFixed(0);

  const totalExit = (
    station.exit_cnt_7 +
    station.exit_cnt_8 +
    station.exit_cnt_9 +
    station.exit_cnt_17 +
    station.exit_cnt_18 +
    station.exit_cnt_19
  ).toFixed(0);

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{station.station_name}</CardTitle>
        <CardDescription>
          {station.transport_type} (ID: {station.station_id})
        </CardDescription>
      </CardHeader>
      <CardContent className="grow">
        <div className="space-y-1 text-sm">
          <p>
            <span className="font-semibold">Координаты:</span> <br />
            {lon} {lat}
          </p>
          {/* <p>
            <span className="font-semibold">Тип геометрии:</span> {station.geometry_type}
          </p> */}
          {/* <Separator className="my-3" /> */}

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-base py-2">
                Подробнее
              </AccordionTrigger>
              <AccordionContent className="p-0 pt-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="font-semibold">Всего входов:</div>
                  <div className="text-right">{totalEntrance}</div>
                  <div className="font-semibold">Всего выходов:</div>
                  <div className="text-right">{totalExit}</div>

                  <Separator className="col-span-2 my-2" />

                  <div className="font-semibold text-gray-500">
                    Входы (7/8/9ч):
                  </div>
                  <div className="text-right text-gray-500">
                    {station.entrance_cnt_7.toFixed(0)} /{" "}
                    {station.entrance_cnt_8.toFixed(0)} /{" "}
                    {station.entrance_cnt_9.toFixed(0)}
                  </div>
                  <div className="font-semibold text-gray-500">
                    Входы (17/18/19ч):
                  </div>
                  <div className="text-right text-gray-500">
                    {station.entrance_cnt_17.toFixed(0)} /{" "}
                    {station.entrance_cnt_18.toFixed(0)} /{" "}
                    {station.entrance_cnt_19.toFixed(0)}
                  </div>

                  <Separator className="col-span-2 my-2" />

                  <div className="font-semibold text-gray-500">
                    Выходы (7/8/9ч):
                  </div>
                  <div className="text-right text-gray-500">
                    {station.exit_cnt_7.toFixed(0)} /{" "}
                    {station.exit_cnt_8.toFixed(0)} /{" "}
                    {station.exit_cnt_9.toFixed(0)}
                  </div>
                  <div className="font-semibold text-gray-500">
                    Выходы (17/18/19ч):
                  </div>
                  <div className="text-right text-gray-500">
                    {station.exit_cnt_17.toFixed(0)} /{" "}
                    {station.exit_cnt_18.toFixed(0)} /{" "}
                    {station.exit_cnt_19.toFixed(0)}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
};

export default StationCard;
