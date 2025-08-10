from enum import Enum, StrEnum
from pydantic import BaseModel


class Unit(Enum):
    G = "g"
    KG = "kg"
    ML = "ml"
    L = "l"
    KS = "ks"


class PhysicalForm(StrEnum):
    SOLID = "solid"
    LIQUID = "liquid"
    GAS = "gas"


class Substance(BaseModel):
    name: str
    physical_form: str
    #acute_toxicity: int auto add by properties
    properties: list[dict[str, str]]
    unit: Unit
    # bezpecnostni list


class Record(BaseModel):
    substance: Substance
    amount: int
    location_name: str
    year: int

