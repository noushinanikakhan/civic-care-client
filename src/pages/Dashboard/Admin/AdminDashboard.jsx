import React from "react";
import { useQuery } from "@tanstack/react-query";
import { API_BASE } from "../../../utils/api";
import { authFetch } from "../../../utils/authFetch";

const AdminDashboard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await authFetch(`${API_BASE}/admin/stats`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to load admin stats");
      return json;
    },
  });

  // ✅ NEW: latest payments
  const {
    data: paymentsData,
    isLoading: payLoading,
    isError: payError,
  } = useQuery({
    queryKey: ["admin-latest-payments"],
    queryFn: async () => {
      const res = await authFetch(`${API_BASE}/admin/payments`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to load payments");
      return json;
    },
  });

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
        <p className="text-[#2d361b] font-semibold">Failed to load admin dashboard.</p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const issueStats = stats.issues || {};
  const paymentStats = stats.payments || { totalAmount: 0 };

  const recentIssues = data?.recentIssues || [];
  const recentUsers = data?.recentUsers || [];

  // ✅ NEW: latest payments list
  const latestPayments = paymentsData?.payments?.slice(0, 6) || [];

  return (
    <section className="bg-[#eff0e1] min-h-screen py-8">
      <div className="w-11/12 mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#2d361b]">Admin Dashboard</h1>
          <p className="text-[#2d361b]/70 mt-2">System overview and latest activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
            <p className="text-sm text-[#2d361b]/70">Total Issues</p>
            <p className="text-3xl font-bold text-[#2d361b] mt-2">{issueStats.total || 0}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
            <p className="text-sm text-[#2d361b]/70">Pending</p>
            <p className="text-3xl font-bold text-[#2d361b] mt-2">{issueStats.pending || 0}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
            <p className="text-sm text-[#2d361b]/70">Resolved</p>
            <p className="text-3xl font-bold text-[#2d361b] mt-2">{issueStats.resolved || 0}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
            <p className="text-sm text-[#2d361b]/70">Rejected</p>
            <p className="text-3xl font-bold text-[#2d361b] mt-2">{issueStats.rejected || 0}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
            <p className="text-sm text-[#2d361b]/70">Total Payments</p>
            <p className="text-3xl font-bold text-[#2d361b] mt-2">
              ৳{paymentStats.totalAmount || 0}
            </p>
          </div>
        </div>

        {/* Latest sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Issues */}
          <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
            <h3 className="text-xl font-semibold text-[#2d361b] mb-4">Latest Issues</h3>
            <div className="space-y-3">
              {recentIssues.length === 0 ? (
                <p className="text-[#2d361b]/70">No recent issues found.</p>
              ) : (
                recentIssues.slice(0, 6).map((i) => (
                  <div key={i._id} className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#2d361b]">{i.title}</p>
                      <p className="text-sm text-[#2d361b]/70">
                        {i.category} • {i.location} • {i.status}
                      </p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full border border-[#2d361b]/15">
                      {i.priority || "normal"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
            <h3 className="text-xl font-semibold text-[#2d361b] mb-4">Latest Users</h3>
            <div className="space-y-3">
              {recentUsers.length === 0 ? (
                <p className="text-[#2d361b]/70">No recent users found.</p>
              ) : (
                recentUsers.slice(0, 6).map((u) => (
                  <div key={u._id} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#2d361b]">{u.name || "Unnamed"}</p>
                      <p className="text-sm text-[#2d361b]/70">{u.email}</p>
                    </div>
                    <div className="text-xs flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full border border-[#2d361b]/15">
                        {u.role}
                      </span>
                      <span className="px-3 py-1 rounded-full border border-[#2d361b]/15">
                        {u.isPremium ? "premium" : "free"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ✅ Latest Payments (dynamic) */}
        <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
          <h3 className="text-xl font-semibold text-[#2d361b] mb-4">Latest Payments</h3>

          {payLoading ? (
            <span className="loading loading-infinity loading-md"></span>
          ) : payError ? (
            <p className="text-[#2d361b]/70">Failed to load latest payments.</p>
          ) : latestPayments.length === 0 ? (
            <p className="text-[#2d361b]/70">No payments found yet.</p>
          ) : (
            <div className="space-y-3">
              {latestPayments.map((p) => (
                <div key={p._id} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[#2d361b]">{p.email}</p>
                    <p className="text-sm text-[#2d361b]/70">
                      {p.method || "assignment"} • TRX: {p.transactionId || "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#2d361b]">৳{p.amount || 0}</p>
                    <p className="text-xs text-[#2d361b]/60">
                      {p.createdAt ? new Date(p.createdAt).toLocaleString() : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
