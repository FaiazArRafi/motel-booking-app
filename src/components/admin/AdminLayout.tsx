import React, { useState } from 'react';
import { NavLink, Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  CalendarDays,
  BedDouble,
  Tag,
  Bell,
  Image as ImageIcon,
  DollarSign,
  Users,
  Settings,
  LogOut,
  Home,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/bookings', label: 'Bookings', icon: CalendarDays },
    { to: '/admin/rooms', label: 'Rooms Management', icon: BedDouble },
    { to: '/admin/offers', label: 'Offers & Promos', icon: Tag },
    { to: '/admin/notices', label: 'Notices & Banners', icon: Bell },
    { to: '/admin/gallery', label: 'Photo Gallery', icon: ImageIcon },
    { to: '/admin/refunds', label: 'Refund Requests', icon: DollarSign },
    { to: '/admin/users', label: 'Registered Users', icon: Users },
    { to: '/admin/settings', label: 'Motel Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-stone-900 text-white p-4 flex items-center justify-between sticky top-0 z-50 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-sm">Pinecrest Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-stone-800 text-stone-300"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-stone-900 text-stone-300 flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-stone-800 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-700 flex items-center justify-center font-bold text-white shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-white font-bold text-sm leading-tight">Admin Console</h2>
                <p className="text-[11px] text-amber-500 font-semibold">Pinecrest Motel</p>
              </div>
            </Link>
          </div>

          {/* Nav list */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? 'bg-amber-800 text-white'
                        : 'text-stone-400 hover:text-white hover:bg-stone-800/80'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-stone-800 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white hover:bg-stone-800 transition"
          >
            <Home className="w-4 h-4" />
            <span>View Public Site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/30 transition text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen">
        
        {/* Top Navbar */}
        <header className="bg-white border-b border-stone-200 py-4 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
            <span>Logged in as:</span>
            <span className="font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded-md">{user?.email}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="py-1.5 px-3 rounded-lg border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
            >
              Public Website
            </Link>
          </div>
        </header>

        {/* Body Container */}
        <div className="p-6 sm:p-8 flex-1">
          <Outlet />
        </div>
      </main>

    </div>
  );
};
