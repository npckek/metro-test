from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.core.db import Base, engine
from app.services.data_loader import load_data_from_geojson
from app.routers import stations

# Создаем контекстный менеджер для событий жизненного цикла
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Создание таблиц (если они не существуют)
    print("INFO: Creating database tables...")
    Base.metadata.create_all(bind=engine)

    # Загрузка данных
    load_data_from_geojson()

    yield

app = FastAPI(lifespan=lifespan, title="Metro API") 

app.include_router(stations.router, prefix="/api/v1", tags=["stations"])
