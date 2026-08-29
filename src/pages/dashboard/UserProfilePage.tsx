import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { User, Phone, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const { user, updateUserProfile, switchDemoRole } = useAuth();
  const { success, error } = useToast();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfile({ displayName, phoneNumber });
      success('Profile updated successfully!');
    } catch (err: any) {
      error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        
        <div>
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
            Account Management
          </span>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">
            Profile & Settings
          </h1>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <form onSubmit={handleSave} className="space-y-4">
            
            <div>
              <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-stone-500 font-medium text-sm"
              />
              <span className="text-[11px] text-stone-400 mt-1 block">Managed by Authentication provider</span>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Display Name *</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Your Full Name"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-stone-600 block mb-1">Phone Number</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="py-3 px-6 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm shadow-sm transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Demo Role Switcher Helper (helpful for testing admin & guest modes instantly) */}
        {switchDemoRole && (
          <div className="p-6 rounded-3xl bg-stone-100 border border-stone-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Demo Mode Role Switcher
            </h4>
            <p className="text-xs text-stone-500">
              Easily toggle between <strong>Guest</strong> and <strong>Admin</strong> privileges to test both visitor booking and full Motel Management console views.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { switchDemoRole('guest'); success('Switched to Guest role'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${user?.role === 'guest' ? 'bg-amber-800 text-white' : 'bg-white text-stone-700 border'}`}
              >
                Guest Mode
              </button>
              <button
                type="button"
                onClick={() => { switchDemoRole('admin'); success('Switched to Admin role'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${user?.role === 'admin' ? 'bg-amber-800 text-white' : 'bg-white text-stone-700 border'}`}
              >
                Admin Mode
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
