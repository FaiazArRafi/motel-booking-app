import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Wifi, Car, Sparkles, ArrowRight } from 'lucide-react';
import { MotelSettings } from '../../types/settings';

interface HeroProps {
  settings: MotelSettings;
}

export const Hero: React.FC<HeroProps> = ({ settings }) => {
  return (
    <section className="relative bg-stone-900 text-white overflow-hidden">
      {/* Background Image with warm dark gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=80"
          alt="Pinecrest Motel Exterior"
          className="w-full h-full object-cover object-center opacity-35 scale-105 transition duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-stone-900/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 md:pt-28 md:pb-36">
        <div className="max-w-3xl space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-amber-500/20 border border-amber-400/30 backdrop-blur-md text-amber-300 text-xs sm:text-sm font-semibold tracking-wide">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Best Direct Booking Rates • No Hidden Fees</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
            {settings.motelName}
          </h1>

          {/* Tagline */}
          <p className="text-lg sm:text-xl text-stone-300 font-normal leading-relaxed max-w-2xl">
            {settings.tagline}. Relax in spacious, spotless accommodations with complimentary high-speed WiFi, parking right outside your door, and 24/7 guest service.
          </p>

          {/* Quick Highlights */}
          <div className="grid grid-cols-3 gap-3 pt-2 pb-2 text-xs sm:text-sm text-stone-200">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Free Doorstep Parking</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Fast Free WiFi</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Flexible Cancellation</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href="#search-section"
              className="py-3.5 px-8 rounded-xl bg-amber-700 hover:bg-amber-600 text-white font-bold text-base transition shadow-lg shadow-amber-900/30 flex items-center gap-2 active:scale-95"
            >
              <span>Book Your Room</span>
              <ArrowRight className="w-5 h-5" />
            </a>

            <Link
              to="/rooms"
              className="py-3.5 px-7 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm text-white font-bold text-base transition active:scale-95"
            >
              View All Rooms
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};
