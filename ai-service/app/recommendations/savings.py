"""Deterministic Slab Savings Calculator and Solar Advisor"""
from typing import Dict, Any
from app.schemas.schemas import SavingsCalculationRequest
from app.core.config import DEFAULT_DOMESTIC_SLABS, calculate_slab_energy_charges

def compute_tariff_savings(req: SavingsCalculationRequest) -> Dict[str, Any]:
    slabs = req.slabs or DEFAULT_DOMESTIC_SLABS
    current_energy = calculate_slab_energy_charges(req.current_units, slabs)
    current_duty = round(current_energy * (req.duty_percent / 100.0), 2)
    current_total = round(current_energy + req.fixed_charge + current_duty, 2)

    proposed_energy = calculate_slab_energy_charges(req.proposed_units, slabs)
    proposed_duty = round(proposed_energy * (req.duty_percent / 100.0), 2)
    proposed_total = round(proposed_energy + req.fixed_charge + proposed_duty, 2)

    monthly_savings = max(0.0, round(current_total - proposed_total, 2))
    annual_savings = round(monthly_savings * 12, 2)

    marginal_unit_rate = slabs[-1].rate_per_unit if req.current_units > 300 else slabs[1].rate_per_unit

    return {
        "current_units": req.current_units,
        "proposed_units": req.proposed_units,
        "units_saved": max(0.0, round(req.current_units - req.proposed_units, 1)),
        "current_bill_estimate": current_total,
        "proposed_bill_estimate": proposed_total,
        "estimated_monthly_savings": monthly_savings,
        "estimated_annual_savings": annual_savings,
        "marginal_unit_rate": marginal_unit_rate,
        "breakdown": {
            "current_energy_charges": current_energy,
            "proposed_energy_charges": proposed_energy,
            "fixed_charge": req.fixed_charge,
            "duty_savings": round(current_duty - proposed_duty, 2)
        },
        "tips": [
            "Shifting consumption down past a slab boundary (e.g. from 305 to 295 kWh) saves at the highest applicable slab rate.",
            "Solar rooftop installation (PM Surya Ghar) can offset daytime units at 100% net metering rate."
        ]
    }
