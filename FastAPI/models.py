from pydantic import BaseModel

class Record(BaseModel):
    substance_name: str
    amount: int
    location_name: str
    year: int