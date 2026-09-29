"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  BookOpen,
  Sun,
  Moon,
  LogOut,
  PlusCircle,
  List,
  BookmarkCheck,
  Menu,
  X as CloseIcon,
  ChevronDown,
} from "lucide-react";
import UserAvatar from "./UserAvatar";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path) => pathname === path;

  const defaultAvatar = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=0D9488&color=fff`;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform duration-200">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 via-teal-900 to-emerald-800 dark:from-white dark:via-zinc-200 dark:to-teal-300 bg-clip-text text-transparent">
            StudyNook
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive("/")
                ? "bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 font-semibold"
                : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
            }`}
          >
            Home
          </Link>
          <Link
            href="/rooms"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive("/rooms")
                ? "bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 font-semibold"
                : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
            }`}
          >
            Rooms
          </Link>

          {user && (
            <>
              <Link
                href="/add-room"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive("/add-room")
                    ? "bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 font-semibold"
                    : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                Add Room
              </Link>
              <Link
                href="/my-listings"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive("/my-listings")
                    ? "bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 font-semibold"
                    : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                }`}
              >
                <List className="w-4 h-4" />
                My Listings
              </Link>
              <Link
                href="/my-bookings"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive("/my-bookings")
                    ? "bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 font-semibold"
                    : "text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                }`}
              >
                <BookmarkCheck className="w-4 h-4" />
                My Bookings
              </Link>
            </>
          )}
        </nav>

        {/* Right Section: Theme Toggle & User Auth */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-zinc-700" />
            )}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <UserAvatar user={user} className="w-9 h-9 rounded-full object-cover border-2 border-teal-500 shadow-sm" />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200 max-w-[120px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-4 h-4 text-zinc-500" />
              </button>

              {dropdownOpen && (
                <div
                  onMouseLeave={() => setDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">Signed in as</p>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{user.email}</p>
                  </div>

                  <Link
                    href="/add-room"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:text-teal-600 transition-colors"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Add Room
                  </Link>
                  <Link
                    href="/my-listings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:text-teal-600 transition-colors"
                  >
                    <List className="w-4 h-4" />
                    My Listings
                  </Link>
                  <Link
                    href="/my-bookings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-teal-50 dark:hover:bg-teal-950/40 hover:text-teal-600 transition-colors"
                  >
                    <BookmarkCheck className="w-4 h-4" />
                    My Bookings
                  </Link>

                  <div className="border-t border-zinc-100 dark:border-zinc-800 my-1"></div>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 rounded-xl shadow-md shadow-teal-600/20 transition-all hover:scale-[1.02]"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-zinc-700" />
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-4 py-4 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-2.5 rounded-xl text-base font-medium ${
              isActive("/") ? "bg-teal-50 dark:bg-teal-950 text-teal-600" : "text-zinc-700 dark:text-zinc-200"
            }`}
          >
            Home
          </Link>
          <Link
            href="/rooms"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-2.5 rounded-xl text-base font-medium ${
              isActive("/rooms") ? "bg-teal-50 dark:bg-teal-950 text-teal-600" : "text-zinc-700 dark:text-zinc-200"
            }`}
          >
            Rooms
          </Link>

          {user ? (
            <>
              <Link
                href="/add-room"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-base font-medium text-zinc-700 dark:text-zinc-200"
              >
                Add Room
              </Link>
              <Link
                href="/my-listings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-base font-medium text-zinc-700 dark:text-zinc-200"
              >
                My Listings
              </Link>
              <Link
                href="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-base font-medium text-zinc-700 dark:text-zinc-200"
              >
                My Bookings
              </Link>

              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3 px-4 py-2">
                  <UserAvatar user={user} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-zinc-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2.5 mt-2 rounded-xl text-base font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  Log Out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 text-base font-medium text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 rounded-xl"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 text-base font-semibold text-white bg-teal-600 rounded-xl"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
