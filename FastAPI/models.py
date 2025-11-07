from typing import Optional
from pydantic import BaseModel
from substance_properties import Unit, PhysicalForm
from bson import ObjectId

class Substance(BaseModel):
    name: str
    physical_form: PhysicalForm
    properties: list[dict[str, str]]
    unit: Unit
    substance_mixture: str

class Record(BaseModel):
    substance_id: str
    amount: int
    location_name: str
    year: int

class PropertyItem(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    exposure_route: Optional[str] = None

class SubstanceUpdate(BaseModel):
    name: Optional[str] = None
    unit: Optional[str] = None
    iplp: Optional[bool] = None
    disinfection: Optional[bool] = None
    substance_mixture: Optional[str] = None
    physical_form: Optional[str] = None
    properties: Optional[list[PropertyItem]] = None
    # keep your safety_sheet upload as a separate endpoint; this allows
    # sending an URL/path string here if you want to overwrite it explicitly
    safety_sheet: Optional[str] = None