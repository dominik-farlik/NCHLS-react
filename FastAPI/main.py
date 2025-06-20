from fastapi import FastAPI
import psycopg2
from pydantic import BaseModel

app = FastAPI()

conn = psycopg2.connect(
    host="127.0.0.1",
    port=5432,
    database="nchls",
    user="root",
    password="root"
)

def get_records():
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT record_id, s.name AS látka, l.name AS lokace, year AS rok
                FROM records r
                JOIN substances s ON r.substance_id = s.substance_id
                JOIN locations l ON r.location_id = l.location_id;
            """)

            columns = [desc[0] for desc in cursor.description]
            rows = cursor.fetchall()

            results = [dict(zip(columns, row)) for row in rows]

            return results
    except Exception as e:
        print("Chyba při načítání dat:", e)
        conn.rollback()
        raise

class Record(BaseModel):
    substance_name: int
    amount: int
    location_name: int
    year: int

def add_record():
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT record_id, s.name AS látka, l.name AS lokace, year AS rok
                FROM records r
                JOIN substances s ON r.substance_id = s.substance_id
                JOIN locations l ON r.location_id = l.location_id;
            """)

            columns = [desc[0] for desc in cursor.description]
            rows = cursor.fetchall()

            results = [dict(zip(columns, row)) for row in rows]

            return results
    except Exception as e:
        print("Nepodařilo se přidat záznam:", e)
        conn.rollback()
        raise

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/hello/{name}")
async def say_hello(name: str):
    return {"message": f"Hello {name}"}

@app.get("/records")
async def records():
    return {"records": get_records()}

@app.post("/add_record")
async def add_record(record: Record):
    return {
        "substance": record.substance_name,
        "amount": record.amount,
        "location": record.location_name,
        "year": record.year
    }