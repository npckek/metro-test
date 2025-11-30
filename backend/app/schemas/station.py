from pydantic import BaseModel
from typing import List, Any

class StationBase(BaseModel):
    station_name: str
    transport_type: str
    start_line_id: float
    entrance_cnt_7: float
    entrance_cnt_8: float
    entrance_cnt_9: float
    entrance_cnt_17: float
    entrance_cnt_18: float
    entrance_cnt_19: float
    exit_cnt_7: float
    exit_cnt_8: float
    exit_cnt_9: float
    exit_cnt_17: float
    exit_cnt_18: float
    exit_cnt_19: float
    geometry_type: str
    coordinates: List[float] 

# Схема для создания 
class StationCreate(StationBase):
    station_id: int

# Схема для чтения (ответа API)
class Station(StationBase):
    id: int
    station_id: int

    class Config:
        from_attributes = True