import React, { useState, useEffect } from 'react';
import { settingsService } from '../../services/settingsService';
import { MotelSettings } from '../../types/settings';
import { DEFAULT_MOTEL_SETTINGS } from '../../config/defaultSettings';
import { ShieldCheck, Clock, CheckCircle2, HeartHandshake, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  const [settings, setSettings] = useState<MotelSettings>(DEFAULT_MOTEL_SETTINGS);

  useEffect(() => {
    settingsService.getSettings().then(setSettings).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
            Hospitality & Values
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            About {settings.motelName}
          </h1>
          <p className="text-sm text-stone-500 leading-relaxed">
            Spotless accommodations, transparent rates, and genuinely friendly hospitality.
          </p>
        </div>

        {/* Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-stone-200">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"
              alt="Motel Architecture"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-stone-900">Our Story & Commitment</h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              {settings.aboutText}
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              Whether you're stopping over on a Pacific highway road trip, traveling on business, or seeking a quiet retreat near the scenic mountains, we believe a great motel experience starts with spotless comfort, responsive staff, and no hidden resort fees.
            </p>
          </div>
        </div>

        {/* Cancellation Policy Detail */}
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">Transparent Cancellation Policy</h3>
              <p className="text-xs text-stone-500">Fair terms calculated from your scheduled 2:00 PM check-in time</p>
            </div>
          </div>

          <p className="text-sm text-stone-600 leading-relaxed bg-amber-50/60 p-4 rounded-2xl border border-amber-200/70">
            {settings.cancellationPolicyText}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">Cancellations ≥ 24 Hours:</span>
              <p className="text-stone-600">Full 100% refund of all eligible booking charges. Zero cancellation fees.</p>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="font-bold text-stone-900 block mb-1">Cancellations &lt; 24 Hours:</span>
              <p className="text-stone-600">20% late cancellation fee retained; 80% eligible refund upon request review.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            to="/rooms"
            className="inline-block py-3.5 px-8 rounded-xl bg-amber-800 text-white font-bold text-sm hover:bg-amber-900 transition shadow-md"
          >
            Check Room Availability
          </Link>
        </div>

      </div>
    </div>
  );
};
