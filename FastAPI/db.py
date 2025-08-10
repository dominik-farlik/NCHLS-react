from pymongo import MongoClient
import os

MONGO_USER = os.getenv("MONGO_USER", "admin")
MONGO_PASSWORD = os.getenv("MONGO_PASSWORD", "secret")
MONGO_HOST = os.getenv("MONGO_HOST", "mongodb")
MONGO_PORT = os.getenv("MONGO_PORT", "27017")

# Create MongoDB client and choose a database
client = MongoClient(f"mongodb://{MONGO_USER}:{MONGO_PASSWORD}@{MONGO_HOST}:{MONGO_PORT}")
db = client.nchls

def insert_record(record_data: dict):
    """Insert a record into the collection and return inserted ID."""
    result = db.records.insert_one(record_data)
    return result.inserted_id
