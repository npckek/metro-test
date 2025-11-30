from sqlalchemy import Column, Integer, String, Float, ARRAY, DECIMAL
from sqlalchemy.orm import Mapped, mapped_column
from app.core.db import Base
import decimal 

class MetroStation(Base):
    __tablename__ = "metro_stations"

    id = Column(Integer, primary_key=True, index=True)
    station_id = Column(Integer, index=True, unique=True)
    station_name = Column(String, index=True)
    transport_type = Column(String)
    start_line_id = Column(Float)

    entrance_cnt_7 = Column(Float)
    entrance_cnt_8 = Column(Float)
    entrance_cnt_9 = Column(Float)
    entrance_cnt_17 = Column(Float)
    entrance_cnt_18 = Column(Float)
    entrance_cnt_19 = Column(Float)
    exit_cnt_7 = Column(Float)
    exit_cnt_8 = Column(Float)
    exit_cnt_9 = Column(Float)
    exit_cnt_17 = Column(Float)
    exit_cnt_18 = Column(Float)
    exit_cnt_19 = Column(Float)

    geometry_type = Column(String)
    coordinates: Mapped[list[decimal.Decimal]] = mapped_column(
        ARRAY(DECIMAL(precision=30, scale=18))
    )