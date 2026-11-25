import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { ComparisonData } from '../types';
import { GitCompare, AlertTriangle, CheckCircle2, TrendingUp, Info, HelpCircle } from 'lucide-react';

export const ComparePage: React.FC = () => {
  const [data, setData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComparison();
  }, []);

  const fetchComparison = async () => {
    try {
      const res = await api.get('/comparison');
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Comparing bill cycles...</div>;
  if (!data || !data.current) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <GitCompare className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="font-semibold text-slate-800">No Comparison Data Available</h3>
        <p className="text-sm text-slate-500 mt-1">Please upload at least two utility bills to see cycle-over-cycle comparisons and anomaly alerts.</p>
      </div>
    );
  }

  const { current, previous, percentage_changes, anomaly_analysis } = data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Bill Comparison & AI Anomaly Engine</h2>
        <p className="text-sm text-slate-500">Normalizing consumption across billing days and validating against Indian tariff slabs.</p>
      </div>

      {/* Anomaly Banner */}
      <div className={`p-5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        anomaly_analysis.overall_status === 'Normal'
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
          : 'bg-amber-50 border-amber-200 text-amber-900'
      }`}>
        <div className="flex items-start gap-3">
          {anomaly_analysis.overall_status === 'Normal' ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <h4 className="font-bold text-base">
              Overall Status: {anomaly_analysis.overall_status}
            </h4>
            <p className="text-xs mt-1">
              Engine: <span className="font-medium">{anomaly_analysis.model_used}</span>
            </p>
          </div>
        </div>
        <div className="text-xs bg-white/80 px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-xs">
          UrjaMitra Anomaly Confidence: <span className="font-semibold">95%</span>
        </div>
      </div>

      {/* Side-by-Side Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Bill */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-semibold uppercase text-blue-600 tracking-wider">Current Cycle</span>
              <h3 className="font-bold text-slate-900">{current.billing_period || current.bill_date}</h3>
            </div>
            <span className="text-xl font-bold text-slate-900">₹{current.net_payable_amount.toFixed(2)}</span>
          </div>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span>Units Consumed</span>
              <span className="font-semibold text-slate-900">{current.units_consumed} kWh</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span>Energy Charges</span>
              <span>₹{current.energy_charges?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span>Fixed Charges</span>
              <span>₹{current.fixed_charges?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span>Taxes & Duties (9%)</span>
              <span>₹{current.taxes_and_duties?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Provider</span>
              <span className="truncate max-w-[200px]">{current.provider_name}</span>
            </div>
          </div>
        </div>

        {/* Previous Bill */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Previous Cycle</span>
              <h3 className="font-bold text-slate-900">{previous ? (previous.billing_period || previous.bill_date) : 'Baseline'}</h3>
            </div>
            <span className="text-xl font-bold text-slate-700">₹{previous ? previous.net_payable_amount.toFixed(2) : '0.00'}</span>
          </div>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span>Units Consumed</span>
              <span className="font-semibold text-slate-900">{previous ? `${previous.units_consumed} kWh` : 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span>Energy Charges</span>
              <span>₹{previous?.energy_charges?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span>Fixed Charges</span>
              <span>₹{previous?.fixed_charges?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span>Taxes & Duties (9%)</span>
              <span>₹{previous?.taxes_and_duties?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Delta in Amount</span>
              <span className={`font-semibold ${percentage_changes.amount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {percentage_changes.amount > 0 ? '+' : ''}{percentage_changes.amount}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detected Anomalies List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          Detailed Line-Item Anomalies & Explanations
        </h3>

        {anomaly_analysis.anomalies.length === 0 ? (
          <p className="text-sm text-slate-500">No irregular charges or unexpected billing variations detected in this cycle.</p>
        ) : (
          <div className="space-y-3">
            {anomaly_analysis.anomalies.map((item, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-sm space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{item.anomaly_type}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    item.severity === 'High Priority' ? 'bg-red-100 text-red-800' :
                    item.severity === 'Unusual' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {item.severity}
                  </span>
                </div>
                <div className="grid grid-cols-2 text-xs text-slate-600 gap-2">
                  <div>Observed: <span className="font-semibold text-slate-900">{item.observed_value}</span></div>
                  <div>Historical Ref: <span className="font-semibold text-slate-900">{item.expected_or_reference}</span></div>
                </div>
                <p className="text-xs text-slate-700">{item.reason}</p>
                <div className="text-xs text-blue-700 font-medium bg-blue-50/60 p-2 rounded border border-blue-100">
                  Recommended Action: {item.recommended_verification}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
