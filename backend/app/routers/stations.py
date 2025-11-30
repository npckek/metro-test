from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.db import get_db
from app.models.station import MetroStation
from app.schemas.station import Station, StationCreate, StationUpdate
from app.core.auth_utils import get_current_superuser 
import decimal

router = APIRouter()

# --- Публичный маршрут ---
@router.get("/stations/", response_model=List[Station], summary="Получить список всех станций")
def read_stations(db: Session = Depends(get_db)):
    """
    Возвращает список всех станций метро.
    """
    stations = db.query(MetroStation).all()
    return stations

# --- Административные маршруты ---

# 1. СОЗДАНИЕ
@router.post("/", response_model=Station, status_code=status.HTTP_201_CREATED, summary="Создать новую станцию")
def create_station(
    station: StationCreate, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(get_current_superuser) # ЗАЩИТА
):
    """Создает новую станцию в базе данных. Требуются права суперадмина."""
    # Проверяем, существует ли станция с таким station_id
    db_station = db.query(MetroStation).filter(MetroStation.station_id == station.station_id).first()
    if db_station:
        raise HTTPException(status_code=400, detail="Станция с таким ID уже существует")

    # Преобразование списка координат в list[decimal.Decimal] для ORM
    try:
        precise_coordinates = [decimal.Decimal(str(c)) for c in station.coordinates]
    except (TypeError, decimal.InvalidOperation):
        raise HTTPException(status_code=400, detail="Неверный формат координат")

    db_station = MetroStation(**station.model_dump(exclude={"coordinates"}), coordinates=precise_coordinates)

    db.add(db_station)
    db.commit()
    db.refresh(db_station)
    return db_station

# 2. ЧТЕНИЕ
@router.get("/{station_id}", response_model=Station, summary="Получить станцию по ID")
def read_station(station_id: int, db: Session = Depends(get_db)):
    """Возвращает одну станцию по ее уникальному ID."""
    db_station = db.query(MetroStation).filter(MetroStation.station_id == station_id).first()
    if db_station is None:
        raise HTTPException(status_code=404, detail="Станция не найдена")
    return db_station

# 3. ОБНОВЛЕНИЕ
@router.put("/{station_id}", response_model=Station, summary="Обновить существующую станцию")
def update_station(
    station_id: int, 
    station: StationUpdate, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(get_current_superuser) # ЗАЩИТА
):
    """Обновляет существующую станцию. Требуются права суперадмина."""
    db_station = db.query(MetroStation).filter(MetroStation.station_id == station_id).first()
    if db_station is None:
        raise HTTPException(status_code=404, detail="Станция не найдена")

    # Преобразование координат
    try:
        precise_coordinates = [decimal.Decimal(str(c)) for c in station.coordinates]
    except (TypeError, decimal.InvalidOperation):
        raise HTTPException(status_code=400, detail="Неверный формат координат")

    update_data = station.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        if key == "coordinates":
            setattr(db_station, key, precise_coordinates)
        else:
            setattr(db_station, key, value)

    db.commit()
    db.refresh(db_station)
    return db_station

# 4. УДАЛЕНИЕ (DELETE)
@router.delete("/{station_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Удалить станцию")
def delete_station(
    station_id: int, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_superuser) # ЗАЩИТА
):
    """Удаляет станцию по ID. Требуются права суперадмина."""
    db_station = db.query(MetroStation).filter(MetroStation.station_id == station_id).first()
    if db_station is None:
        raise HTTPException(status_code=404, detail="Станция не найдена")

    db.delete(db_station)
    db.commit()
    return None # 204 No Content