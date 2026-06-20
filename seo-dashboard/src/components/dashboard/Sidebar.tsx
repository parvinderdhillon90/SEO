"use client";

import {
  LayoutDashboard,
  BarChart2,
  Users,
  Globe,
  Target,
  FileText,
  Settings,
  TrendingUp,
  Activity,
} from "lucide-react";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { icon: <LayoutDashboard className="w-5 h-5" />, label: "Overview", active: true },
  { icon: <Activity className="w-5 h-5" />, label: "Real-time" },
  { icon: <BarChart2 className="w-5 h-5" />, label: "Acquisition" },
  { icon: <Users className="w-5 h-5" />, label: "Audience" },
  { icon: <Globe className="w-5 h-5" />, label: "Geography" },
  { icon: <FileText className="w-5 h-5" />, label: "Content" },
  { icon: <Target className="w-5 h-5" />, label: "Conversions" },
  { icon: <TrendingUp className="w-5 h-5" />, label: "SEO Report" },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-100 min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <BarChart2 className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm leading-none">Analytics</p>
          <p className="text-xs text-gray-400 mt-0.5">Central Dashboard</p>
        </div>
      </div>

      {/* Property */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
          <div className="w-6 h-6 bg-orange-400 rounded-md flex items-center justify-center flex-shrink-0">
            <Globe className="w-3 h-3 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-700 truncate">Softmarche</p>
            <p className="text-[10px] text-gray-400 truncate">softmarche.com</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">
          Analytics
        </p>
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              item.active
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            <span className={item.active ? "text-indigo-600" : "text-gray-400"}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors">
          <Settings className="w-5 h-5 text-gray-400" />
          Settings
        </button>
        <div className="mt-3 flex items-center gap-3 px-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            SM
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-700 truncate">Softmarche</p>
            <p className="text-[10px] text-gray-400">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
