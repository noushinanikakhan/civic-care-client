import React from "react";
import { Navigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import { authFetch } from "../../utils/authFetch";
import { API_BASE } from "../../utils/api";

const DashboardRedirect = () => {
  const { user, loading } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-profile", user?.email],
    enabled: !!user?.email && !loading,
    queryFn: async () => {
      const res = await authFetch(
        `${API_BASE}/users/profile/${encodeURIComponent(user.email)}`
      );

      // server returns JSON always, but handle safely
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json?.message || "Failed to load profile");
      }

      // ✅ your server returns: { success: true, user: {...} }
      return json.user;
    },
  });

  // ✅ prevent redirect while auth is loading
  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eff0e1]">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }

  // ✅ if profile failed to load, still send to citizen (safe fallback)
  if (isError || !data) {
    return <Navigate to="/dashboard/citizens" replace />;
  }

  const role = (data.role || "citizen").toLowerCase();

  if (role === "admin") return <Navigate to="/dashboard/admin" replace />;
  if (role === "staff") return <Navigate to="/dashboard/staff" replace />;

  return <Navigate to="/dashboard/citizens" replace />;
};

export default DashboardRedirect;
