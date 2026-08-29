import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bed, Phone, Mail, MapPin, Clock, Shield, Sparkles } from 'lucide-react';
import { settingsService } from '../../services/settingsService';
import { MotelSettings } from '../../types/settings';
import { DEFAULT_MOTEL_SETTINGS } from '../../config/defaultSettings';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<MotelSettings>(DEFAULT_MOTEL_SETTINGS);

  useEffect(() => {
    settingsService.getSettings().then(setSettings).catch(console.error);
  }, []);

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-700 text-white flex items-center justify-center font-bold">
                <Bed className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {settings.motelName}
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              {settings.tagline}. Spotless, modern rooms and welcoming hospitality at affordable direct-booking rates.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400/90 font-medium">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Direct Best Rate Guarantee</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/rooms" className="hover:text-amber-400 transition">Browse Rooms</Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-amber-400 transition">Special Deals & Offers</Link>
              </li>
              <li>
                <Link to="/notices" className="hover:text-amber-400 transition">Guest Notices & Updates</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-amber-400 transition">Photo Gallery</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition">About Our Motel</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition">Contact & Location</Link>
              </li>
            </ul>
          </div>

          {/* Check-In / Hours */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Stay Information</h4>
            <div className="space-y-3 text-sm text-stone-400">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-stone-200 font-medium">Check-In Time</p>
                  <p className="text-xs">From {settings.checkInTime || '2:00 PM'} onwards</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-stone-200 font-medium">Check-Out Time</p>
                  <p className="text-xs">Until {settings.checkOutTime || '11:00 AM'}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-stone-200 font-medium">Cancellation Policy</p>
                  <p className="text-xs">100% Free cancel up to 24h prior</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Contact & Location</h4>
            <div className="space-y-3 text-sm text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`tel:${settings.phone}`} className="text-xs hover:text-white transition">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`mailto:${settings.email}`} className="text-xs hover:text-white transition">
                  {settings.email}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} {settings.motelName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-stone-300 transition">Privacy & Policies</Link>
            <Link to="/contact" className="hover:text-stone-300 transition">Support</Link>
            <Link to="/login" className="hover:text-stone-300 transition">Staff Access</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
