# CardioGuard Website 🫀

A modern, responsive Next.js web application for cardiovascular disease (CVD) risk prediction. This platform works seamlessly with a Flutter mobile application, sharing the same Supabase database to provide real-time history syncing and authentication across both platforms.

## 🌟 Features

- **Real-time ML Predictions:** Integrates exactly with the Python FastAPI predictive model to analyze medical and lifestyle data in real-time.
- **Beautiful UI:** Built with Tailwind CSS and Framer Motion for premium, smooth micro-animations and an intuitive multi-step form.
- **Secure Authentication:** User login and registration powered by Supabase Auth.
- **Data Synchronization:** Any predictions made on this website are instantly visible in the mobile app, and vice versa.
- **Detailed History:** View your full chronological medical history and cardiovascular risk trends over time.

## 🚀 Technology Stack

- **Frontend:** Next.js 14, React 18, TypeScript
- **Styling & Animations:** Tailwind CSS, Framer Motion, Lucide Icons, Recharts
- **Database & Auth:** Supabase (PostgreSQL)
- **Deployment Platform:** Vercel

## ⚙️ Getting Started Locally

### Prerequisites
Make sure you have Node.js (v18+) and npm installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/shakeelscribes/cvd-website.git
cd cvd-website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add your Supabase and Backend API keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_FASTAPI_URL=https://cardiovascluar-backend.onrender.com
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🌐 Production Deployment

This project is optimized for deployment on **Vercel**. 

1. Push your code to GitHub.
2. Import the project in your Vercel Dashboard.
3. Supply the Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_FASTAPI_URL`).
4. Click Deploy! 

## 🏗️ Architecture Note

This frontend operates within a larger ecosystem. It strictly separates its logical concerns:
- **Supabase** handles all persistent data (Users, Prediction History).
- **FastAPI / Python ML** handles the heavy lifting of calculating the AI risk logic. This Next.js app acts as the beautiful client presenting that data.
