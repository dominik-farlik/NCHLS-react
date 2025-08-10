from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from models import Record
from db import insert_record
import logging

app = FastAPI()
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "FastAPI is running!"}

@app.post("/add_record")
def add_record(record: Record = Body(...)):
    logger.info(f"Adding record {record}")
    inserted_id = insert_record(record.model_dump())
    return {"inserted_id": str(inserted_id)}
