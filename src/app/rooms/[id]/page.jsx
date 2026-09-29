"use client";

import { useEffect, useState, use } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../../../components/LoadingSpinner";
import toast from "react-hot-toast";
import {
  Layers,
  Users,
  DollarSign,
  Calendar,
  Clock,
  Sparkles,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  UserCheck,
  BookmarkCheck,
  Lock,
} from "lucide-react";

const AMENITY_OPTIONS = [
  "Whiteboard",
  "Projector",
  "Wi-Fi",
  "Power Outlets",
  "Quiet Zone",
  "Air Conditioning",
];

const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

export default function RoomDetailsPage({ params }) {
  // Next.js 15/16 params unwrap
  const resolvedParams = use(params);
  const roomId = resolvedParams.id;

  const { user, API_BASE_URL } = useAuth();
  const router = useRouter();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("11:00");
  const [specialNote, setSpecialNote] = useState("");
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    image: "",
    floor: "",
    capacity: 4,
    hourlyRate: 5,
    amenities: [],
  });
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  useEffect(() => {
    document.title = room ? `StudyNook – ${room.name}` : "StudyNook – Room Details";
  }, [room]);

  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/rooms/${roomId}`);
      if (res.ok) {
        const data = await res.json();
        setRoom(data);
        setEditForm({
          name: data.name,
          description: data.description,
          image: data.image,
          floor: data.floor,
          capacity: data.capacity,
          hourlyRate: data.hourlyRate,
          amenities: data.amenities || [],
        });
      } else {
        toast.error("Room not found");
        router.push("/rooms");
      }
    } catch (error) {
      console.error("Failed to load room details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomDetails();
  }, [roomId, API_BASE_URL]);

  if (loading) {
    return <LoadingSpinner text="Loading study room details..." />;
  }

  if (!room) {
    return null;
  }

  const isOwner =
    user && (user.id === room.ownerId || user.email === room.ownerEmail);

  // Calculation of hours and total cost
  const startHour = parseInt(startTime.split(":")[0]);
  const endHour = parseInt(endTime.split(":")[0]);
  const totalHours = Math.max(0, endHour - startHour);
  const totalCost = totalHours * (room.hourlyRate || 0);

  // Available End Times (strictly after start time)
  const availableEndTimes = TIME_SLOTS.filter(
    (slot) => parseInt(slot.split(":")[0]) > startHour
  );

  // Handle Book Now Click
  const handleBookNowClick = () => {
    if (!user) {
      toast.error("Please login to book a study room");
      router.push(`/login?redirect=${encodeURIComponent(`/rooms/${roomId}`)}`);
      return;
    }
    setBookingModalOpen(true);
  };

  // Submit Booking
  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (totalHours <= 0) {
      toast.error("End time must be after start time");
      return;
    }

    try {
      setBookingSubmitting(true);
      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: room._id,
          date: bookingDate,
          startTime,
          endTime,
          specialNote,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to book room");
      }

      toast.success("Room booked successfully!");
      setBookingModalOpen(false);
      // Increment local booking count
      setRoom((prev) => ({
        ...prev,
        bookingCount: (prev.bookingCount || 0) + 1,
      }));
    } catch (error) {
      toast.error(error.message || "Booking failed");
    } finally {
      setBookingSubmitting(false);
    }
  };

  // Submit Room Update (Edit)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setEditSubmitting(true);
      const res = await fetch(`${API_BASE_URL}/api/rooms/${room._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update room");
      }

      toast.success("Room updated successfully");
      setRoom(data.room);
      setEditModalOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to update room");
    } finally {
      setEditSubmitting(false);
    }
  };

  // Submit Delete Room
  const handleDeleteRoom = async () => {
    try {
      setDeleteSubmitting(true);
      const res = await fetch(`${API_BASE_URL}/api/rooms/${room._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete room");
      }

      toast.success("Room deleted successfully");
      router.push("/rooms");
    } catch (error) {
      toast.error(error.message || "Failed to delete room");
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const toggleEditAmenity = (amenity) => {
    if (editForm.amenities.includes(amenity)) {
      setEditForm({
        ...editForm,
        amenities: editForm.amenities.filter((a) => a !== amenity),
      });
    } else {
      setEditForm({
        ...editForm,
        amenities: [...editForm.amenities, amenity],
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 flex flex-col gap-8">
      {/* Top Banner / Image Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Image Card */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 group">
          <img
            src={room.image}
            alt={room.name}
            className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80";
            }}
          />

          <div className="absolute top-4 left-4 bg-teal-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
            <BookmarkCheck className="w-4 h-4" />
            <span>Booked {room.bookingCount || 0} times</span>
          </div>

          <div className="absolute top-4 right-4 bg-zinc-950/80 backdrop-blur-md text-emerald-400 text-sm font-extrabold px-4 py-2 rounded-full shadow-lg">
            ${room.hourlyRate}/hr
          </div>
        </div>

        {/* Right: Room Overview & Actions */}
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="inline-flex items-center gap-1 bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 text-xs font-bold px-3 py-1 rounded-xl">
                <Layers className="w-3.5 h-3.5" />
                {room.floor}
              </span>
              <span className="inline-flex items-center gap-1 bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 text-xs font-bold px-3 py-1 rounded-xl">
                <Users className="w-3.5 h-3.5" />
                Capacity: {room.capacity} People
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">
              {room.name}
            </h1>
          </div>

          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            {room.description}
          </p>

          {/* Owner Info Badge */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-600 dark:text-teal-300 font-bold shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-medium">Room Managed By</p>
              <p className="text-sm font-bold text-zinc-900 dark:text-white">
                {room.ownerName || "Library Administration"}
              </p>
            </div>
          </div>

          {/* Amenities Chips */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Included Amenities
            </h3>
            <div className="flex flex-wrap gap-2">
              {room.amenities?.map((amenity, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-3 py-1.5 rounded-xl"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-teal-500" />
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-3">
            {/* Book Now button */}
            <button
              onClick={handleBookNowClick}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>{user ? "Book Now" : "Login to Book"}</span>
            </button>

            {/* Owner Edit & Delete Buttons */}
            {isOwner && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditModalOpen(true)}
                  className="px-4 py-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-sm transition-colors flex items-center gap-1.5"
                >
                  <Edit className="w-4 h-4 text-teal-500" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteModalOpen(true)}
                  className="px-4 py-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 font-bold text-sm transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* BOOKING MODAL */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-1">
              Book {room.name}
            </h2>
            <p className="text-xs text-zinc-500 mb-6">
              Rate: <span className="font-bold text-teal-600">${room.hourlyRate}/hr</span>
            </p>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {/* Date Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                  Select Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              {/* Start & End Time Dropdowns */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                    Start Time
                  </label>
                  <select
                    value={startTime}
                    onChange={(e) => {
                      setStartTime(e.target.value);
                      const newStart = parseInt(e.target.value.split(":")[0]);
                      const newEnd = parseInt(endTime.split(":")[0]);
                      if (newEnd <= newStart) {
                        setEndTime(`${String(newStart + 1).padStart(2, "0")}:00`);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {TIME_SLOTS.slice(0, -1).map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                    End Time
                  </label>
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {availableEndTimes.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Real-time Calculated Cost */}
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/60 flex items-center justify-between">
                <div>
                  <p className="text-xs text-teal-700 dark:text-teal-300 font-semibold">
                    Duration: {totalHours} hour{totalHours > 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Calculated automatically (${room.hourlyRate} × {totalHours}h)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-teal-600 dark:text-teal-400">
                    ${totalCost}
                  </p>
                </div>
              </div>

              {/* Special Note */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                  Special Note / Requirements (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Need extra whiteboard markers or HDMI adapter..."
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                ></textarea>
              </div>

              {/* Actions */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(false)}
                  className="w-1/3 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingSubmitting}
                  className="w-2/3 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md disabled:opacity-50"
                >
                  {bookingSubmitting ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-2xl relative my-8">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-6">
              Edit Study Room
            </h2>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Room Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Floor
                  </label>
                  <input
                    type="text"
                    value={editForm.floor}
                    onChange={(e) => setEditForm({ ...editForm, floor: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Capacity (People)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editForm.capacity}
                    onChange={(e) => setEditForm({ ...editForm, capacity: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editForm.hourlyRate}
                    onChange={(e) => setEditForm({ ...editForm, hourlyRate: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={editForm.image}
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                  Amenities
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AMENITY_OPTIONS.map((amenity) => (
                    <label
                      key={amenity}
                      className="flex items-center gap-2 text-xs font-medium cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={editForm.amenities.includes(amenity)}
                        onChange={() => toggleEditAmenity(amenity)}
                        className="rounded text-teal-600"
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md"
                >
                  {editSubmitting ? "Saving..." : "Update Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-md w-full p-6 border border-zinc-200 dark:border-zinc-800 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-2">
              Delete Study Room?
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
              Are you sure you want to permanently remove <span className="font-bold text-zinc-800 dark:text-zinc-200">"{room.name}"</span>? All active bookings associated with this room will also be removed.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="w-1/2 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRoom}
                disabled={deleteSubmitting}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md"
              >
                {deleteSubmitting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
