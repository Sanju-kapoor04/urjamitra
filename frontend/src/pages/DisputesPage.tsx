import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Bill } from '../types';
import { FileText, Download, Copy, Check, Send } from 'lucide-react';

export const DisputesPage: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedBillId, setSelectedBillId] = useState('');
  const [reason, setReason] = useState('Significant consumption surge despite unchanged electrical load');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [generatedLetter, setGeneratedLetter] = useState<{ subject: string; content: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/bills').then((res) => {
      const bList = res.data.bills || [];
      setBills(bList);
      if (bList.length > 0) setSelectedBillId(bList[0].id);
    });
  }, []);

  const handleGenerate = async () => {
    if (!selectedBillId) return;
    setLoading(true);
    try {
      const res = await api.post('/disputes/generate', {
        billId: selectedBillId,
        reason,
        language
      });
      setGeneratedLetter(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedLetter) return;
    navigator.clipboard.writeText(`${generatedLetter.subject}\n\n${generatedLetter.content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Consumer Dispute Letter Generator</h2>
        <p className="text-sm text-slate-500">Draft legally sound, formal dispute notices for DISCOM billing inaccuracies in English or Hindi.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Select Disputed Bill</label>
            <select
              value={selectedBillId}
              onChange={(e) => setSelectedBillId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {bills.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.billing_period || b.bill_date} (₹{b.net_payable_amount})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English (Official Notice)</option>
              <option value="hi">हिंदी (विद्युत विभाग आवेदन)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Primary Dispute Ground</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Significant consumption surge despite unchanged electrical load">Unusual Consumption Surge</option>
              <option value="Unexplained spike in fixed charges / connected load enhancement">Fixed / Demand Charge Hike</option>
              <option value="Meter reading error or provisional billing calculation">Meter Reading Discrepancy</option>
              <option value="Duplicate surcharge or unadjusted government subsidy">Subsidy / Tariff Adjustment</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !selectedBillId}
          className="w-full py-2.5 bg-[#14243A] text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors shadow-sm disabled:opacity-50"
        >
          {loading ? 'Drafting formal letter...' : 'Generate Formal Dispute Notice'}
        </button>
      </div>

      {generatedLetter && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">{generatedLetter.subject}</h3>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium hover:bg-slate-50 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Notice'}
            </button>
          </div>
          <pre className="text-xs text-slate-700 whitespace-pre-line font-mono bg-slate-50 p-4 rounded-lg border border-slate-200/80 leading-relaxed max-h-96 overflow-y-auto">
            {generatedLetter.content}
          </pre>
          <p className="text-xs text-slate-400 italic">
            Disclaimer: UrjaMitra generates draft notices for consumer convenience. Please verify meter readings before submitting to your DISCOM.
          </p>
        </div>
      )}
    </div>
  );
};
