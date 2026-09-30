"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BookOpen, Home, Search, AlertTriangle } from "lucide-react";

export default function NotFound() {
  useEffect(() => {
    document.title = "StudyNook – Page Not Found";
  }, []);

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-16 w-full">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400 mx-auto">
          <BookOpen className="w-12 h-12" />
        </div>
        <div className="absolute -top-2 -right-2 bg-rose-500 text-white p-2 rounded-full shadow-lg">
          <AlertTriangle className="w-5 h-5" />
        </div>
      </div>

      <h1 className="text-6xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2">
        404
      </h1>

      <h2 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200 mb-3">
        Page Not Found
      </h2>

      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed">
        Oops! The study room or page you are looking for might have been moved, renamed, or no longer exists in our library catalog.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md transition-all hover:scale-105"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <Link
          href="/rooms"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-sm transition-all"
        >
          <Search className="w-4 h-4 text-teal-500" />
          <span>Browse Available Rooms</span>
        </Link>
      </div>
    </div>
  );
}
