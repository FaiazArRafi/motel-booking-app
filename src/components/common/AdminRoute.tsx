import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';
import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner label="Verifying admin credentials..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center p-8 bg-white rounded-3xl shadow-xl border border-stone-200">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">Access Denied</h2>
          <p className="text-stone-500 text-sm mb-6 leading-relaxed">
            You are logged in as <strong className="text-stone-800">{user.email}</strong> with guest privileges. Admin management requires an administrator account.
          </p>
          <Link
            to="/"
            className="inline-block py-3 px-6 rounded-xl bg-amber-800 text-white font-medium text-sm hover:bg-amber-900 transition shadow-sm"
          >
            Return to Public Home
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
