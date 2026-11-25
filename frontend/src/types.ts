export interface User {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  state: string;
  city: string;
  pinCode: string;
}

export interface Bill {
  id: string;
  user_id: string;
  utility_type: 'electricity' | 'water' | 'internet';
  provider_name: string;
  consumer_number?: string;
  bill_number?: string;
  meter_number?: string;
  billing_period?: string;
  previous_reading?: number;
  current_reading?: number;
  units_consumed: number;
  billing_days: number;
  energy_charges?: number;
  fixed_charges?: number;
  taxes_and_duties?: number;
  net_payable_amount: number;
  due_date?: string;
  bill_date?: string;
  confidence_score?: number;
  created_at: string;
}

export interface AnomalyItem {
  anomaly_type: string;
  severity: 'Normal' | 'Review Recommended' | 'Unusual' | 'High Priority';
  affected_field: string;
  observed_value: string;
  expected_or_reference: string;
  reason: string;
  recommended_verification: string;
}

export interface ComparisonData {
  current: Bill;
  previous: Bill | null;
  percentage_changes: {
    amount: number;
    units: number;
    energy_charges: number;
  };
  anomaly_analysis: {
    overall_status: string;
    anomaly_score: number;
    model_used: string;
    anomalies: AnomalyItem[];
    insights: string[];
  };
}
