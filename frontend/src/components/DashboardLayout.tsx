import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UploadCloud,
  Receipt,
  GitCompare,
  BrainCircuit,
  Calculator,
  FileText,
  Bell,
  Settings,
  LogOut,
  Zap,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<SidebarProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload Bills', path: '/dashboard/upload', icon: UploadCloud },
    { name: 'My Bills', path: '/dashboard/bills', icon: Receipt },
    { name: 'Bill Comparison', path: '/dashboard/compare', icon: GitCompare },
    { name: 'AI Insights & Chat', path: '/dashboard/ai-insights', icon: BrainCircuit },
    { name: 'Savings Calculator', path: '/dashboard/savings', icon: Calculator },
    { name: 'Dispute Letters', path: '/dashboard/disputes', icon: FileText },
    { name: 'Notifications', path: '/dashboard/notifications', icon: Bell },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('urjamitra_token');
    localStorage.removeItem('urjamitra_user');
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('urjamitra_user') || '{"fullName":"Arjun Sharma","email":"demo@urjamitra.in"}');

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#14243A] text-white border-r border-slate-800 select-none">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700/60">
          <div className="p-2 bg-blue-600 rounded-lg shadow-sm">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">UrjaMitra</h1>
            <p className="text-xs text-teal-400 font-medium">Smart Utility Companion</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-slate-700/60 bg-slate-900/40">
          <div className="flex items-center justify-between mb-3">
            <div className="truncate">
              <p className="text-sm font-semibold text-white truncate">{user.fullName}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors w-full"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Nav Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#14243A] text-white">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-teal-400" />
            <span className="font-bold">UrjaMitra</span>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1 rounded-md text-slate-300">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {mobileOpen && (
          <div className="md:hidden bg-[#14243A] text-white px-4 py-3 space-y-1 border-b border-slate-700">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm text-slate-200"
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 text-sm text-red-400 w-full"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
