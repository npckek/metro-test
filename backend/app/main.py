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

from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:5173",   # Vite
    "http://localhost",        # общий
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stations.router, prefix="/api/v1", tags=["stations"])
