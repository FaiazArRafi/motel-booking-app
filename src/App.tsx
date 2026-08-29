import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AdminRoute } from './components/common/AdminRoute';
import { AdminLayout } from './components/admin/AdminLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { RoomsPage } from './pages/public/RoomsPage';
import { RoomDetailPage } from './pages/public/RoomDetailPage';
import { OffersPage } from './pages/public/OffersPage';
import { NoticesPage } from './pages/public/NoticesPage';
import { GalleryPage } from './pages/public/GalleryPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';

// Booking Pages
import { BookingPage } from './pages/booking/BookingPage';
import { BookingSuccessPage } from './pages/booking/BookingSuccessPage';

// Dashboard Pages
import { UserDashboard } from './pages/dashboard/UserDashboard';
import { MyBookingsPage } from './pages/dashboard/MyBookingsPage';
import { UserProfilePage } from './pages/dashboard/UserProfilePage';

// Admin Pages
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminRoomsPage } from './pages/admin/AdminRoomsPage';
import { AdminOffersPage } from './pages/admin/AdminOffersPage';
import { AdminNoticesPage } from './pages/admin/AdminNoticesPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminRefundsPage } from './pages/admin/AdminRefundsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

import { useEffect } from 'react';
import { db, isLiveFirebaseConfigured } from './config/firebase';
import { seedFirestoreInitialData } from './services/seedService';

// Layout wrapper for Public & Dashboard pages with Header/Footer
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  useEffect(() => {
    if (isLiveFirebaseConfigured) {
      seedFirestoreInitialData(db);
    }
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/rooms" element={<PublicLayout><RoomsPage /></PublicLayout>} />
            <Route path="/rooms/:roomId" element={<PublicLayout><RoomDetailPage /></PublicLayout>} />
            <Route path="/offers" element={<PublicLayout><OffersPage /></PublicLayout>} />
            <Route path="/notices" element={<PublicLayout><NoticesPage /></PublicLayout>} />
            <Route path="/gallery" element={<PublicLayout><GalleryPage /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />

            {/* Auth Routes */}
            <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
            <Route path="/signup" element={<PublicLayout><SignupPage /></PublicLayout>} />

            {/* Booking Flow (Requires Login) */}
            <Route
              path="/booking"
              element={
                <ProtectedRoute>
                  <PublicLayout><BookingPage /></PublicLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking/success"
              element={
                <ProtectedRoute>
                  <PublicLayout><BookingSuccessPage /></PublicLayout>
                </ProtectedRoute>
              }
            />

            {/* User Dashboard Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <PublicLayout><UserDashboard /></PublicLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/bookings"
              element={
                <ProtectedRoute>
                  <PublicLayout><MyBookingsPage /></PublicLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/profile"
              element={
                <ProtectedRoute>
                  <PublicLayout><UserProfilePage /></PublicLayout>
                </ProtectedRoute>
              }
            />

            {/* Admin Dashboard Protected Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminOverviewPage />} />
              <Route path="bookings" element={<AdminBookingsPage />} />
              <Route path="rooms" element={<AdminRoomsPage />} />
              <Route path="offers" element={<AdminOffersPage />} />
              <Route path="notices" element={<AdminNoticesPage />} />
              <Route path="gallery" element={<AdminGalleryPage />} />
              <Route path="refunds" element={<AdminRefundsPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
