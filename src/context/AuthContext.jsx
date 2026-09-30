"use client";

import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "../lib/auth-client";
import { generateAvatarSvg, getSafeUserPhoto } from "../lib/avatar";

const AuthContext = createContext();

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
const CACHE_KEY = "studynook_user_session";

export function AuthProvider({ children }) {
  // Initialize from localStorage cache for instant (0ms) render with no photo flickering
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.email) {
            return {
              ...parsed,
              photoURL: getSafeUserPhoto(parsed),
              image: getSafeUserPhoto(parsed),
            };
          }
        }
      } catch (e) {}
    }
    return null;
  });

  const [loading, setLoading] = useState(true);

  // Request JWT token from backend and sync into browser cookies
  const syncJwtWithBackend = async (userData) => {
    if (!userData || !userData.email) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          photoURL: userData.photoURL || userData.image,
        }),
      });
      const data = await res.json();
      if (data?.token && typeof document !== "undefined") {
        // Explicitly set cookie so it appears under http://localhost:3000 in DevTools -> Application -> Cookies
        document.cookie = `token=${data.token}; path=/; max-age=604800; SameSite=Lax`;
      }
    } catch (e) {
      console.warn("JWT sync error:", e);
    }
  };

  // Helper to persist user to state and localStorage
  const saveUserState = (u) => {
    if (!u) {
      setUser(null);
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(CACHE_KEY);
          document.cookie = "token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        } catch (e) {}
      }
      return null;
    }

    const safePhoto = getSafeUserPhoto(u);
    const normalizedUser = {
      id: u.id || u._id,
      name: u.name || "User",
      email: u.email,
      photoURL: safePhoto,
      image: safePhoto,
    };

    setUser(normalizedUser);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(normalizedUser));
      } catch (e) {}
    }

    // Automatically issue JWT token and store in Cookies
    syncJwtWithBackend(normalizedUser);

    return normalizedUser;
  };

  // Synchronize Better Auth session into user state
  const syncSession = async () => {
    try {
      setLoading(true);
      const sessionResult = await authClient.getSession();
      if (sessionResult?.data?.user) {
        const normalized = saveUserState(sessionResult.data.user);
      } else {
        // Fallback: check Express backend /api/auth/me
        try {
          const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
            credentials: "include",
          });
          if (res.ok) {
            const data = await res.json();
            if (data?.user) {
              saveUserState(data.user);
            } else {
              saveUserState(null);
            }
          } else {
            saveUserState(null);
          }
        } catch {
          saveUserState(null);
        }
      }
    } catch (error) {
      console.error("Auth session sync error:", error);
      saveUserState(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncSession();
  }, []);

  // Login with Better Auth (Email & Password)
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        throw new Error(error.message || "Invalid email or password");
      }

      const normalized = saveUserState(data.user);
      toast.success("Welcome back! Login successful.");
      return { success: true, user: normalized };
    } catch (error) {
      toast.error(error.message || "Login failed. Please try again.");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Google Login via Better Auth
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const callbackURL = typeof window !== "undefined" ? `${window.location.origin}/` : "/";
      await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });
      return { success: true };
    } catch (error) {
      toast.error(error.message || "Google sign-in failed.");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Register with Better Auth (Email & Password)
  const register = async (name, email, photoURL, password) => {
    try {
      setLoading(true);
      const avatar =
        photoURL && photoURL.trim() !== ""
          ? photoURL.trim()
          : generateAvatarSvg(name);

      const { data, error } = await authClient.signUp.email({
        email: email.trim().toLowerCase(),
        password,
        name: name.trim(),
        image: avatar,
      });

      if (error) {
        throw new Error(error.message || "Registration failed");
      }

      if (data?.user) {
        const normalized = saveUserState({
          ...data.user,
          image: data.user.image || avatar,
          photoURL: data.user.image || avatar,
        });
        toast.success("Registration successful! Welcome to StudyNook.");
        return { success: true, user: normalized };
      }

      await syncSession();
      toast.success("Registration successful! Welcome to StudyNook.");
      return { success: true };
    } catch (error) {
      toast.error(error.message || "Registration failed.");
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout with Better Auth
  const logout = async () => {
    try {
      setLoading(true);
      saveUserState(null);
      await authClient.signOut();
      try {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: "POST",
          credentials: "include",
        });
      } catch (e) {}
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
        register,
        logout,
        checkAuthStatus: syncSession,
        API_BASE_URL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
