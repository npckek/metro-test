export interface Station {
    id: number;
    station_id: number;
    station_name: string;
    transport_type: string;
    start_line_id: number;
    entrance_cnt_7: number;
    entrance_cnt_8: number;
    entrance_cnt_9: number;
    entrance_cnt_17: number;
    entrance_cnt_18: number;
    entrance_cnt_19: number;
    exit_cnt_7: number;
    exit_cnt_8: number;
    exit_cnt_9: number;
    exit_cnt_17: number;
    exit_cnt_18: number;
    exit_cnt_19: number;
    geometry_type: string;
    coordinates: string[]; 
}