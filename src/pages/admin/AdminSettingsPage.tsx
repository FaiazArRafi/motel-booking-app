import React, { useState, useEffect } from 'react';
import { settingsService } from '../../services/settingsService';
import { localStore } from '../../services/localStore';
import { MotelSettings } from '../../types/settings';
import { DEFAULT_MOTEL_SETTINGS } from '../../config/defaultSettings';
import { useToast } from '../../context/ToastContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Save, RefreshCw, Sparkles, Building, Phone, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<MotelSettings>(DEFAULT_MOTEL_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  useEffect(() => {
    settingsService.getSettings()
      .then(setSettings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await settingsService.updateSettings(settings);
      success('Motel website settings updated successfully!');
    } catch (err: any) {
      error(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset all demo rooms, offers, notices, and gallery to defaults?')) {
      localStore.resetToDefaultDemoData();
      success('Demo data restored to defaults!');
      window.location.reload();
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading settings..." />;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">Motel Brand & Policies</h1>
          <p className="text-xs text-stone-500 mt-1">Configure public contact information, check-in rules, and cancellation policies.</p>
        </div>

        <button
          type="button"
          onClick={handleResetDemoData}
          className="py-2 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold inline-flex items-center gap-1.5 shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Basic Brand Info */}
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-amber-700" />
            Motel Brand Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Motel Name *</label>
              <input
                type="text"
                required
                value={settings.motelName}
                onChange={e => setSettings({ ...settings, motelName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Tagline *</label>
              <input
                type="text"
                required
                value={settings.tagline}
                onChange={e => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-stone-600 block mb-1">About Text *</label>
            <textarea
              rows={3}
              required
              value={settings.aboutText}
              onChange={e => setSettings({ ...settings, aboutText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Phone className="w-5 h-5 text-amber-700" />
            Contact & Address
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Phone Number *</label>
              <input
                type="text"
                required
                value={settings.phone}
                onChange={e => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Support Email *</label>
              <input
                type="email"
                required
                value={settings.email}
                onChange={e => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Physical Address *</label>
            <input
              type="text"
              required
              value={settings.address}
              onChange={e => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
            />
          </div>
        </div>

        {/* Stay & Policy Info */}
        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-700" />
            Check-In & Cancellation Rules
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Check-In Time *</label>
              <input
                type="text"
                required
                value={settings.checkInTime}
                onChange={e => setSettings({ ...settings, checkInTime: e.target.value })}
                placeholder="14:00 (2:00 PM)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Check-Out Time *</label>
              <input
                type="text"
                required
                value={settings.checkOutTime}
                onChange={e => setSettings({ ...settings, checkOutTime: e.target.value })}
                placeholder="11:00 (11:00 AM)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Cancellation Policy Text *</label>
            <textarea
              rows={3}
              required
              value={settings.cancellationPolicyText}
              onChange={e => setSettings({ ...settings, cancellationPolicyText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="py-3.5 px-8 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm shadow-md transition disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Settings...' : 'Save All Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
