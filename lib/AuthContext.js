"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  changePasswordRequest,
  fetchUserProfile,
  getRoleFromToken,
  loginRequest,
  normalizeRole,
  signupRequest,
} from "./api";

const AuthContext = createContext(null);

const TOKEN_KEY = "iqac_token";
const USER_KEY = "iqac_user";

export function roleToPath(role) {
  if (role === "iqac_coordinator") return "/iqac-coordinator/home";
  if (role === "hod") return "/hod/home";
  return "/";
}

export function AuthProvider({ children }) {
  const router = useRouter();

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  // "loading" until we've checked localStorage for an existing session
  const [initializing, setInitializing] = useState(true);

  /* -----------------------------------------------------
     On mount: restore session from localStorage, then
     refresh the profile from /users/me (mirrors
     checkExistingSession() in the original script.js)
  ----------------------------------------------------- */
  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUserRaw = localStorage.getItem(USER_KEY);

      let storedUser = null;
      if (storedUserRaw) {
        try {
          storedUser = JSON.parse(storedUserRaw);
        } catch (error) {
          console.warn("Stored user data is invalid.", error);
          localStorage.removeItem(USER_KEY);
        }
      }

      let currentRole = storedUser?.role;
      if (!currentRole && storedToken) {
        currentRole = getRoleFromToken(storedToken);
      }

      if (!currentRole) {
        if (!cancelled) setInitializing(false);
        return;
      }

      if (!cancelled) {
        setToken(storedToken);
        setUser(storedUser);
        setRole(normalizeRole(currentRole));
      }

      const profile = await fetchUserProfile(storedToken);
      if (!cancelled && profile) {
        const freshRole = normalizeRole(profile.role || currentRole);
        setUser(profile);
        setRole(freshRole);
        localStorage.setItem(USER_KEY, JSON.stringify(profile));
      }

      if (!cancelled) setInitializing(false);
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const persistSession = useCallback((newToken, newUser) => {
    if (newToken) localStorage.setItem(TOKEN_KEY, newToken);
    if (newUser) localStorage.setItem(USER_KEY, JSON.stringify(newUser));
  }, []);

  const login = useCallback(
    async (email, password) => {
      const result = await loginRequest(email, password);
      let { token: newToken, user: newUser, role: newRole } = result;

      persistSession(newToken, newUser);

      // Fetch a fresh profile after login, same as the original app
      const profile = await fetchUserProfile(newToken);
      if (profile) {
        newUser = profile;
        newRole = normalizeRole(profile.role || newRole);
        persistSession(newToken, newUser);
      }

      setToken(newToken);
      setUser(newUser);
      setRole(newRole);

      router.push(roleToPath(newRole));

      return { token: newToken, user: newUser, role: newRole };
    },
    [persistSession, router]
  );

  const signup = useCallback(async (name, email, password) => {
    return signupRequest(name, email, password);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    setRole(null);
    router.push("/");
  }, [router]);

  const changePassword = useCallback(
    async (currentPassword, newPassword) => {
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }
      return changePasswordRequest(token, currentPassword, newPassword);
    },
    [token]
  );

  const value = {
    token,
    user,
    role,
    initializing,
    isAuthenticated: Boolean(role),
    login,
    signup,
    logout,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
