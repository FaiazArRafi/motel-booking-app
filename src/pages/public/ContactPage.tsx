import React, { useState, useEffect } from 'react';
import { settingsService } from '../../services/settingsService';
import { MotelSettings } from '../../types/settings';
import { DEFAULT_MOTEL_SETTINGS } from '../../config/defaultSettings';
import { useToast } from '../../context/ToastContext';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [settings, setSettings] = useState<MotelSettings>(DEFAULT_MOTEL_SETTINGS);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { success } = useToast();

  useEffect(() => {
    settingsService.getSettings().then(setSettings).catch(console.error);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      success('Thank you! Your message has been received. Front desk will reply shortly.');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-stone-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
            We're Here For You
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Contact & Directions
          </h1>
          <p className="text-sm text-stone-500 leading-relaxed">
            Have questions about group rates, early check-in, or accessibility? Send us a note or call our front desk directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-stone-900">Motel Contact Details</h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block">Physical Address</span>
                    <p className="text-xs text-stone-500 mt-0.5">{settings.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block">Phone Support</span>
                    <p className="text-xs text-stone-500 mt-0.5">{settings.phone} (24 Hours)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block">Email Address</span>
                    <p className="text-xs text-stone-500 mt-0.5">{settings.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block">Front Desk Hours</span>
                    <p className="text-xs text-stone-500 mt-0.5">Open 24/7 with express digital check-in support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold text-stone-900">Send Us an Inquiry</h3>
              <p className="text-xs text-stone-500 mt-1">We respond to email inquiries within 2-4 hours.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Phone (Optional)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Your Message *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell us about your stay dates or special requests..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{sending ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
