import React, { useState } from 'react';
import api from '../services/api';
import { Calculator, Zap, IndianRupee, TrendingDown, Sun } from 'lucide-react';

export const SavingsPage: React.FC = () => {
  const [currentUnits, setCurrentUnits] = useState(280);
  const [proposedUnits, setProposedUnits] = useState(210);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    setLoading(true);
    try {
      const res = await api.post('/savings/calculate', {
        current_units: currentUnits,
        proposed_units: proposedUnits
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Slab-Wise Utility Savings Calculator</h2>
        <p className="text-sm text-slate-500">Calculate realistic monthly and annual savings using verified Indian telescopic tariff slabs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="font-semibold text-slate-900">Simulate Consumption Reduction</h3>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600">Current Monthly Consumption:</span>
              <span className="font-bold text-slate-900">{currentUnits} kWh</span>
            </div>
            <input
              type="range"
              min="50"
              max="600"
              step="5"
              value={currentUnits}
              onChange={(e) => setCurrentUnits(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-600">Proposed / Target Consumption:</span>
              <span className="font-bold text-emerald-600">{proposedUnits} kWh</span>
            </div>
            <input
              type="range"
              min="50"
              max={currentUnits}
              step="5"
              value={proposedUnits}
              onChange={(e) => setProposedUnits(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
          </div>

          <button
            onClick={calculate}
            disabled={loading}
            className="w-full py-2.5 bg-[#14243A] text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors shadow-sm"
          >
            {loading ? 'Calculating...' : 'Run Slab Savings Simulation'}
          </button>
        </div>

        {/* Results Banner */}
        <div className="bg-gradient-to-br from-blue-900 to-[#14243A] text-white p-6 rounded-xl shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-teal-300 font-semibold">Simulated Potential</span>
            <div className="mt-3">
              <div className="text-3xl font-extrabold text-white">
                ₹{result ? result.estimated_monthly_savings : '450.00'}{' '}
                <span className="text-sm font-normal text-slate-300">/ month</span>
              </div>
              <div className="text-sm text-teal-300 mt-1">
                ≈ ₹{result ? result.estimated_annual_savings : '5,400.00'} / year estimated savings
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700/60 space-y-2 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>Units Trimmed:</span>
              <span className="font-semibold text-white">{currentUnits - proposedUnits} kWh</span>
            </div>
            <div className="flex justify-between">
              <span>Top Marginal Slab Rate:</span>
              <span className="font-semibold text-white">₹6.45 / unit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Solar Rooftop Advisor */}
      <div className="bg-amber-50/70 border border-amber-200 p-5 rounded-xl flex items-start gap-3">
        <Sun className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm text-amber-900">PM Surya Ghar: Muft Bijli Yojana Compatibility</h4>
          <p className="text-xs text-amber-800 mt-1 leading-relaxed">
            With a consumption of {currentUnits} units/month, installing a 2 kW rooftop solar system provides up to 240 units/month through net metering, virtually bringing your electricity bills to zero while receiving government capital subsidy under central schemes.
          </p>
        </div>
      </div>
    </div>
  );
};
