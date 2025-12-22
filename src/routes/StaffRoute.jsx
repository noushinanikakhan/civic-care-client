import React from "react";
import { Navigate, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";
// import { API_BASE } from "../utils/api";
import { authFetch } from "../utils/authFetch";
import { API_BASE } from "../utils/api";

const StaffRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const { data, isLoading } = useQuery({
    queryKey: ["role-check", user?.email],
    enabled: !!user?.email && !loading,
    queryFn: async () => {
      const res = await authFetch(`${API_BASE}/users/profile/${encodeURIComponent(user.email)}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to load profile");
      return json.user;
    },
  });

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eff0e1]">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;

  const role = (data?.role || "citizen").toLowerCase();
  if (role !== "staff") return <Navigate to="/dashboard" replace />;

  return children;
};

export default StaffRoute;
