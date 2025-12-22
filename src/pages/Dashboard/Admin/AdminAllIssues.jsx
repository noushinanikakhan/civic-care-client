import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import { authFetch } from "../../../utils/authFetch";
import { API_BASE } from "../../../utils/api";

const AdminAllIssues = () => {
  const { user, loading } = useAuth();
  const qc = useQueryClient();

  const [page, setPage] = useState(1);
  const limit = 10;

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedStaffEmail, setSelectedStaffEmail] = useState("");

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-issues", user?.email, page, limit],
    enabled: !loading && !!user?.email, // ✅ wait until auth is ready + user exists
    queryFn: async () => {
      const res = await authFetch(
        `${API_BASE}/admin/issues?page=${page}&limit=${limit}`
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to load issues");
      return json;
    },
  });

  const { data: staffData } = useQuery({
    queryKey: ["admin-staff-list", user?.email],
    enabled: !loading && !!user?.email, // ✅ same here
    queryFn: async () => {
      const res = await authFetch(`${API_BASE}/admin/staff`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to load staff");
      return json;
    },
  });

  const issues = useMemo(() => data?.issues || [], [data]);
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const staffList = staffData?.staff || [];

  const assignMutation = useMutation({
    mutationFn: async ({ issueId, staffEmail }) => {
      const res = await authFetch(
        `${API_BASE}/admin/issues/${issueId}/assign-staff`,
        {
          method: "PATCH",
          body: JSON.stringify({ staffEmail }),
        }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to assign staff");
      return json;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin-issues"] });
      setAssignModalOpen(false);
      setSelectedIssue(null);
      setSelectedStaffEmail("");
      Swal.fire({
        icon: "success",
        title: "Assigned!",
        timer: 1200,
        showConfirmButton: false,
      });
    },
    onError: (err) =>
      Swal.fire({ icon: "error", title: "Assign failed", text: err.message }),
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ issueId }) => {
      const res = await authFetch(
        `${API_BASE}/admin/issues/${issueId}/reject`,
        { method: "PATCH" }
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to reject issue");
      return json;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin-issues"] });
      Swal.fire({
        icon: "success",
        title: "Rejected!",
        timer: 1200,
        showConfirmButton: false,
      });
    },
    onError: (err) =>
      Swal.fire({ icon: "error", title: "Reject failed", text: err.message }),
  });

  const openAssignModal = (issue) => {
    setSelectedIssue(issue);
    setAssignModalOpen(true);
  };

  const handleConfirmAssign = () => {
    if (!selectedIssue?._id) return;
    if (!selectedStaffEmail) {
      Swal.fire({ icon: "warning", title: "Select a staff member first" });
      return;
    }
    assignMutation.mutate({
      issueId: selectedIssue._id,
      staffEmail: selectedStaffEmail,
    });
  };

  const handleReject = async (issue) => {
    const ok = await Swal.fire({
      icon: "warning",
      title: "Reject this issue?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Yes, reject",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#2d361b",
    });

    if (ok.isConfirmed) {
      rejectMutation.mutate({ issueId: issue._id });
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eff0e1]">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="bg-[#eff0e1] min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-[#2d361b]/10 p-6 max-w-xl w-full">
          <h2 className="text-xl font-bold text-[#2d361b]">Failed to load issues</h2>
          <p className="text-[#2d361b]/70 mt-2">{error?.message}</p>
          <p className="text-[#2d361b]/60 mt-3 text-sm">
            If this says “Admin access required” — your DB role is not admin for this email.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-[#eff0e1] min-h-screen">
      <div className="w-11/12 mx-auto space-y-5">
        <div>
          <h1 className="text-3xl font-bold text-[#2d361b]">All Issues</h1>
          <p className="text-[#2d361b]/70 mt-2">
            Boosted (high priority) issues should appear above normal.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#2d361b]/10 overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="text-[#2d361b]">
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assigned Staff</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {issues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#2d361b]/70">
                    No issues found.
                  </td>
                </tr>
              ) : (
                issues.map((issue) => {
    const hasStaff = !!issue.assignedTo?.email;
  const status = (issue.status || "pending").toLowerCase();
const isPending = status === "pending";
const isRejected = status === "rejected";                
                  return (
                    <tr key={issue._id}>
                      <td className="font-semibold text-[#2d361b]">{issue.title}</td>
                      <td>{issue.category}</td>
                      <td>
                        <span className="badge badge-ghost">{issue.status}</span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            issue.priority === "high" ? "badge-warning" : "badge-ghost"
                          }`}
                        >
                          {issue.priority || "normal"}
                        </span>
                      </td>
                      <td>
                        {hasStaff ? (
                          <span className="text-[#2d361b]">
                            {issue.assignedTo.name || issue.assignedTo.email}
                          </span>
                        ) : (
                          <span className="text-[#2d361b]/60">Not assigned</span>
                        )}
                      </td>
     <td className="text-right space-x-2">
  {/* ✅ If rejected → hide both buttons */}
  {!isRejected && (
    <>
      {/* ✅ Assign button always visible (until rejected) 
          - clickable only when pending + not assigned
          - disabled when assigned or not pending */}
      <button
        className="btn btn-sm bg-[#2d361b] text-[#d6d37c] rounded-xl"
        onClick={() => openAssignModal(issue)}
        disabled={!isPending || hasStaff || assignMutation?.isPending}
        title={
          !isPending
            ? "Only pending issues can be assigned"
            : hasStaff
            ? "Already assigned"
            : ""
        }
      >
        Assign Staff
      </button>

      {/* ✅ Reject button only when pending + not assigned */}
      {isPending && !hasStaff && (
        <button
          className="btn btn-sm btn-error rounded-xl"
          onClick={() => handleReject(issue)}
          disabled={rejectMutation.isPending}
        >
          Reject
        </button>
      )}
    </>
  )}
</td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[#2d361b]/70">
            Page {page} of {totalPages}
          </p>
          <div className="join">
            <button
              className="btn join-item"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <button
              className="btn join-item"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>

        {assignModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white w-full max-w-lg rounded-2xl p-6">
              <h3 className="text-xl font-bold text-[#2d361b]">Assign Staff</h3>
              <p className="text-[#2d361b]/70 mt-1">
                Issue: <span className="font-semibold">{selectedIssue?.title}</span>
              </p>

              <div className="mt-4">
                <label className="label">
                  <span className="label-text text-[#2d361b]">Select staff</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={selectedStaffEmail}
                  onChange={(e) => setSelectedStaffEmail(e.target.value)}
                >
                  <option value="">-- choose staff --</option>
                  {staffList.map((s) => (
                    <option key={s.email} value={s.email}>
                      {s.name || s.email} ({s.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setAssignModalOpen(false);
                    setSelectedIssue(null);
                    setSelectedStaffEmail("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn bg-[#2d361b] text-[#d6d37c]"
                  onClick={handleConfirmAssign}
                  disabled={assignMutation.isPending}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminAllIssues;
