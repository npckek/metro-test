import decimal
import json
import os

from sqlalchemy.exc import IntegrityError

from app.core.db import SessionLocal
from app.models.station import MetroStation


def load_data_from_geojson():
    """Загружает данные из GeoJSON в базу данных."""
    geojson_path = os.path.join(
        os.path.dirname(__file__), "..", "..", "data", "stations.geojson"
    )

    if not os.path.exists(geojson_path):
        print(f"ERROR: GeoJSON file not found at {geojson_path}. Skipping data load.")
        return

    with open(geojson_path, encoding="utf-8") as f:
        data = json.load(f, parse_float=decimal.Decimal)

    db = SessionLocal()
    count = 0

    print("INFO: Starting data loading from GeoJSON...")

    for feature_dict in data.get("features", []):
        props = feature_dict.get("properties", {})
        geom = feature_dict.get("geometry", {})

        if (
            db.query(MetroStation)
            .filter(MetroStation.station_id == props["station_id"])
            .first()
        ):
            continue

        try:
            precise_coordinates = []
            for coord in geom.get("coordinates", []):
                if coord is None:
                    raise ValueError("Coordinate value is None.")
                precise_coordinates.append(coord)
            station = MetroStation(
                station_id=props.get("station_id"),
                station_name=props.get("station_name"),
                transport_type=props.get("transport_type"),
                start_line_id=props.get("start_line_id"),
                entrance_cnt_7=props.get("entrance_cnt_7"),
                entrance_cnt_8=props.get("entrance_cnt_8"),
                entrance_cnt_9=props.get("entrance_cnt_9"),
                entrance_cnt_17=props.get("entrance_cnt_17"),
                entrance_cnt_18=props.get("entrance_cnt_18"),
                entrance_cnt_19=props.get("entrance_cnt_19"),
                exit_cnt_7=props.get("exit_cnt_7"),
                exit_cnt_8=props.get("exit_cnt_8"),
                exit_cnt_9=props.get("exit_cnt_9"),
                exit_cnt_17=props.get("exit_cnt_17"),
                exit_cnt_18=props.get("exit_cnt_18"),
                exit_cnt_19=props.get("exit_cnt_19"),
                geometry_type=geom.get("type"),
                coordinates=precise_coordinates,
            )
            db.add(station)
            db.commit()
            count += 1
        except IntegrityError:
            db.rollback()
            print(
                f"WARNING: Integrity error for station_id {props.get('station_id')}. Skipped."
            )
        except Exception as e:
            db.rollback()
            print(
                f"FATAL ERROR: Failed to process station {props.get('station_name')}. Details: {type(e).__name__}: {e}"
            )

    db.close()
    print(f"INFO: Data loading finished. {count} new stations loaded.")
