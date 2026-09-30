# StudyNook – Library Study Room Booking

[![Live Site](https://img.shields.io/badge/Live_Site-StudyNook-teal?style=for-the-badge&logo=vercel)](https://studynook-app.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Next.js_16-Express.js_MongoDB-emerald?style=for-the-badge)](https://nextjs.org)

**StudyNook** is a modern full-stack web application designed for university students, researchers, and library managers to list, discover, filter, and reserve private library study rooms. Featuring real-time double-booking conflict detection, JWT authentication via HTTP-only cookies, dynamic dark/light mode, and owner management dashboards.

---

## 🚀 Live Site URL
- **Client App**: [https://studynook-app.vercel.app](https://studynook-app.vercel.app)
- **Backend API Server**: [https://studynook-server.onrender.com](https://studynook-server.onrender.com)

---

## ✨ Key Features (Minimum 5 Highlights)

1. **Conflict-Free Smart Time Slot Engine**:
   - Automatically prevents double-booking using dynamic time-conflict detection (`start < existEnd && end > existStart`) on MongoDB.

2. **Secure JWT Authentication with HTTP-Only Cookies**:
   - Secure login and registration with live password complexity validation (min 6 chars, uppercase, lowercase) and Google OAuth integration, issuing `httpOnly` cookies to protect user sessions against XSS.

3. **Advanced Search & Multi-Criteria Filtering**:
   - Real-time search by room title, multi-amenity selection (`$in`), floor selection, and sorting options (Price Low to High, High to Low, Most Popular, Latest).

4. **Complete Room Ownership & Booking Dashboard**:
   - Private routes for adding study rooms (`/add-room`), managing listings (`/my-listings`), and managing reservations (`/my-bookings`) with cancel options (`$pull` operator updates).

5. **Dynamic Dark/Light Theme with Responsive Design**:
   - Fully customizable dark and light mode switch with persistent user preference stored in `localStorage`, and mobile/tablet/desktop responsive layouts.

6. **Interactive Toast Notifications & Centered Loaders**:
   - Replaces native browser alerts with custom non-intrusive `react-hot-toast` notifications and smooth skeleton loading indicators.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, HeroUI, Lucide React, React Hot Toast, Framer Motion.
- **Backend**: Node.js, Express.js, MongoDB Native Driver (`MongoClient`), JsonWebToken (JWT), Cookie-Parser, BcryptJS.
- **Hosting**: Vercel (Client), Render / Railway (Backend).

---

## 💻 Local Setup & Installation

### 1. Backend Setup
```bash
cd backend
npm install
node index.js
```
Create a `.env` file in `backend`:
```env
PORT=5000
MONGODB_URL=your_mongodb_connection_string
CLIENT_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Create a `.env` file in `frontend`:
```env
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URL=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SCEREAT=your_google_client_secret
```

---

## 📜 License
Developed for Assignment Category CAT_12. All rights reserved.
