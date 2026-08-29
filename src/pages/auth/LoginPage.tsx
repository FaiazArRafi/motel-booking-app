import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Bed, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await login(email, password);
      success(`Welcome back, ${user.displayName || user.email}!`);
      if (user.role === 'admin' && redirect === '/dashboard') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    } catch (err: any) {
      error(err.message || 'Invalid email or password. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setSubmitting(true);
    try {
      const user = await loginWithGoogle();
      success(`Signed in with Google as ${user.displayName || user.email}`);
      navigate(redirect);
    } catch (err: any) {
      error(err.message || 'Google sign-in could not be completed.');
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
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Sign In to Your Account</h1>
          <p className="text-xs text-stone-500">Access your room reservations, manage stays, and submit refund requests.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-stone-600 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-700" />
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-stone-600 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Google / Alternative */}
        <div className="space-y-4">
          <div className="relative flex items-center justify-center">
            <div className="border-t border-stone-200 w-full" />
            <span className="bg-white px-3 text-xs text-stone-400 font-medium absolute">or continue with</span>
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={submitting}
            className="w-full py-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 font-bold text-xs transition flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Google Account</span>
          </button>
        </div>

        {/* Signup Redirect */}
        <p className="text-center text-xs text-stone-500">
          Don't have an account yet?{' '}
          <Link
            to={`/signup${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`}
            className="font-bold text-amber-800 hover:underline"
          >
            Create Guest Account
          </Link>
        </p>

      </div>
    </div>
  );
};
