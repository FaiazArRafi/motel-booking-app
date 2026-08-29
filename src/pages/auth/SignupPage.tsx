import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Bed, Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      error('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const user = await signup(email, password, name, phone);
      success(`Account created! Welcome, ${user.displayName || user.email}`);
      navigate(redirect);
    } catch (err: any) {
      error(err.message || 'Registration could not be completed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-stone-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-xl space-y-8">
        
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-800 text-white flex items-center justify-center mx-auto shadow-md">
            <Bed className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Create Guest Account</h1>
          <p className="text-xs text-stone-500">Sign up to reserve rooms, receive booking receipts, and manage your stays.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-stone-600 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-700" />
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Alex Traveler"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-stone-600 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-700" />
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-stone-600 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-700" />
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-stone-600 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              Password *
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
          >
            <span>{submitting ? 'Creating Account...' : 'Sign Up & Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-stone-500">
          Already have an account?{' '}
          <Link
            to={`/login${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
            className="font-bold text-amber-800 hover:underline"
          >
            Log In
          </Link>
        </p>

      </div>
    </div>
  );
};
