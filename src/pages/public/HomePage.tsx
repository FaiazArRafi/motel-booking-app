import React, { useState, useEffect } from 'react';
import { Hero } from '../../components/public/Hero';
import { SearchBar } from '../../components/public/SearchBar';
import { RoomCard } from '../../components/public/RoomCard';
import { OfferCard } from '../../components/public/OfferCard';
import { NoticeBanner } from '../../components/public/NoticeBanner';
import { AmenitiesSection } from '../../components/public/AmenitiesSection';
import { AboutSection } from '../../components/public/AboutSection';
import { roomService } from '../../services/roomService';
import { offerService } from '../../services/offerService';
import { settingsService } from '../../services/settingsService';
import { Room } from '../../types/room';
import { Offer } from '../../types/offer';
import { MotelSettings } from '../../types/settings';
import { DEFAULT_MOTEL_SETTINGS } from '../../config/defaultSettings';
import { Link } from 'react-router-dom';
import { ArrowRight, Bed, Sparkles, Tag, MapPin, Phone, Mail } from 'lucide-react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const HomePage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [settings, setSettings] = useState<MotelSettings>(DEFAULT_MOTEL_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [roomsData, offersData, settingsData] = await Promise.all([
          roomService.getPublicRooms(),
          offerService.getActiveOffers(),
          settingsService.getSettings()
        ]);
        setRooms(roomsData);
        setOffers(offersData);
        setSettings(settingsData);
      } catch (e) {
        console.error('Error loading home data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const featuredRooms = rooms.filter(r => r.featured).slice(0, 3);
  const displayRooms = featuredRooms.length > 0 ? featuredRooms : rooms.slice(0, 3);

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Active Guest Notice Banner */}
      <NoticeBanner />

      {/* Hero Section */}
      <Hero settings={settings} />

      {/* Search Bar Section Overlay */}
      <section id="search-section" className="relative -mt-14 z-20 px-4 sm:px-6 lg:px-8">
        <SearchBar />
      </section>

      {/* Featured Rooms Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
              Accommodations
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Featured Rooms & Suites
            </h2>
          </div>
          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 text-sm font-bold text-amber-800 hover:text-amber-900 transition"
          >
            <span>Explore All Rooms</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading featured rooms..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayRooms.map(room => (
              <RoomCard key={room.roomId} room={room} />
            ))}
          </div>
        )}
      </section>

      {/* Active Special Offers Section */}
      {offers.length > 0 && (
        <section className="py-16 bg-amber-50/50 border-y border-amber-200/50 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                Direct Deals
              </span>
              <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">
                Special Stay Offers & Discounts
              </h2>
              <p className="text-sm text-stone-500">
                Book directly on our official site to enjoy exclusive promotional savings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {offers.slice(0, 2).map(offer => (
                <OfferCard key={offer.offerId} offer={offer} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Amenities Section */}
      <AmenitiesSection settings={settings} />

      {/* About Motel Section */}
      <AboutSection settings={settings} />

      {/* Contact & Map Section */}
      <section className="py-20 bg-stone-50 border-t border-stone-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                Location & Inquiries
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-1">
                We're Here to Welcome You
              </h2>
            </div>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Conveniently situated right along Scenic Mountain Highway, our motel provides easy highway access with peaceful, whisper-quiet rooms tucked away from heavy traffic.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-stone-200/70 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Our Address</h4>
                  <p className="text-xs text-stone-500 mt-0.5">{settings.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-stone-200/70 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Direct Phone Support</h4>
                  <p className="text-xs text-stone-500 mt-0.5">{settings.phone} (24/7 Front Desk)</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-stone-200/70 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Email Inquiries</h4>
                  <p className="text-xs text-stone-500 mt-0.5">{settings.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-stone-200 bg-stone-200 relative">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
              alt="Motel Location"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-stone-950/20" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-lg text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-900 block">{settings.motelName}</span>
                <span className="text-stone-500">{settings.address}</span>
              </div>
              <a
                href={settings.googleMapsUrl || 'https://maps.google.com'}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3.5 rounded-xl bg-amber-800 text-white font-bold text-xs hover:bg-amber-900 transition shrink-0"
              >
                Open in Maps
              </a>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
