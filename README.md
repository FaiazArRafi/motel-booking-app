# Pinecrest Motel Room Booking Web Application

A clean, modern, mobile-first, and production-ready Motel Room Booking Application built with React, Vite, TypeScript, Tailwind CSS, and Firebase (Authentication, Cloud Firestore, and Firebase Storage).

---

## Features Overview

### 1. Visitor & Public Browsing (No Login Required)
- **Responsive Landing Page**: Hero banner, quick highlights, search overlay, featured rooms showcase, active offers, notice banners, motel amenities, about section, and interactive map/contact details.
- **Room Catalog & Date Availability Search**: Filter by dates, room types, nightly pricing, and guest capacity.
- **Real-Time Overlap Prevention**: Rooms are checked against active `pending` and `confirmed` bookings to prevent double bookings.
- **Active Offers & Promotions**: View special percentage and fixed-amount discounts and promo codes.
- **Guest Notices**: Color-coded banners for important announcements (information, warning, important).
- **Photo Gallery**: High-resolution gallery organized by categories (Exterior, Lobby, Rooms, Bathrooms, Amenities, Parking).

### 2. User & Booking Management (Authentication Required)
- **Firebase Authentication**: Email/Password and Google Sign-In support.
- **Role-Based Access**: Safe separation between `guest` and `admin` accounts.
- **Booking Flow**: Multi-step checkout with price breakdown, automated discount calculations, and primary guest details.
- **Exact 24-Hour Cancellation Policy**:
  - Cancellations made **&ge; 24 hours** prior to check-in time (2:00 PM on arrival date) receive **100% full refund** (0% fee).
  - Cancellations made **&lt; 24 hours** before check-in incur a **20% cancellation fee** with an **80% refund**.
- **Refund Request Workflow**: Cancelled bookings can submit refund requests that are queued for admin review.
- **User Dashboard**: Overview of past and upcoming stays, active reservation management, and profile editing.

### 3. Admin Management Console (Role Protected `/admin`)
- **Overview Analytics**: Live cards for total bookings, occupancy, gross revenue, and pending refund alerts.
- **Bookings Manager**: Filter by status, search by guest/ref, update booking status, payment status, and internal admin notes.
- **Rooms Management**: Add, edit, and deactivate rooms, adjust nightly prices, capacities, amenities, and photos.
- **Offers & Promos**: Create percentage or fixed discounts with start and end dates.
- **Notices**: Publish or toggle guest banner advisories.
- **Gallery**: Manage uploaded motel imagery.
- **Refund Requests**: Approve, reject, or mark refund requests as processed with audit notes.
- **Registered Users**: View registered guest accounts and stay frequency.
- **Motel Settings**: Update motel name, tagline, contact info, check-in/out hours, and cancellation policy text.

---

## Setup & Deployment Instructions

### 1. Installation
```bash
cd motel-booking-app
npm install
```

### 2. Configure Firebase Environment Variables
Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> **Note on Zero-Config Demo Mode:**
> If `.env` is not configured immediately, the application boots into a rich in-browser demo mode populated with realistic rooms, offers, notices, and test accounts. When live Firebase credentials are added, it connects to live Firebase services seamlessly.

### 3. Creating the First Admin Account
1. Sign up for a normal account on `/signup`.
2. In your Firebase Console under Cloud Firestore, navigate to `/users/{your_uid}`.
3. Set `role: "admin"`.
4. Refresh the application to access `/admin`.

### 4. Deploying Security Rules
Deploy the included `firestore.rules` and `storage.rules` via the Firebase CLI:
```bash
firebase deploy --only firestore:rules,storage
```

### 5. Running the Application
```bash
# Development server
npm run dev

# Production build
npm run build
```
