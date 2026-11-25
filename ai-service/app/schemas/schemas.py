"""Pydantic schemas for UrjaMitra AI Service"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ExtractedBillData(BaseModel):
    utility_type: str = "electricity" # electricity, water, internet
    provider_name: Optional[str] = None
    consumer_number: Optional[str] = None
    bill_number: Optional[str] = None
    meter_number: Optional[str] = None
    billing_period: Optional[str] = None
    previous_reading: Optional[float] = None
    current_reading: Optional[float] = None
    units_consumed: Optional[float] = None
    billing_days: Optional[int] = 30
    energy_charges: Optional[float] = None
    fixed_charges: Optional[float] = None
    taxes_and_duties: Optional[float] = None
    additional_charges: Optional[float] = None
    fppca_charges: Optional[float] = None
    arrears: Optional[float] = None
    subsidies: Optional[float] = None
    rebates: Optional[float] = None
    net_payable_amount: Optional[float] = None
    due_date: Optional[str] = None
    bill_date: Optional[str] = None
    confidence_score: float = 0.85
    extracted_text_snippet: Optional[str] = None

class AnomalyItem(BaseModel):
    anomaly_type: str
    severity: str # "Normal", "Review Recommended", "Unusual", "High Priority"
    affected_field: str
    observed_value: Any
    expected_or_reference: Any
    reason: str
    recommended_verification: str

class AnomalyDetectionRequest(BaseModel):
    current_bill: Dict[str, Any]
    historical_bills: List[Dict[str, Any]] = []

class AnomalyDetectionResponse(BaseModel):
    overall_status: str # "Normal", "Review Recommended", "Unusual", "High Priority"
    anomaly_score: float
    model_used: str
    anomalies: List[AnomalyItem]
    insights: List[str]

class PredictionRequest(BaseModel):
    historical_consumption: List[Dict[str, Any]] # list of { month, units, amount, days }
    forecast_months: int = 1
    current_season: Optional[str] = "moderate" # summer, winter, monsoon, moderate

class PredictionResponse(BaseModel):
    predicted_units: float
    predicted_amount_estimate: float
    lower_bound_units: float
    upper_bound_units: float
    model_type: str
    confidence_level: str
    notes: List[str]

class TariffSlab(BaseModel):
    min_units: float
    max_units: Optional[float] = None
    rate_per_unit: float

class SavingsCalculationRequest(BaseModel):
    utility_type: str = "electricity"
    current_units: float
    proposed_units: float
    slabs: Optional[List[TariffSlab]] = None
    fixed_charge: float = 80.0
    duty_percent: float = 9.0

class ChatRequest(BaseModel):
    message: str
    language: str = "en" # "en" or "hi"
    current_bill: Optional[Dict[str, Any]] = None
    historical_bills: Optional[List[Dict[str, Any]]] = None
