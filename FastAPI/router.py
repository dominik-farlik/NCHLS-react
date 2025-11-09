from pathlib import Path
from bson import ObjectId
from fastapi import FastAPI, Body, UploadFile, File, HTTPException, APIRouter, Query
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse, FileResponse
import shutil
import logging
from bson.json_util import dumps
import json
import os

from models import Record, Substance
from db import insert_record, insert_substance, add_safety_sheet, fetch_substances, \
    fetch_records, fetch_departments, db_update_substance, fetch_substance
from property_dicts import Unit, PROPERTIES, PhysicalForm

app = FastAPI()
api = APIRouter(prefix="/api")

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("/app/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


# --------------------------
# Health
# --------------------------
@api.get("")
async def read_root():
    return {"message": "FastAPI is running!"}


# --------------------------
# Dictionaries / lists
# --------------------------
@api.get("/units")
async def get_units():
    return [value.value for value in Unit]


@api.get("/properties")
async def get_properties():
    return PROPERTIES


@api.get("/physical_forms")
async def get_physical_forms():
    return [value.value for value in PhysicalForm]


@api.get("/departments")
async def get_departments():
    cursor = fetch_departments()
    return JSONResponse(content=json.loads(dumps(cursor)))


@api.get("/categories/{prop}")
async def get_categories(prop: str):
    if prop not in PROPERTIES:
        raise HTTPException(status_code=404, detail=f"Property '{prop}' not found")
    return sorted(list(PROPERTIES[prop].get("categories", [])))


@api.get("/exposure_routes/{prop}")
async def get_exposure_routes(prop: str):
    if prop not in PROPERTIES:
        raise HTTPException(status_code=404, detail=f"Property '{prop}' not found")
    return sorted(list(PROPERTIES[prop].get("exposure_routes", [])))


# --------------------------
# Substances
# --------------------------
@api.get("/substances")
async def list_substances():
    cursor = fetch_substances()
    return JSONResponse(content=json.loads(dumps(cursor)))


@api.get("/substances/{substance_id}")
async def get_substance(substance_id: str):
    if not ObjectId.is_valid(substance_id):
        raise HTTPException(status_code=400, detail="Neplatné ID látky.")
    doc = fetch_substance(substance_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Látka nenalezena.")
    doc["id"] = str(doc.pop("_id"))
    return doc


@api.post("/substances")
async def add_substance(substance: Substance = Body(...)):
    logger.info(f"Adding substance {substance}")
    inserted_id = insert_substance(substance.model_dump())
    return {"id": str(inserted_id)}


@api.put("/substances")
async def update_substance(substance: Substance = Body(...)):
    db_update_substance(substance)

# --------------------------
# Records
# --------------------------
@api.get("/records")
async def list_records(department_name: str | None = Query(default=None)):
    filter_ = {"location_name": department_name}
    cursor = fetch_records(filter_)
    return json.loads(dumps(list(cursor)))


@api.post("/records")
async def add_record(record: Record = Body(...)):
    logger.info(f"Adding record {record}")
    inserted_id = insert_record(record.model_dump())
    return {"inserted_id": str(inserted_id)}


# Finally, register the router
app.include_router(api)
