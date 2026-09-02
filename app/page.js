"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, roleToPath } from "../lib/AuthContext";
import AuthPage from "../components/AuthPage";

export default function HomePage() {
  const { isAuthenticated, role, initializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!initializing && isAuthenticated) {
      router.replace(roleToPath(role));
    }
  }, [initializing, isAuthenticated, role, router]);

  if (initializing || isAuthenticated) {
    // Avoid flashing the login form while we check for an existing session
    // or while redirecting to the user's dashboard.
    return null;
  }

  return <AuthPage />;
}
