from pydantic import BaseModel, field_serializer
from typing import List, Any
import decimal

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
    coordinates: List[Any]

# Схема для создания 
class StationCreate(StationBase):
    station_id: int

# Схема для обновления
class StationUpdate(StationBase):
    pass

# Схема для чтения (ответа API)
class Station(StationBase):
    id: int
    station_id: int
    coordinates: List[Any] 
    
    @field_serializer('coordinates')
    def serialize_coords(self, coords: List[Any]) -> List[str]:
        result = []
        for c in coords:
            if isinstance(c, decimal.Decimal):
                result.append(str(c))
            else:
                result.append(f"{c}") 
        return result
        
    class Config:
        from_attributes = True