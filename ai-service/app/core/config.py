"""Standard Indian utility constants and default telescopic slabs"""
from typing import List
from app.schemas.schemas import TariffSlab

DEFAULT_DOMESTIC_SLABS = [
    TariffSlab(min_units=0, max_units=50, rate_per_unit=4.15),
    TariffSlab(min_units=51, max_units=150, rate_per_unit=5.05),
    TariffSlab(min_units=151, max_units=300, rate_per_unit=6.45),
    TariffSlab(min_units=301, max_units=None, rate_per_unit=7.10)
]

INDIAN_DISCOMS = [
    "MP Madhya Kshetra Vidyut Vitaran Company (MPMKVVCL)",
    "MP Poorv Kshetra Vidyut Vitaran Company (MPPKVVCL)",
    "MP Paschim Kshetra Vidyut Vitaran Company (MPPKVVCL West)",
    "BSES Rajdhani Power Limited (BRPL)",
    "BSES Yamuna Power Limited (BYPL)",
    "Tata Power Delhi Distribution Limited (TPDDL)",
    "Maharashtra State Electricity Distribution Co Ltd (MSEDCL)",
    "Uttar Pradesh Power Corporation Limited (UPPCL)",
    "Bangalore Electricity Supply Company (BESCOM)",
    "Tamil Nadu Generation and Distribution Corporation (TANGEDCO)",
    "Airtel Broadband",
    "JioFiber Broadband",
    "Delhi Jal Board",
    "Municipal Corporation Water Supply"
]

def calculate_slab_energy_charges(units: float, slabs: List[TariffSlab]) -> float:
    remaining = max(0.0, float(units))
    total_cost = 0.0
    for slab in slabs:
        if remaining <= 0:
            break
        slab_capacity = (slab.max_units - slab.min_units + 1) if slab.max_units is not None else remaining
        units_in_slab = min(remaining, slab_capacity)
        total_cost += units_in_slab * slab.rate_per_unit
        remaining -= units_in_slab
    return round(total_cost, 2)
