"use client";

import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ text = "Loading StudyNook rooms..." }) {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8 w-full">
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-4 border-teal-200 dark:border-teal-900 border-t-teal-600 animate-spin"></div>
        <Loader2 className="w-6 h-6 text-teal-600 absolute animate-pulse" />
      </div>
      <p className="mt-4 text-sm font-medium text-zinc-600 dark:text-zinc-400 animate-pulse">
        {text}
      </p>
    </div>
  );
}

export function RoomCardSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-5 animate-pulse flex flex-col h-[400px]">
      <div className="w-full h-48 bg-zinc-200 dark:bg-zinc-800 rounded-2xl mb-4"></div>
      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3 mb-2"></div>
      <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4 mb-3"></div>
      <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-full mb-1"></div>
      <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6 mb-4"></div>
      <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between">
        <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2"></div>
        <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3"></div>
      </div>
    </div>
  );
}
