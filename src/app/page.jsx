"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import RoomCard from "../components/RoomCard";
import { RoomCardSkeleton } from "../components/LoadingSpinner";
import {
  BookOpen,
  Sparkles,
  ShieldCheck,
  Clock,
  Zap,
  CheckCircle2,
  Search,
  Calendar,
  Lock,
  ArrowRight,
  Building2,
  Users,
  Award,
} from "lucide-react";

export default function Home() {
  const { API_BASE_URL } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "StudyNook – Home";

    const fetchLatestRooms = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/rooms?limit=6&sort=latest`);
        if (res.ok) {
          const data = await res.json();
          setRooms(data);
        }
      } catch (error) {
        console.error("Failed to fetch latest rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestRooms();
  }, [API_BASE_URL]);

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* 1. HERO / BANNER SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-500/10 via-emerald-500/5 to-transparent pt-16 pb-24 border-b border-zinc-200/60 dark:border-zinc-800/60">
        {/* Decorative Background Blur Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-400/20 dark:bg-teal-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100 dark:bg-teal-950/80 border border-teal-300 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-xs font-semibold mb-6 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>The #1 Library Study Space Reservation Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-zinc-900 dark:text-white tracking-tight max-w-4xl mx-auto leading-tight sm:leading-tight">
            Find Your Perfect <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-teal-600 via-emerald-500 to-cyan-500 bg-clip-text text-transparent">
              Study Room
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Browse and book quiet, private study rooms in your library. List your own room and earn.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/rooms"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-base shadow-lg shadow-teal-600/25 transition-all hover:scale-[1.02]"
            >
              <Search className="w-5 h-5" />
              <span>Explore Rooms</span>
            </Link>
            <Link
              href="/add-room"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 font-bold text-base shadow-sm transition-all hover:scale-[1.02]"
            >
              <Building2 className="w-5 h-5 text-teal-500" />
              <span>Host a Room</span>
            </Link>
          </div>

          {/* Key Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md rounded-3xl p-6 border border-zinc-200/80 dark:border-zinc-800/80 shadow-md">
            <div>
              <p className="text-3xl font-extrabold text-teal-600 dark:text-teal-400">100%</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Conflict-Free Guarantee</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-teal-600 dark:text-teal-400">50+</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Verified Campus Nooks</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-teal-600 dark:text-teal-400">10k+</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Successful Hours Booked</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-teal-600 dark:text-teal-400">4.9/5</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Student Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC SECTION – AVAILABLE STUDY ROOMS (LATEST 6) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-sm font-bold uppercase tracking-wider mb-2">
              <Zap className="w-4 h-4" />
              <span>Fresh Additions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Featured Study Rooms
            </h2>
          </div>
          <Link
            href="/rooms"
            className="inline-flex items-center gap-2 text-sm font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 group"
          >
            <span>View All Available Rooms</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <RoomCardSkeleton />
            <RoomCardSkeleton />
            <RoomCardSkeleton />
            <RoomCardSkeleton />
            <RoomCardSkeleton />
            <RoomCardSkeleton />
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800">
            <BookOpen className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">No rooms listed yet</h3>
            <p className="text-sm text-zinc-500 mt-1">Be the first to list a private study room!</p>
            <Link
              href="/add-room"
              className="mt-4 inline-block px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-bold shadow-md"
            >
              Add Room
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}
      </section>

      {/* 3. EXTRA STATIC SECTION 1: WHY CHOOSE STUDYNOOK? */}
      <section className="bg-zinc-50 dark:bg-zinc-900/60 py-20 border-y border-zinc-200/60 dark:border-zinc-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-2 text-teal-600 dark:text-teal-400 text-sm font-bold uppercase tracking-wider mb-2">
              <Award className="w-4 h-4" />
              <span>Built For Academic Success</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              Why Students Choose StudyNook
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400 text-base">
              Engineered to make finding quiet, high-efficiency campus workspaces instant and effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-6">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                Conflict-Free Time Engine
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Our smart conflict detection algorithm ensures zero double-booking. When you book a slot, it's 100% reserved exclusively for you.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                Verified Quiet Zones
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Every listed room is vetted for quiet standards, Wi-Fi speed, whiteboard access, and comfortable seating for ultimate productivity.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                Host & Manage Easily
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Library owners or student leaders can manage private study suites, update details anytime, and monitor total booking metrics from a personal dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EXTRA STATIC SECTION 2: HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 text-teal-600 dark:text-teal-400 text-sm font-bold uppercase tracking-wider mb-2">
            <Clock className="w-4 h-4" />
            <span>Seamless Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            How StudyNook Works
          </h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400 text-base">
            Reserve your quiet study space in under 60 seconds with three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center relative z-10 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-teal-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-6 shadow-md shadow-teal-600/30">
              1
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
              Browse & Filter Rooms
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Explore available library study rooms, filter by amenities (whiteboard, Wi-Fi, projector), capacity, or floor level.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center relative z-10 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-teal-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-6 shadow-md shadow-teal-600/30">
              2
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
              Select Date & Hourly Slot
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Pick your desired date and start/end time. Instant cost calculation dynamically updates based on room rate.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center relative z-10 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-teal-600 text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-6 shadow-md shadow-teal-600/30">
              3
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
              Confirm & Focus
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Receive your confirmed reservation instantly into your dashboard. Show up, unlock, and get into deep study mode!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
