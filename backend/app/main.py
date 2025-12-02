from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.db import Base, engine
from app.routers import auth, stations
from app.services.data_loader import load_data_from_geojson
from app.services.user_initializer import create_initial_superuser


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("INFO: Creating database tables...")
    Base.metadata.create_all(bind=engine)

    load_data_from_geojson()

    create_initial_superuser()

    yield


app = FastAPI(lifespan=lifespan, title="Metro API")


origins = [
    "http://localhost:5173",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stations.router, prefix="/api/v1", tags=["stations"])
app.include_router(auth.router, prefix="/api/v1")
