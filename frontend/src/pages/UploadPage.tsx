import React, { useState } from 'react';
import api from '../services/api';
import { UploadCloud, CheckCircle2, AlertCircle, FileText, ArrowRight } from 'lucide-react';

export const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [utilityType, setUtilityType] = useState('electricity');
  const [providerName, setProviderName] = useState('MP Madhya Kshetra Vidyut Vitaran Company (MPMKVVCL)');
  const [consumerNumber, setConsumerNumber] = useState('');
  const [unitsConsumed, setUnitsConsumed] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const formData = new FormData();
      if (file) formData.append('billFile', file);
      formData.append('utility_type', utilityType);
      formData.append('provider_name', providerName);
      if (consumerNumber) formData.append('consumer_number', consumerNumber);
      if (unitsConsumed) formData.append('units_consumed', unitsConsumed);
      if (amount) formData.append('net_payable_amount', amount);

      const res = await api.post('/bills/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccessMsg(`Bill successfully analyzed and added! Extracted ID: ${res.data.bill.id}`);
      setFile(null);
      setUnitsConsumed('');
      setAmount('');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to process bill. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Upload Utility Bill</h2>
        <p className="text-sm text-slate-500">Upload your PDF or Image bill. UrjaMitra AI will extract line items, calculate slab tiers, and check for anomalies.</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800 text-sm">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleUpload} className="bg-white p-6 md:p-8 rounded-xl border border-slate-200/80 shadow-sm space-y-6">
        {/* Utility Type Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Utility Category</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'electricity', label: 'Electricity (kWh)' },
              { id: 'water', label: 'Water (KL)' },
              { id: 'internet', label: 'Broadband / ISP' }
            ].map((cat) => (
              <button
                type="button"
                key={cat.id}
                onClick={() => setUtilityType(cat.id)}
                className={`py-2.5 px-4 rounded-lg text-sm font-medium border text-center transition-all ${
                  utilityType === cat.id
                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Select Bill File (PDF / JPG / PNG)</label>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors bg-slate-50/50">
            <input
              type="file"
              id="billFile"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
            />
            <label htmlFor="billFile" className="cursor-pointer flex flex-col items-center">
              <UploadCloud className="w-10 h-10 text-blue-600 mb-2" />
              <span className="text-sm font-semibold text-slate-700">
                {file ? file.name : 'Click to select bill or drag document here'}
              </span>
              <span className="text-xs text-slate-500 mt-1">PDF or image file up to 10MB</span>
            </label>
          </div>
        </div>

        {/* Provider Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">DISCOM / Service Provider</label>
            <select
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="MP Madhya Kshetra Vidyut Vitaran Company (MPMKVVCL)">MPMKVVCL (Madhya Kshetra)</option>
              <option value="MP Poorv Kshetra Vidyut Vitaran Company (MPPKVVCL)">MPPKVVCL (Poorv Kshetra)</option>
              <option value="BSES Rajdhani Power Limited (BRPL)">BSES Rajdhani Power Limited (Delhi)</option>
              <option value="Tata Power Delhi Distribution Limited (TPDDL)">Tata Power Delhi (TPDDL)</option>
              <option value="Maharashtra State Electricity (MSEDCL)">MSEDCL (Maharashtra)</option>
              <option value="Bangalore Electricity Supply (BESCOM)">BESCOM (Bangalore)</option>
              <option value="Delhi Jal Board">Delhi Jal Board (Water)</option>
              <option value="Airtel / JioFiber Broadband">Airtel / JioFiber (Internet)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Consumer / CA Number</label>
            <input
              type="text"
              placeholder="e.g. 1029384756"
              value={consumerNumber}
              onChange={(e) => setConsumerNumber(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Manual Fallback / Direct Entry for accuracy */}
        <div className="border-t border-slate-200 pt-4">
          <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider mb-3">Verification & Direct Field Overrides (Optional)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-600 mb-1">Units Consumed (kWh / KL / GB)</label>
              <input
                type="number"
                placeholder="Auto-extracted or enter units (e.g. 260)"
                value={unitsConsumed}
                onChange={(e) => setUnitsConsumed(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Net Payable Amount (₹)</label>
              <input
                type="number"
                placeholder="Auto-extracted or enter total ₹ (e.g. 1750)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-[#14243A] hover:bg-slate-900 text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
        >
          {loading ? 'Processing via UrjaMitra OCR & AI...' : 'Analyze & Save Bill'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
