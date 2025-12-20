import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "../../../utils/api";
import { authFetch } from "../../../utils/authFetch";

const STATUS_FLOW = {
  pending: ["in-progress"],
  "in-progress": ["working"],
  working: ["resolved"],
  resolved: ["closed"],
  closed: [],
};

const StaffAssignedIssues = () => {
  const qc = useQueryClient();

  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["staff-issues", { status, priority }],
    queryFn: async () => {
      const qs = new URLSearchParams({
        status,
        priority,
      }).toString();

      const res = await authFetch(`${API_BASE}/staff/issues?${qs}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to load assigned issues");
      return json.issues || [];
    },
  });

  const issues = useMemo(() => {
    const list = data || [];
    // Boosted/high first, then recent
    return [...list].sort((a, b) => {
      const ap = (a.priority || "").toLowerCase() === "high" ? 1 : 0;
      const bp = (b.priority || "").toLowerCase() === "high" ? 1 : 0;
      if (bp !== ap) return bp - ap;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [data]);

  const statusMutation = useMutation({
    mutationFn: async ({ id, nextStatus }) => {
      const res = await authFetch(`${API_BASE}/staff/issues/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to update status");
      return json;
    },

    // ✅ optimistic UI update
    onMutate: async ({ id, nextStatus }) => {
      await qc.cancelQueries({ queryKey: ["staff-issues"] });

      const previous = qc.getQueriesData({ queryKey: ["staff-issues"] });

      // update all staff-issues cache variants
      previous.forEach(([key, old]) => {
        if (!Array.isArray(old)) return;
        const updated = old.map((it) =>
          String(it._id) === String(id) ? { ...it, status: nextStatus, updatedAt: new Date().toISOString() } : it
        );
        qc.setQueryData(key, updated);
      });

      return { previous };
    },
    onError: (err, _vars, ctx) => {
      // rollback
      if (ctx?.previous) {
        ctx.previous.forEach(([key, data]) => qc.setQueryData(key, data));
      }
      Swal.fire({ icon: "error", title: "Failed", text: err.message, confirmButtonColor: "#2d361b" });
    },
    onSuccess: async () => {
      Swal.fire({ icon: "success", title: "Updated!", timer: 900, showConfirmButton: false });
      await refetch();
    },
  });

  const handleChangeStatus = async (issue, nextStatus) => {
    const current = (issue.status || "pending").toLowerCase();

    const allowed = STATUS_FLOW[current] || [];
    if (!allowed.includes(nextStatus)) {
      Swal.fire({
        icon: "warning",
        title: "Not Allowed",
        text: `You can only change ${current} → ${allowed[0] || "N/A"}`,
        confirmButtonColor: "#2d361b",
      });
      return;
    }

    const ok = await Swal.fire({
      icon: "question",
      title: "Change status?",
      text: `Update "${issue.title}" to "${nextStatus}"`,
      showCancelButton: true,
      confirmButtonColor: "#2d361b",
      confirmButtonText: "Yes, Update",
    });

    if (!ok.isConfirmed) return;

    statusMutation.mutate({ id: issue._id, nextStatus });
  };

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
        <p className="text-[#2d361b] font-semibold">Failed to load assigned issues.</p>
      </div>
    );
  }

  return (
    <section className="bg-[#eff0e1] min-h-screen py-8">
      <div className="w-11/12 mx-auto space-y-5">
        <div>
          <h1 className="text-3xl font-bold text-[#2d361b]">Assigned Issues</h1>
          <p className="text-[#2d361b]/70 mt-2">
            You can only update issues assigned to you. High priority issues stay on top.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-[#2d361b]/10 p-4 flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#2d361b]/70">Status</span>
            <select
              className="select select-sm rounded-xl"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="working">Working</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-[#2d361b]/70">Priority</span>
            <select
              className="select select-sm rounded-xl"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="all">All</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
            </select>
          </div>

          <div className="ml-auto text-sm text-[#2d361b]/70">
            Showing <span className="font-semibold text-[#2d361b]">{issues.length}</span> issues
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#2d361b]/10 overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="text-[#2d361b]">
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Location</th>
                <th className="text-right">Change Status</th>
              </tr>
            </thead>

            <tbody>
              {issues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#2d361b]/70">
                    No assigned issues found.
                  </td>
                </tr>
              ) : (
                issues.map((issue) => {
                  const current = (issue.status || "pending").toLowerCase();
                  const nextOptions = STATUS_FLOW[current] || [];

                  return (
                    <tr key={issue._id}>
                      <td className="font-semibold text-[#2d361b]">{issue.title}</td>
                      <td>{issue.category}</td>
                      <td>
                        <span className="badge badge-ghost">{issue.status || "pending"}</span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            (issue.priority || "").toLowerCase() === "high"
                              ? "badge-warning"
                              : "badge-ghost"
                          }`}
                        >
                          {issue.priority || "normal"}
                        </span>
                      </td>
                      <td>{issue.location}</td>
                      <td className="text-right">
                        {nextOptions.length === 0 ? (
                          <span className="text-sm text-[#2d361b]/60">No further actions</span>
                        ) : (
                          <select
                            className="select select-sm rounded-xl"
                            defaultValue=""
                            onChange={(e) => {
                              const v = e.target.value;
                              if (!v) return;
                              e.target.value = "";
                              handleChangeStatus(issue, v);
                            }}
                            disabled={statusMutation.isPending}
                          >
                            <option value="" disabled>
                              Select...
                            </option>
                            {nextOptions.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default StaffAssignedIssues;
