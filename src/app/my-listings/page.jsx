"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";
import {
  List,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  BookmarkCheck,
  AlertCircle,
  Building2,
  X,
} from "lucide-react";

export default function MyListingsPage() {
  const { API_BASE_URL, getAuthHeaders } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  useEffect(() => {
    document.title = "StudyNook – My Listings";
  }, []);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/rooms/user/me`, {
        headers: { ...getAuthHeaders() },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setRooms(data);
      }
    } catch (error) {
      console.error("Failed to fetch my listings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, [API_BASE_URL]);

  const handleDeleteRoom = async () => {
    if (!deleteTarget) return;

    try {
      setDeleteSubmitting(true);
      const res = await fetch(`${API_BASE_URL}/api/rooms/${deleteTarget._id}`, {
        method: "DELETE",
        headers: { ...getAuthHeaders() },
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete room");
      }

      toast.success("Room deleted successfully");
      setRooms(rooms.filter((r) => r._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete room");
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 flex flex-col gap-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <List className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
                My Room Listings
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Manage your hosted study spaces, edit details, or view booking metrics.
              </p>
            </div>
          </div>

          <Link
            href="/add-room"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Room</span>
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner text="Fetching your study room listings..." />
        ) : rooms.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-8 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 dark:bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-4 shadow-sm">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
              No rooms listed yet
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm mx-auto">
              You haven't published any study room listings. Add a room now to start hosting students across campus!
            </p>
            <Link
              href="/add-room"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Your First Room</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-md text-emerald-400 text-xs font-extrabold px-3 py-1 rounded-full">
                    ${room.hourlyRate}/hr
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1">
                      <span>{room.floor}</span>
                      <span>•</span>
                      <span>Cap: {room.capacity} People</span>
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white line-clamp-1">
                      {room.name}
                    </h3>
                    <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-1 rounded-lg">
                      <BookmarkCheck className="w-3.5 h-3.5" />
                      <span>{room.bookingCount || 0} Total Bookings</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                    <Link
                      href={`/rooms/${room._id}`}
                      className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-4 h-4 text-teal-500" />
                      View
                    </Link>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/rooms/${room._id}`}
                        className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Edit className="w-4 h-4 text-teal-500" />
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(room)}
                        className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-md w-full p-6 border border-zinc-200 dark:border-zinc-800 shadow-2xl text-center">
              <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-2">
                Delete Listing?
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
                Are you sure you want to delete <span className="font-bold text-zinc-800 dark:text-zinc-200">"{deleteTarget.name}"</span>?
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="w-1/2 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteRoom}
                  disabled={deleteSubmitting}
                  className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md"
                >
                  {deleteSubmitting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
