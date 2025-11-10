from pydantic import BaseModel


class Record(BaseModel):
    substance_id: str
    amount: float
    location_name: str
    year: int