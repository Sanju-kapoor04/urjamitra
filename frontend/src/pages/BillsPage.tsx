import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Bill } from '../types';
import { Receipt, Search, Filter, Trash2, Eye } from 'lucide-react';

export const BillsPage: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await api.get('/bills');
      setBills(res.data.bills || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bill record?')) return;
    try {
      await api.delete(`/bills/${id}`);
      setBills(bills.filter(b => b.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBills = bills.filter(b => {
    const matchesSearch = b.provider_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (b.consumer_number && b.consumer_number.includes(searchTerm));
    const matchesFilter = filterType === 'all' || b.utility_type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Utility Bill History</h2>
          <p className="text-sm text-slate-500">Track and filter all archived electricity, water, and broadband records.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by DISCOM or consumer number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Utilities</option>
          <option value="electricity">Electricity</option>
          <option value="water">Water</option>
          <option value="internet">Internet</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Provider</th>
              <th className="px-6 py-3">Consumer No</th>
              <th className="px-6 py-3">Period / Date</th>
              <th className="px-6 py-3">Consumption</th>
              <th className="px-6 py-3">Net Amount</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredBills.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 font-semibold text-slate-900">{b.provider_name}</td>
                <td className="px-6 py-4">{b.consumer_number || 'N/A'}</td>
                <td className="px-6 py-4">{b.billing_period || b.bill_date}</td>
                <td className="px-6 py-4">{b.units_consumed} {b.utility_type === 'water' ? 'KL' : 'kWh'}</td>
                <td className="px-6 py-4 font-bold text-slate-900">₹{b.net_payable_amount.toFixed(2)}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
