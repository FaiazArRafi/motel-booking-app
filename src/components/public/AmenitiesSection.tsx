import React from 'react';
import { Wifi, Car, Wind, Tv, Clock, Coffee, Refrigerator, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { MotelSettings } from '../../types/settings';

interface AmenitiesSectionProps {
  settings: MotelSettings;
}

export const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({ settings }) => {
  const iconMap: Record<string, any> = {
    Wifi,
    Car,
    Wind,
    Tv,
    Clock,
    Coffee,
    Refrigerator,
    ShieldCheck
  };

  const amenities = settings.amenitiesList || [];

  return (
    <section className="py-20 bg-stone-100/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
            Comfort & Convenience
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Designed for Your Comfort
          </h2>
          <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
            Everything you need for a restful, pleasant stay without any added resort fees.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {amenities.map((item) => {
            const IconComponent = iconMap[item.icon] || CheckCircle2;
            return (
              <div
                key={item.id}
                className="bg-white p-6 rounded-3xl border border-stone-200/70 shadow-sm hover:shadow-md transition space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-stone-900">{item.name}</h4>
                <p className="text-xs text-stone-500 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
