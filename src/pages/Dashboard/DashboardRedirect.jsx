import React from "react";
import { Navigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import { API_BASE } from "../../utils/api";

const DashboardRedirect = () => {
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["user-profile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await fetch(
        `${API_BASE}/users/profile/${encodeURIComponent(user.email)}`
      );
      if (!res.ok) throw new Error("Failed to load profile");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eff0e1]">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }

  const role = (profile?.role || "citizen").toLowerCase();

  if (role === "admin") return <Navigate to="/dashboard/admin" replace />;
  if (role === "staff") return <Navigate to="/dashboard/staff" replace />;

  return <Navigate to="/dashboard/citizens" replace />;
};

export default DashboardRedirect;
