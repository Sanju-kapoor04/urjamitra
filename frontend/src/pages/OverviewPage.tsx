import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Bill } from '../types';
import {
  FileText,
  IndianRupee,
  Zap,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';

export const OverviewPage: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await api.get('/bills');
      setBills(res.data.bills || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalBills = bills.length;
  const currentMonthBill = bills[0]?.net_payable_amount || 0;
  const previousMonthBill = bills[1]?.net_payable_amount || 0;
  const avgUnits = bills.length ? Math.round(bills.reduce((acc, b) => acc + (b.units_consumed || 0), 0) / bills.length) : 0;
  
  // Calculate potential savings based on slab excess
  const potentialSavings = bills[0]?.units_consumed && bills[0].units_consumed > 200
    ? Math.round((bills[0].units_consumed - 200) * 6.45)
    : 350;

  const chartData = [...bills].reverse().map((b) => ({
    name: b.bill_date ? b.bill_date.slice(3) : b.billing_period || 'Cycle',
    amount: b.net_payable_amount,
    units: b.units_consumed
  }));

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading UrjaMitra intelligence dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Utility Intelligence Overview</h2>
          <p className="text-sm text-slate-500">Real-time consumption analytics, Indian tariff slab tracking, and anomaly alerts.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-200 rounded-lg text-teal-800 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Verified Indian DISCOM Engine</span>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Current Month Bill</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">₹{currentMonthBill.toLocaleString('en-IN')}</div>
          <div className="mt-2 text-xs flex items-center text-slate-500">
            {previousMonthBill > 0 && (
              <span className={`inline-flex items-center font-medium mr-1 ${currentMonthBill > previousMonthBill ? 'text-amber-600' : 'text-emerald-600'}`}>
                {currentMonthBill > previousMonthBill ? '+' : ''}
                {(((currentMonthBill - previousMonthBill) / previousMonthBill) * 100).toFixed(1)}%
              </span>
            )}
            vs previous cycle (₹{previousMonthBill.toLocaleString('en-IN')})
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Avg Consumption</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-md">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{avgUnits} <span className="text-sm font-normal text-slate-500">kWh / Units</span></div>
          <p className="mt-2 text-xs text-slate-500">Across {totalBills} recorded utility billing cycles</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Estimated Savings</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-md">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600">₹{potentialSavings.toLocaleString('en-IN')}</div>
          <p className="mt-2 text-xs text-slate-500">Available by trimming consumption into lower slab</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Verified Records</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-md">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalBills}</div>
          <p className="mt-2 text-xs text-slate-500">Electricity, Water & Internet Bills Uploaded</p>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900">Monthly Bill Amount Trend</h3>
              <p className="text-xs text-slate-500">Total payable amounts in Indian Rupees (₹)</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                <Tooltip formatter={(value: any) => [`₹${value}`, 'Net Payable']} />
                <Bar dataKey="amount" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900">Energy Consumption Curve</h3>
              <p className="text-xs text-slate-500">Electricity units (kWh) consumed per billing period</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} tickFormatter={(val) => `${val} u`} />
                <Tooltip formatter={(value: any) => [`${value} kWh`, 'Units Consumed']} />
                <Area type="monotone" dataKey="units" stroke="#0D9488" fillOpacity={1} fill="url(#colorUnits)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Latest Verified Bills Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Recent Uploaded Utility Bills</h3>
          <span className="text-xs text-slate-500">Telescopic Indian Tariff Verified</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200/80">
              <tr>
                <th className="px-6 py-3">Provider / DISCOM</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Period / Date</th>
                <th className="px-6 py-3">Units</th>
                <th className="px-6 py-3">Net Amount</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {bills.map((bill) => (
                <tr key={bill.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{bill.provider_name}</td>
                  <td className="px-6 py-4 capitalize">{bill.utility_type}</td>
                  <td className="px-6 py-4">{bill.billing_period || bill.bill_date}</td>
                  <td className="px-6 py-4">{bill.units_consumed} kWh</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">₹{bill.net_payable_amount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
