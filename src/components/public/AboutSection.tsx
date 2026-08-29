import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, HeartHandshake, Sparkles, MapPin, Phone, ArrowRight } from 'lucide-react';
import { MotelSettings } from '../../types/settings';

interface AboutSectionProps {
  settings: MotelSettings;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings }) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Visual Showcase */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-stone-200">
              <img
                src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80"
                alt="Pinecrest Motel Lobby"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute -bottom-6 -right-6 bg-amber-800 text-white p-6 rounded-3xl shadow-xl max-w-xs hidden sm:block border border-amber-700">
              <div className="flex items-center gap-3 mb-2">
                <HeartHandshake className="w-6 h-6 text-amber-300" />
                <span className="font-bold text-sm">Locally Operated</span>
              </div>
              <p className="text-xs text-amber-100 leading-relaxed">
                Dedicated to honest, spotless hospitality and friendly 24/7 service since our founding.
              </p>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                About Our Motel
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-1">
                Your Peaceful Retreat on the Road
              </h2>
            </div>

            <p className="text-stone-600 text-base leading-relaxed">
              {settings.aboutText}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
                <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Direct Booking Perks</h4>
                  <p className="text-xs text-stone-500 mt-0.5">Guaranteed lowest rate and zero booking middleman markups.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
                <Sparkles className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Spotless Guarantee</h4>
                  <p className="text-xs text-stone-500 mt-0.5">Rigorous deep cleaning protocols performed before every guest arrival.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/about"
                className="py-3 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm transition flex items-center gap-2"
              >
                <span>Read Full Story & Policies</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="py-3 px-6 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 font-bold text-sm transition"
              >
                Get Directions
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
