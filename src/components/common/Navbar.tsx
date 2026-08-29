import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Menu,
  X,
  Bed,
  User,
  ShieldCheck,
  LogOut,
  CalendarDays,
  Tag,
  Bell,
  Info,
  PhoneCall,
  Image as ImageIcon
} from 'lucide-react';
import { settingsService } from '../../services/settingsService';
import { MotelSettings } from '../../types/settings';
import { DEFAULT_MOTEL_SETTINGS } from '../../config/defaultSettings';

export const Navbar: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [settings, setSettings] = useState<MotelSettings>(DEFAULT_MOTEL_SETTINGS);
  const navigate = useNavigate();

  useEffect(() => {
    settingsService.getSettings().then(setSettings).catch(console.error);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/rooms', label: 'Rooms' },
    { to: '/offers', label: 'Offers' },
    { to: '/notices', label: 'Notices' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Motel Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-amber-800 text-amber-50 flex items-center justify-center shadow-md group-hover:bg-amber-900 transition">
              <Bed className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xl font-extrabold tracking-tight text-stone-900 leading-none">
                {settings.motelName.split('&')[0] || 'Pinecrest Motel'}
              </span>
              <span className="text-[11px] font-semibold text-amber-700 tracking-wider uppercase">
                Clean • Cozy • Value
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'text-amber-800 bg-amber-50/80'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Action & User Controls */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 py-2 px-3 rounded-xl border border-stone-200 hover:bg-stone-50 transition text-sm font-semibold text-stone-800"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-800/10 text-amber-800 flex items-center justify-center font-bold text-xs">
                    {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user.displayName || user.email.split('@')[0]}</span>
                  {isAdmin && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-bold bg-amber-800 text-white tracking-wider">
                      Admin
                    </span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 z-20 animate-in fade-in zoom-in-95">
                      <div className="px-4 py-2.5 border-b border-stone-100">
                        <p className="text-xs font-medium text-stone-400">Signed in as</p>
                        <p className="text-sm font-bold text-stone-900 truncate">{user.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-amber-800 hover:bg-amber-50 transition"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-700" />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition"
                      >
                        <User className="w-4 h-4 text-stone-400" />
                        My Account & Profile
                      </Link>

                      <Link
                        to="/dashboard/bookings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition"
                      >
                        <CalendarDays className="w-4 h-4 text-stone-400" />
                        My Bookings
                      </Link>

                      <div className="border-t border-stone-100 my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-stone-700 hover:text-stone-900 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/rooms"
                  className="px-5 py-2.5 rounded-xl bg-amber-800 text-white text-sm font-bold shadow-sm hover:bg-amber-900 transition active:scale-95"
                >
                  Book Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-stone-700 hover:bg-stone-100 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          <div className="space-y-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-base font-semibold transition ${
                    isActive
                      ? 'text-amber-800 bg-amber-50'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="border-t border-stone-100 pt-4 space-y-2">
            {user ? (
              <>
                <div className="px-4 py-2 bg-stone-50 rounded-xl">
                  <p className="text-xs font-semibold text-stone-400">Signed in</p>
                  <p className="text-sm font-bold text-stone-900 truncate">{user.email}</p>
                </div>

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-amber-800 font-bold bg-amber-50/80"
                  >
                    <ShieldCheck className="w-5 h-5 text-amber-700" />
                    Admin Dashboard
                  </Link>
                )}

                <Link
                  to="/dashboard/bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-stone-700 font-medium hover:bg-stone-50"
                >
                  <CalendarDays className="w-5 h-5 text-stone-400" />
                  My Bookings
                </Link>

                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-stone-700 font-medium hover:bg-stone-50"
                >
                  <User className="w-5 h-5 text-stone-400" />
                  Profile Settings
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-rose-600 font-medium hover:bg-rose-50 text-left"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center rounded-xl border border-stone-300 text-stone-800 font-bold text-sm hover:bg-stone-50 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/rooms"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center rounded-xl bg-amber-800 text-white font-bold text-sm hover:bg-amber-900 transition shadow-sm"
                >
                  Book Now
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
