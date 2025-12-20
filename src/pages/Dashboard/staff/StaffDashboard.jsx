import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { API_BASE } from "../../../utils/api";
import { authFetch } from "../../../utils/authFetch";

const StaffDashboard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["staff-issues", "dashboard"],
    queryFn: async () => {
      const res = await authFetch(`${API_BASE}/staff/issues?status=all&priority=all`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to load staff issues");
      return json.issues || [];
    },
  });

  const issues = data || [];

  const stats = useMemo(() => {
    const totalAssigned = issues.length;

    const resolvedCount = issues.filter((i) => (i.status || "").toLowerCase() === "resolved").length;
    const closedCount = issues.filter((i) => (i.status || "").toLowerCase() === "closed").length;

    // “Today's Tasks” = issues updated today OR created today OR still actionable
    const today = new Date();
    const isSameDay = (d) => {
      if (!d) return false;
      const x = new Date(d);
      return (
        x.getFullYear() === today.getFullYear() &&
        x.getMonth() === today.getMonth() &&
        x.getDate() === today.getDate()
      );
    };

    const todaysTasks = issues.filter(
      (i) =>
        ["pending", "in-progress", "working"].includes((i.status || "").toLowerCase()) ||
        isSameDay(i.updatedAt) ||
        isSameDay(i.createdAt)
    ).length;

    const pending = issues.filter((i) => (i.status || "").toLowerCase() === "pending").length;
    const inProgress = issues.filter((i) => (i.status || "").toLowerCase() === "in-progress").length;
    const working = issues.filter((i) => (i.status || "").toLowerCase() === "working").length;

    return {
      totalAssigned,
      resolvedCount,
      closedCount,
      todaysTasks,
      pending,
      inProgress,
      working,
    };
  }, [issues]);

  const maxBar = Math.max(stats.pending, stats.inProgress, stats.working, stats.resolvedCount, 1);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eff0e1]">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#eff0e1] p-6 rounded-2xl">
        <p className="text-[#2d361b] font-semibold">Failed to load staff dashboard.</p>
      </div>
    );
  }

  return (
    <section className="bg-[#eff0e1] min-h-screen py-8">
      <div className="w-11/12 mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-[#2d361b]">Staff Dashboard</h1>
            <p className="text-[#2d361b]/70 mt-2">
              You can only view and update issues assigned to you.
            </p>
          </div>

          <Link
            to="/dashboard/staff/assigned-issues"
            className="btn rounded-2xl bg-[#2d361b] text-[#d6d37c]"
          >
            View Assigned Issues
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
            <p className="text-sm text-[#2d361b]/70">Assigned Issues</p>
            <p className="text-3xl font-bold text-[#2d361b] mt-2">{stats.totalAssigned}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
            <p className="text-sm text-[#2d361b]/70">Issues Resolved</p>
            <p className="text-3xl font-bold text-[#2d361b] mt-2">{stats.resolvedCount}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
            <p className="text-sm text-[#2d361b]/70">Today’s Tasks</p>
            <p className="text-3xl font-bold text-[#2d361b] mt-2">{stats.todaysTasks}</p>
          </div>
        </div>

        {/* Simple chart (no extra library) */}
        <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h3 className="text-xl font-semibold text-[#2d361b]">Status Breakdown</h3>
            <p className="text-sm text-[#2d361b]/70">
              Bars represent counts of your assigned issues.
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {[
              { label: "Pending", value: stats.pending },
              { label: "In Progress", value: stats.inProgress },
              { label: "Working", value: stats.working },
              { label: "Resolved", value: stats.resolvedCount },
              { label: "Closed", value: stats.closedCount },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <div className="w-24 text-sm text-[#2d361b]">{row.label}</div>
                <div className="flex-1 bg-[#eff0e1] rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 bg-[#2d361b]"
                    style={{ width: `${Math.round((row.value / maxBar) * 100)}%` }}
                  />
                </div>
                <div className="w-10 text-right text-sm text-[#2d361b]/80">{row.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/dashboard/staff/profile"
            className="bg-white rounded-2xl p-6 border border-[#2d361b]/10 hover:shadow transition"
          >
            <h4 className="text-lg font-semibold text-[#2d361b]">Profile</h4>
            <p className="text-[#2d361b]/70 mt-2">Update your name and photo.</p>
          </Link>

          <Link
            to="/dashboard/staff/assigned-issues"
            className="bg-white rounded-2xl p-6 border border-[#2d361b]/10 hover:shadow transition"
          >
            <h4 className="text-lg font-semibold text-[#2d361b]">Assigned Issues</h4>
            <p className="text-[#2d361b]/70 mt-2">Change status with required workflow.</p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default StaffDashboard;
