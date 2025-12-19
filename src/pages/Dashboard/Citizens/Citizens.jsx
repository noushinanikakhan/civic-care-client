import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import { API_BASE } from "../../../utils/api";

const Citizens = () => {
  const { user } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["citizen-stats", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      // get all my issues (limit high; or call multiple pages if needed later)
      const res = await fetch(`${API_BASE}/issues?reportedBy=${encodeURIComponent(user.email)}&page=1&limit=50`);
      if (!res.ok) throw new Error("Failed to load stats");
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

  if (isError) {
    return (
      <div className="bg-[#eff0e1] p-6 rounded-2xl">
        <p className="text-[#2d361b] font-semibold">Failed to load dashboard stats.</p>
      </div>
    );
  }

  const issues = data?.issues || [];
  const total = issues.length;
  const pending = issues.filter(i => (i.status || "").toLowerCase() === "pending").length;
  const inProgress = issues.filter(i => (i.status || "").toLowerCase() === "in-progress").length;
  const resolved = issues.filter(i => (i.status || "").toLowerCase() === "resolved").length;

  // payment will be implemented later, keep 0 for now
  const totalPayments = 0;

  return (
    <section className="bg-[#eff0e1] min-h-screen py-8">
      <div className="w-11/12 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2d361b]">Citizen Dashboard</h1>
          <p className="text-[#2d361b]/70 mt-2">Overview of your reported issues</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
            <p className="text-sm text-[#2d361b]/70">Total Issues</p>
            <p className="text-3xl font-bold text-[#2d361b] mt-2">{total}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
            <p className="text-sm text-[#2d361b]/70">Pending</p>
            <p className="text-3xl font-bold text-[#2d361b] mt-2">{pending}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
            <p className="text-sm text-[#2d361b]/70">In Progress</p>
            <p className="text-3xl font-bold text-[#2d361b] mt-2">{inProgress}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
            <p className="text-sm text-[#2d361b]/70">Resolved</p>
            <p className="text-3xl font-bold text-[#2d361b] mt-2">{resolved}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
            <p className="text-sm text-[#2d361b]/70">Total Payments</p>
            <p className="text-3xl font-bold text-[#2d361b] mt-2">{totalPayments} tk</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Citizens;
