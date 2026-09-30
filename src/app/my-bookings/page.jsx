"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";
import {
  BookmarkCheck,
  Calendar,
  Clock,
  DollarSign,
  AlertCircle,
  XCircle,
  CheckCircle2,
  Building2,
  Search,
} from "lucide-react";

export default function MyBookingsPage() {
  const { API_BASE_URL } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cancel Modal State
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelSubmitting, setCancelSubmitting] = useState(false);

  useEffect(() => {
    document.title = "StudyNook – My Bookings";
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/bookings/my`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(Array.isArray(data) ? data.filter((b) => b && b.status !== "cancelled") : []);
      }
    } catch (error) {
      console.error("Failed to fetch my bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, [API_BASE_URL]);

  const handleCancelBooking = async () => {
    if (!cancelTarget) return;

    try {
      setCancelSubmitting(true);
      const res = await fetch(
        `${API_BASE_URL}/api/bookings/${cancelTarget._id}/cancel`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to cancel booking");
      }

      toast.success("Booking cancelled and removed successfully!");
      // Immediately remove the cancelled booking from UI state
      setBookings((prev) => prev.filter((b) => b._id !== cancelTarget._id));
      setCancelTarget(null);
    } catch (error) {
      toast.error(error.message || "Failed to cancel booking");
    } finally {
      setCancelSubmitting(false);
    }
  };

  const isCancelable = (booking) => {
    if (booking.status !== "confirmed") return false;
    const today = new Date().toISOString().split("T")[0];
    return booking.date >= today;
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <BookmarkCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
                My Bookings
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Review your upcoming library study room reservations and track booking status.
              </p>
            </div>
          </div>

          <Link
            href="/rooms"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
          >
            <Search className="w-4 h-4" />
            <span>Book Another Room</span>
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner text="Fetching your study room reservations..." />
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-8 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 dark:bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-4 shadow-sm">
              <BookmarkCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
              You have no bookings yet.
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm mx-auto">
              Ready to focus? Browse available library study rooms and lock in your study schedule!
            </p>
            <Link
              href="/rooms"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-md"
            >
              <Search className="w-4 h-4" />
              <span>Browse Rooms</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const room = booking.room;
              const canCancel = isCancelable(booking);

              return (
                <div
                  key={booking._id}
                  className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-teal-500/40 transition-colors"
                >
                  {/* Room Thumb & Info */}
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        room?.image ||
                        "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={room?.name || "Study Room"}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-zinc-200 dark:border-zinc-800"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {booking.status === "confirmed" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            Confirmed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-2.5 py-0.5 rounded-full border border-rose-300 dark:border-rose-800">
                            <XCircle className="w-3 h-3" />
                            Cancelled
                          </span>
                        )}
                        {room?.floor && (
                          <span className="text-xs text-zinc-400 font-medium">
                            • {room.floor}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                        {room?.name || "Library Study Room"}
                      </h3>

                      <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-teal-500" />
                          {booking.date}
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-teal-500" />
                          {booking.startTime} - {booking.endTime}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-teal-600 dark:text-teal-400">
                          Total: ${booking.totalCost}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="w-full md:w-auto flex items-center justify-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-zinc-100 dark:border-zinc-800">
                    {room?.id && (
                      <Link
                        href={`/rooms/${room.id}`}
                        className="px-4 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition-colors"
                      >
                        Room Details
                      </Link>
                    )}

                    {canCancel && (
                      <button
                        onClick={() => setCancelTarget(booking)}
                        className="px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold transition-colors"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {cancelTarget && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-md w-full p-6 border border-zinc-200 dark:border-zinc-800 shadow-2xl text-center">
              <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-2">
                Cancel Reservation?
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
                Are you sure you want to cancel your booking for{" "}
                <span className="font-bold text-zinc-800 dark:text-zinc-200">
                  "{cancelTarget.room?.name || "this room"}"
                </span>{" "}
                on {cancelTarget.date} ({cancelTarget.startTime} - {cancelTarget.endTime})?
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setCancelTarget(null)}
                  className="w-1/2 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 font-bold text-xs"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancelBooking}
                  disabled={cancelSubmitting}
                  className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md"
                >
                  {cancelSubmitting ? "Cancelling..." : "Yes, Cancel"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
