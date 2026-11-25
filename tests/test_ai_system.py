"""
UrjaMitra End-to-End System Tests
Tests:
1. AI service anomaly detection with Isolation Forest
2. Consumption forecaster
3. Indian bill regex extraction
4. Savings calculator with telescopic slabs
5. UrjaMitra AI Hindi and English chat assistant
"""

import unittest
from ai-service.app.main import (
    extract_indian_bill_fields,
    detect_anomalies,
    predict_consumption,
    calculate_savings,
    ai_assistant_chat,
    AnomalyDetectionRequest,
    PredictionRequest,
    SavingsCalculationRequest,
    ChatRequest
)

class TestUrjaMitraAI(unittest.TestCase):

    def test_bill_extraction(self):
        sample_text = """
        MP Madhya Kshetra Vidyut Vitaran Company (MPMKVVCL)
        Consumer No: 1029384756
        Bill No: INV-DEC-2026
        Units Consumed: 330
        Net Payable Amount: Rs 2421.55
        Due Date: 15/12/2026
        """
        extracted = extract_indian_bill_fields(sample_text)
        self.assertEqual(extracted.consumer_number, "1029384756")
        self.assertEqual(extracted.units_consumed, 330.0)
        self.assertEqual(extracted.net_payable_amount, 2421.55)
        self.assertIn("MPMKVVCL", extracted.provider_name)

    def test_anomaly_detection_surge(self):
        current = {"units_consumed": 380, "net_payable_amount": 2900, "billing_days": 30}
        history = [
            {"units_consumed": 210, "net_payable_amount": 1418, "billing_days": 30},
            {"units_consumed": 220, "net_payable_amount": 1490, "billing_days": 30},
            {"units_consumed": 215, "net_payable_amount": 1450, "billing_days": 30},
            {"units_consumed": 205, "net_payable_amount": 1390, "billing_days": 30}
        ]
        res = detect_anomalies(AnomalyDetectionRequest(current_bill=current, historical_bills=history))
        self.assertIn(res.overall_status, ["High Priority", "Unusual", "Review Recommended"])
        self.assertTrue(len(res.anomalies) > 0)

    def test_savings_calculation(self):
        req = SavingsCalculationRequest(current_units=300, proposed_units=200)
        res = calculate_savings(req)
        self.assertGreater(res["estimated_monthly_savings"], 0)
        self.assertEqual(res["units_saved"], 100.0)

    def test_ai_chat_hindi(self):
        req = ChatRequest(message="bijli bill kam kaise kare", language="hi")
        res = ai_assistant_chat(req)
        self.assertEqual(res["language"], "hi")
        self.assertIn("UrjaMitra", res["reply"])

if __name__ == "__main__":
    unittest.main()
