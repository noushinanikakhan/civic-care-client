import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import { API_BASE } from "../../../utils/api";

const MyIssues = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const modalRef = useRef(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    category: "",
    priority: "normal",
    location: "",
    description: "",
    image: "",
  });

  // ✅ fetch my issues
  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-issues", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await fetch(
        `${API_BASE}/issues?reportedBy=${encodeURIComponent(user.email)}&page=1&limit=50`
      );
      if (!res.ok) throw new Error("Failed to load issues");
      return res.json();
    },
  });

  const issues = data?.issues || [];

  const stats = useMemo(() => {
    const total = issues.length;
    const pending = issues.filter((i) => (i.status || "").toLowerCase() === "pending").length;
    const inProgress = issues.filter((i) => (i.status || "").toLowerCase() === "in-progress").length;
    const resolved = issues.filter((i) => (i.status || "").toLowerCase() === "resolved").length;
    return { total, pending, inProgress, resolved };
  }, [issues]);

  const getStatusColor = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "pending") return "badge-warning text-[#2d361b]";
    if (s === "in-progress") return "badge-info text-[#2d361b]";
    if (s === "resolved") return "badge-success text-white";
    if (s === "closed") return "badge-neutral text-[#2d361b]";
    return "badge-ghost";
  };

  const getPriorityColor = (priority) =>
    (priority || "").toLowerCase() === "high"
      ? "badge-error text-white"
      : "badge-outline text-[#2d361b]";

  // ✅ Delete mutation (unchanged)
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${API_BASE}/issues/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Delete failed");
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["my-issues", user?.email] });
      await queryClient.invalidateQueries({ queryKey: ["citizen-stats", user?.email] });
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Issue removed successfully.",
        confirmButtonColor: "#2d361b",
      });
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: err.message,
        confirmButtonColor: "#2d361b",
      });
    },
  });

  // ✅ Edit mutation: PATCH /issues/:id
  const editMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await fetch(`${API_BASE}/issues/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Update failed");
      return data; // { success: true, issue: updatedIssue }
    },

    // ✅ UI instantly update (no wait for refetch)
    onSuccess: async (data) => {
      const updated = data?.issue;

      // 1) update my-issues cache instantly
      queryClient.setQueryData(["my-issues", user?.email], (old) => {
        if (!old?.issues || !updated?._id) return old;
        const newIssues = old.issues.map((it) => (it._id === updated._id ? updated : it));
        return { ...old, issues: newIssues };
      });

      // 2) also update public issues cache if you use it elsewhere
      queryClient.setQueriesData({ queryKey: ["issues"] }, (old) => {
        if (!old?.issues || !updated?._id) return old;
        const newIssues = old.issues.map((it) => (it._id === updated._id ? updated : it));
        return { ...old, issues: newIssues };
      });

      // 3) close modal
      modalRef.current?.close();

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Issue updated successfully.",
        confirmButtonColor: "#2d361b",
      });

      // optional: keep data fresh
      await queryClient.invalidateQueries({ queryKey: ["citizen-stats", user?.email] });
    },

    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: err.message,
        confirmButtonColor: "#2d361b",
      });
    },
  });

  // ✅ open modal with prefilled data
  const openEditModal = (issue) => {
    setSelectedIssue(issue);
    setEditForm({
      title: issue.title || "",
      category: issue.category || "",
      priority: issue.priority || "normal",
      location: issue.location || "",
      description: issue.description || "",
      image: issue.image || "",
    });
    modalRef.current?.showModal();
  };

  const onEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitEdit = (e) => {
    e.preventDefault();

    if (!selectedIssue?._id) return;

    // ✅ requirement: edit allowed only if pending
    if ((selectedIssue.status || "").toLowerCase() !== "pending") {
      Swal.fire({
        icon: "info",
        title: "Not editable",
        text: "Only pending issues can be edited.",
        confirmButtonColor: "#2d361b",
      });
      return;
    }

    const payload = {
      title: editForm.title.trim(),
      category: editForm.category,
      priority: editForm.priority,
      location: editForm.location.trim(),
      description: editForm.description.trim(),
      image: editForm.image.trim(), // use URL (avoid base64 -> 413)
    };

    editMutation.mutate({ id: selectedIssue._id, payload });
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
      <section className="bg-[#eff0e1] min-h-screen py-8">
        <div className="w-11/12 mx-auto">
          <p className="text-[#2d361b] font-semibold">Failed to load your issues.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#eff0e1] min-h-screen py-8">
      <div className="w-11/12 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2d361b]">My Issues</h1>
          <p className="text-[#2d361b]/70 mt-2">Track and manage your reported issues</p>
        </div>

        {/* stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
            <p className="text-sm text-[#2d361b]/70">Total Issues</p>
            <p className="text-3xl font-bold text-[#2d361b] mt-2">{stats.total}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
            <p className="text-sm text-[#2d361b]/70">Pending</p>
            <p className="text-3xl font-bold text-[#2d361b] mt-2">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
            <p className="text-sm text-[#2d361b]/70">In Progress</p>
            <p className="text-3xl font-bold text-[#2d361b] mt-2">{stats.inProgress}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
            <p className="text-sm text-[#2d361b]/70">Resolved</p>
            <p className="text-3xl font-bold text-[#2d361b] mt-2">{stats.resolved}</p>
          </div>
        </div>

        {/* table */}
        <div className="bg-white rounded-2xl overflow-hidden border border-[#2d361b]/10">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-[#eff0e1]">
                <tr>
                  <th className="text-[#2d361b]">Issue</th>
                  <th className="text-[#2d361b]">Category</th>
                  <th className="text-[#2d361b]">Status</th>
                  <th className="text-[#2d361b]">Priority</th>
                  <th className="text-[#2d361b]">Upvotes</th>
                  <th className="text-[#2d361b]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue._id} className="hover:bg-[#eff0e1]/50">
                    <td>
                      <div>
                        <p className="font-medium text-[#2d361b]">{issue.title}</p>
                        <p className="text-sm text-[#2d361b]/70">{issue.location}</p>
                      </div>
                    </td>
                    <td className="text-[#2d361b]">{issue.category}</td>
                    <td>
                      <span className={`badge ${getStatusColor(issue.status)}`}>{issue.status}</span>
                    </td>
                    <td>
                      <span className={`badge ${getPriorityColor(issue.priority)}`}>{issue.priority}</span>
                    </td>
                    <td className="text-[#2d361b]">{issue.upvoteCount || 0}</td>
                    <td>
                      <div className="flex gap-2 flex-wrap">
                        <Link
                          to={`/issues/${issue._id}`}
                          className="btn btn-sm bg-[#2d361b] text-[#d6d37c] rounded-2xl"
                        >
                          View
                        </Link>

                        {(issue.status || "").toLowerCase() === "pending" && (
                          <>
                            <button
                              onClick={() => openEditModal(issue)}
                              className="btn btn-sm btn-outline text-[#2d361b] rounded-2xl"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => {
                                Swal.fire({
                                  title: "Delete this issue?",
                                  text: "This action cannot be undone.",
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonColor: "#2d361b",
                                  cancelButtonColor: "#999",
                                  confirmButtonText: "Yes, delete",
                                }).then((result) => {
                                  if (result.isConfirmed) deleteMutation.mutate(issue._id);
                                });
                              }}
                              className="btn btn-sm btn-error text-white rounded-2xl"
                              disabled={deleteMutation.isPending}
                            >
                              {deleteMutation.isPending ? "..." : "Delete"}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {issues.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-[#2d361b]/70">
                      No issues found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ✅ EDIT MODAL */}
        <dialog ref={modalRef} className="modal">
          <div className="modal-box bg-white">
            <h3 className="font-bold text-xl text-[#2d361b]">Edit Issue</h3>
            <p className="text-sm text-[#2d361b]/70 mt-1">
              Update issue information and submit to save changes.
            </p>

            <form onSubmit={submitEdit} className="mt-6 space-y-4">
              <div>
                <label className="label">
                  <span className="label-text text-[#2d361b] font-semibold">Title</span>
                </label>
                <input
                  name="title"
                  value={editForm.title}
                  onChange={onEditChange}
                  className="input input-bordered w-full bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="label">
                    <span className="label-text text-[#2d361b] font-semibold">Category</span>
                  </label>
                  <select
                    name="category"
                    value={editForm.category}
                    onChange={onEditChange}
                    className="select select-bordered w-full bg-white"
                    required
                  >
                    <option value="">Select</option>
                    <option value="Road Damage & Potholes">Road Damage & Potholes</option>
                    <option value="Streetlight Issues">Streetlight Issues</option>
                    <option value="Garbage & Sanitation">Garbage & Sanitation</option>
                    <option value="Water Leakage">Water Leakage</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text text-[#2d361b] font-semibold">Priority</span>
                  </label>
                  <select
                    name="priority"
                    value={editForm.priority}
                    onChange={onEditChange}
                    className="select select-bordered w-full bg-white"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">
                  <span className="label-text text-[#2d361b] font-semibold">Location</span>
                </label>
                <input
                  name="location"
                  value={editForm.location}
                  onChange={onEditChange}
                  className="input input-bordered w-full bg-white"
                  required
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text text-[#2d361b] font-semibold">Image URL</span>
                </label>
                <input
                  name="image"
                  value={editForm.image}
                  onChange={onEditChange}
                  className="input input-bordered w-full bg-white"
                  placeholder="https://..."
                />
                <p className="text-xs text-[#2d361b]/60 mt-1">
                  Use image URL to avoid 413 Payload Too Large.
                </p>
              </div>

              <div>
                <label className="label">
                  <span className="label-text text-[#2d361b] font-semibold">Description</span>
                </label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={onEditChange}
                  className="textarea textarea-bordered w-full bg-white h-28"
                  required
                />
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-outline text-[#2d361b] rounded-2xl"
                  onClick={() => modalRef.current?.close()}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn bg-[#2d361b] text-[#d6d37c] rounded-2xl border-none"
                  disabled={editMutation.isPending}
                >
                  {editMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </section>
  );
};

export default MyIssues;
