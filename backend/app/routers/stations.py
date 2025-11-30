from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.db import get_db
from app.models.station import MetroStation
from app.schemas.station import Station

router = APIRouter()

@router.get("/stations/", response_model=List[Station], summary="Получить список всех станций")
def read_stations(db: Session = Depends(get_db)):
    """
    Возвращает список всех станций метро.
    """
    stations = db.query(MetroStation).all()
    return stations