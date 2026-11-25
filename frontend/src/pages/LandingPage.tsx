import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, TrendingDown, BrainCircuit, CheckCircle2, ArrowRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-800 flex flex-col">
      {/* Navigation Bar */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#14243A] rounded-lg text-white">
              <Zap className="w-5 h-5 text-teal-400" />
            </div>
            <span className="text-xl font-extrabold text-slate-900">UrjaMitra</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold text-white bg-[#14243A] hover:bg-slate-900 px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-6 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>UrjaMitra – Your Smart Utility Companion.</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Your Utility Bills, <span className="text-blue-600">Finally Understood.</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
          Analyze your electricity, water and internet bills. Discover unusual charges, understand consumption, and find smarter ways to save.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            Analyze My Bill
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold rounded-xl transition-all"
          >
            Demo Sign In
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-12 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="p-3 bg-blue-100 text-blue-700 w-fit rounded-lg">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">AI Anomaly Detection</h3>
              <p className="text-sm text-slate-600">
                Isolation Forest and statistical detectors identify sudden consumption surges, fixed charge spikes, and uncredited subsidies.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="p-3 bg-teal-100 text-teal-700 w-fit rounded-lg">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Telescopic Slab Calculator</h3>
              <p className="text-sm text-slate-600">
                Calculates tiered rates across Indian DISCOM orders (MPMKVVCL, BSES, TPDDL, MSEDCL) with FPPCA and duty breakdown.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="p-3 bg-amber-100 text-amber-700 w-fit rounded-lg">
                <TrendingDown className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Formal Dispute Notices</h3>
              <p className="text-sm text-slate-600">
                Generate professional meter verification notices in English and Hindi directly formatted for executive billing engineers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 text-center text-xs text-slate-500 border-t border-slate-200">
        UrjaMitra – AI-Powered Utility Bill Intelligence & Anomaly Detection System. Designed for Indian Consumers.
      </footer>
    </div>
  );
};
