"""Scikit-Learn Isolation Forest and Statistical Anomaly Detection Engine"""
from typing import List, Dict, Any
import numpy as np
from sklearn.ensemble import IsolationForest
from app.schemas.schemas import AnomalyItem, AnomalyDetectionRequest, AnomalyDetectionResponse

def detect_bill_anomalies(req: AnomalyDetectionRequest) -> AnomalyDetectionResponse:
    current = req.current_bill
    history = req.historical_bills

    cur_units = float(current.get("units_consumed") or current.get("units") or 0.0)
    cur_amount = float(current.get("net_payable_amount") or current.get("amount") or 0.0)
    cur_days = int(current.get("billing_days") or 30)
    cur_daily_units = cur_units / max(1, cur_days)
    cur_fixed = float(current.get("fixed_charges") or 0.0)
    cur_effective_rate = cur_amount / max(1.0, cur_units) if cur_units > 0 else 0.0

    anomalies: List[AnomalyItem] = []
    insights: List[str] = []
    anomaly_score = 0.0
    model_used = "Rule-based & Statistical Baseline"

    if len(history) >= 4:
        # Build features for IsolationForest: [units, amount, daily_units, effective_rate]
        feature_rows = []
        for b in history:
            u = float(b.get("units_consumed") or b.get("units") or 0.0)
            a = float(b.get("net_payable_amount") or b.get("amount") or 0.0)
            d = int(b.get("billing_days") or 30)
            du = u / max(1, d)
            er = a / max(1.0, u) if u > 0 else 0.0
            feature_rows.append([u, a, du, er])

        X = np.array(feature_rows)
        iso = IsolationForest(contamination=0.15, random_state=42)
        iso.fit(X)
        current_feature = np.array([[cur_units, cur_amount, cur_daily_units, cur_effective_rate]])
        pred = iso.predict(current_feature) # -1 is anomaly, 1 is normal
        score = iso.decision_function(current_feature)[0]
        anomaly_score = round(float(-score), 3) # higher means more anomalous
        model_used = "Scikit-Learn IsolationForest + Statistical Verifier"

        if pred[0] == -1:
            insights.append("UrjaMitra IsolationForest flagged multidimensional shift across consumption and unit cost.")

    # Historical statistical checks
    if history:
        past_units = [float(b.get("units_consumed") or b.get("units") or 0.0) for b in history if float(b.get("units_consumed") or b.get("units") or 0.0) > 0]
        past_amounts = [float(b.get("net_payable_amount") or b.get("amount") or 0.0) for b in history]
        past_fixed = [float(b.get("fixed_charges") or 0.0) for b in history if float(b.get("fixed_charges") or 0.0) > 0]

        avg_units = np.mean(past_units) if past_units else cur_units
        avg_amount = np.mean(past_amounts) if past_amounts else cur_amount
        avg_fixed = np.mean(past_fixed) if past_fixed else cur_fixed

        # 1. Consumption surge check
        if cur_units > 0 and avg_units > 0:
            units_diff_pct = ((cur_units - avg_units) / avg_units) * 100
            if units_diff_pct >= 40:
                severity = "High Priority" if units_diff_pct >= 75 else "Unusual"
                anomalies.append(AnomalyItem(
                    anomaly_type="High Consumption Surge",
                    severity=severity,
                    affected_field="units_consumed",
                    observed_value=f"{cur_units:.1f} kWh",
                    expected_or_reference=f"{avg_units:.1f} kWh (hist. avg)",
                    reason=f"Units consumed jumped {units_diff_pct:.1f}% compared to your historical baseline.",
                    recommended_verification="Check for high-wattage seasonal appliances (AC/geysers), meter reading verification, or earth-leakage."
                ))
            elif units_diff_pct <= -50:
                anomalies.append(AnomalyItem(
                    anomaly_type="Sharp Drop in Consumption",
                    severity="Review Recommended",
                    affected_field="units_consumed",
                    observed_value=f"{cur_units:.1f} kWh",
                    expected_or_reference=f"{avg_units:.1f} kWh",
                    reason=f"Recorded units dropped {abs(units_diff_pct):.1f}%. May indicate unoccupied premises or provisional meter reading.",
                    recommended_verification="Confirm if meter reader had access to physical meter or marked provisional billing."
                ))

        # 2. Fixed charges discrepancy
        if past_fixed and cur_fixed > 0:
            fixed_diff = cur_fixed - avg_fixed
            if fixed_diff > 25:
                anomalies.append(AnomalyItem(
                    anomaly_type="Unusual Fixed Charges Spike",
                    severity="Review Recommended",
                    affected_field="fixed_charges",
                    observed_value=f"₹{cur_fixed:.2f}",
                    expected_or_reference=f"₹{avg_fixed:.2f}",
                    reason=f"Fixed charge increased by ₹{fixed_diff:.2f}. Could indicate sanctioned load reassessment by DISCOM.",
                    recommended_verification="Check your sanctioned load (kW) on the bill header to see if connected load was automatically enhanced."
                ))

        # 3. Bill Amount per unit spike
        past_rates = [a / max(1.0, u) for a, u in zip(past_amounts, past_units) if u > 0]
        avg_rate = np.mean(past_rates) if past_rates else cur_effective_rate
        if cur_effective_rate > 0 and avg_rate > 0:
            rate_diff_pct = ((cur_effective_rate - avg_rate) / avg_rate) * 100
            if rate_diff_pct >= 30:
                anomalies.append(AnomalyItem(
                    anomaly_type="Tariff / Additional Levy Hike",
                    severity="Unusual",
                    affected_field="effective_rate",
                    observed_value=f"₹{cur_effective_rate:.2f}/kWh",
                    expected_or_reference=f"₹{avg_rate:.2f}/kWh",
                    reason=f"Effective cost per unit spiked by {rate_diff_pct:.1f}% due to higher tariff slab, FPPCA surcharge, or uncredited subsidy.",
                    recommended_verification="Inspect Fuel Surcharge (FPPCA) and State Electricity Duty line items."
                ))
    else:
        if cur_units > 400:
            anomalies.append(AnomalyItem(
                anomaly_type="High Consumption Tier",
                severity="Review Recommended",
                affected_field="units_consumed",
                observed_value=f"{cur_units:.1f} kWh",
                expected_or_reference="< 300 kWh",
                reason="Usage exceeds domestic tier 2 slab, triggering the highest Indian tariff slab (₹7.00+/unit).",
                recommended_verification="Review energy-intensive appliances or inspect meter recording."
            ))

    severities = [a.severity for a in anomalies]
    if "High Priority" in severities:
        overall_status = "High Priority"
    elif "Unusual" in severities:
        overall_status = "Unusual"
    elif "Review Recommended" in severities:
        overall_status = "Review Recommended"
    else:
        overall_status = "Normal"
        insights.append("All bill metrics align within standard Indian utility parameters.")

    return AnomalyDetectionResponse(
        overall_status=overall_status,
        anomaly_score=anomaly_score,
        model_used=model_used,
        anomalies=anomalies,
        insights=insights
    )
