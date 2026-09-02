"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/AuthContext";

export default function RequireRole({ role, children }) {
  const { role: currentRole, isAuthenticated, initializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initializing) return;

    if (!isAuthenticated) {
      router.replace("/");
      return;
    }

    if (currentRole !== role) {
      router.replace("/");
    }
  }, [initializing, isAuthenticated, currentRole, role, router]);

  if (initializing || !isAuthenticated || currentRole !== role) {
    return null;
  }

  return children;
}
