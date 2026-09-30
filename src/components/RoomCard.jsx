"use client";

import Link from "next/link";
import { Users, Layers, DollarSign, Sparkles, ArrowRight } from "lucide-react";

export default function RoomCard({ room }) {
  const {
    _id,
    name,
    description,
    image,
    floor,
    capacity,
    hourlyRate,
    amenities = [],
  } = room;

  const truncatedDesc =
    description?.length > 100 ? `${description.slice(0, 100)}...` : description;

  const displayedAmenities = amenities.slice(0, 3);
  const extraCount = amenities.length - 3;

  return (
    <div className="group bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Image Container with Fixed Height */}
      <div className="relative h-52 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80";
          }}
        />
        <div className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-md text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
          <DollarSign className="w-3.5 h-3.5" />
          <span>{hourlyRate}/hr</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          {/* Header & Specs */}
          <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mb-2">
            <span className="flex items-center gap-1 font-medium bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg">
              <Layers className="w-3.5 h-3.5 text-teal-500" />
              {floor}
            </span>
            <span className="flex items-center gap-1 font-medium bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg">
              <Users className="w-3.5 h-3.5 text-teal-500" />
              {capacity} Seats
            </span>
          </div>

          <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
            {name}
          </h3>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
            {truncatedDesc}
          </p>
        </div>

        {/* Amenities & Action */}
        <div className="space-y-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
          {/* Amenities chips */}
          <div className="flex flex-wrap gap-1.5">
            {displayedAmenities.map((amenity, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded-md border border-teal-200/50 dark:border-teal-800/50"
              >
                {amenity}
              </span>
            ))}
            {extraCount > 0 && (
              <span className="text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-md">
                +{extraCount} more
              </span>
            )}
          </div>

          <Link
            href={`/rooms/${_id}`}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold hover:bg-teal-600 dark:hover:bg-teal-400 dark:hover:text-zinc-950 transition-colors group/btn shadow-sm"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
