import decimal
from typing import List

from app.core.auth_utils import get_current_superuser
from app.core.db import get_db
from app.models.station import MetroStation
from app.schemas.station import Station, StationCreate, StationUpdate
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

router = APIRouter()


@router.get(
    "/stations/", response_model=List[Station], summary="Получить список всех станций"
)
def read_stations(db: Session = Depends(get_db)):
    """
    Возвращает список всех станций метро.
    """
    stations = db.query(MetroStation).order_by(MetroStation.id).all()
    return stations


@router.post(
    "/",
    response_model=Station,
    status_code=status.HTTP_201_CREATED,
    summary="Создать новую станцию",
)
def create_station(
    station: StationCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_superuser),
):
    """Создает новую станцию в базе данных. Требуются права суперадмина."""
    db_station = (
        db.query(MetroStation)
        .filter(MetroStation.station_id == station.station_id)
        .first()
    )
    if db_station:
        raise HTTPException(status_code=400, detail="Станция с таким ID уже существует")

    try:
        precise_coordinates = [decimal.Decimal(str(c)) for c in station.coordinates]
    except (TypeError, decimal.InvalidOperation) as exc:
        raise HTTPException(
            status_code=400, detail="Неверный формат координат"
        ) from exc

    db_station = MetroStation(
        **station.model_dump(exclude={"coordinates"}), coordinates=precise_coordinates
    )

    db.add(db_station)
    try:
        db.commit()
        db.refresh(db_station)
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Ошибка базы данных при обновлении: {str(exc)}"
        ) from exc
    return db_station


@router.get("/{station_id}", response_model=Station, summary="Получить станцию по ID")
def read_station(station_id: int, db: Session = Depends(get_db)):
    """Возвращает одну станцию по ее уникальному ID."""
    db_station = (
        db.query(MetroStation).filter(MetroStation.station_id == station_id).first()
    )
    if db_station is None:
        raise HTTPException(status_code=404, detail="Станция не найдена")
    return db_station


@router.put(
    "/{station_id}", response_model=Station, summary="Обновить существующую станцию"
)
def update_station(
    station_id: int,
    station: StationUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_superuser),
):
    """Обновляет существующую станцию. Требуются права суперадмина."""
    db_station = (
        db.query(MetroStation).filter(MetroStation.station_id == station_id).first()
    )
    if db_station is None:
        raise HTTPException(status_code=404, detail="Станция не найдена")

    try:
        precise_coordinates = [decimal.Decimal(str(c)) for c in station.coordinates]
    except (TypeError, decimal.InvalidOperation) as exc:
        raise HTTPException(
            status_code=400, detail="Неверный формат координат"
        ) from exc

    update_data = station.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        if key == "coordinates":
            setattr(db_station, key, precise_coordinates)
        else:
            setattr(db_station, key, value)

    try:
        db.commit()
        db.refresh(db_station)
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Ошибка базы данных при обновлении: {str(exc)}"
        ) from exc
    return db_station


@router.delete(
    "/{station_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Удалить станцию"
)
def delete_station(
    station_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_superuser),
):
    """Удаляет станцию по ID. Требуются права суперадмина."""
    db_station = (
        db.query(MetroStation).filter(MetroStation.station_id == station_id).first()
    )
    if db_station is None:
        raise HTTPException(status_code=404, detail="Станция не найдена")

    db.delete(db_station)
    try:
        db.commit()
    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Ошибка базы данных при удалении: {str(exc)}"
        ) from exc
    return None
