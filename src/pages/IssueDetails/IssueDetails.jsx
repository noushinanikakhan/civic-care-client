import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  FaArrowUp,
  FaEdit,
  FaTrash,
  FaUserTie,
  FaClock,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCheckCircle,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isUpvoting, setIsUpvoting] = useState(false);

  // ✅ FIXED: Properly extract issue from response
  const { data: response, isLoading, error } = useQuery({
    queryKey: ["issue", id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3000/issues/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to fetch issue");
      return data; // Returns { success: true, issue: {...} }
    },
    retry: 1,
  });

  // ✅ FIXED: Extract issue from response
  const issue = response?.issue || {};
  const timeline = issue?.timeline || [];
  const assignedStaff = issue?.assignedStaff;

  // ✅ FIXED: Upvote mutation - use PATCH method (not POST)
  const upvoteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`http://localhost:3000/issues/${id}/upvote`, {
        method: "PATCH", // ✅ BACKEND EXPECTS PATCH
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: user?.email }), // ✅ userEmail (not email)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to upvote");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issue", id] });
      queryClient.invalidateQueries({ queryKey: ["issues"] });

      Swal.fire({
        icon: "success",
        title: "Upvoted!",
        text: "Thank you for supporting this issue.",
        confirmButtonColor: "#2d361b",
      });
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Cannot Upvote",
        text: err.message,
        confirmButtonColor: "#2d361b",
      });
    },
    onSettled: () => setIsUpvoting(false),
  });

  // ✅ Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`http://localhost:3000/issues/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${await user?.getIdToken()}` // ✅ Add token for DELETE
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to delete issue");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Issue deleted successfully.",
        confirmButtonColor: "#2d361b",
      });

      navigate("/dashboard/citizens/my-issues");
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#eff0e1] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-[#2d361b]"></span>
      </div>
    );
  }

  if (error || !issue?._id) {
    return (
      <div className="min-h-screen bg-[#eff0e1] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#2d361b]">Issue Not Found</h2>
          <p className="text-[#2d361b]/70 mt-2">{error?.message}</p>
          <Link to="/all-issues" className="btn bg-[#2d361b] text-[#d6d37c] mt-4">
            Back to All Issues
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const base = "badge font-bold";
    switch ((status || "").toLowerCase()) {
      case "pending":
        return `${base} badge-warning text-[#2d361b]`;
      case "in-progress":
        return `${base} badge-info text-white`;
      case "resolved":
        return `${base} badge-success text-white`;
      case "closed":
        return `${base} badge-neutral text-[#2d361b]`;
      default:
        return base;
    }
  };

  const getPriorityBadge = (priority) => {
    return (priority || "").toLowerCase() === "high"
      ? "badge badge-error text-white font-bold"
      : "badge badge-outline border-[#2d361b] text-[#2d361b] font-bold";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canEditDelete =
    user?.email === issue.reportedBy && (issue.status || "").toLowerCase() === "pending";

  const handleUpvote = () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to upvote issues",
        confirmButtonColor: "#2d361b",
      });
      navigate("/login", { state: { from: `/issues/${id}` } });
      return;
    }

    if (user.email === issue.reportedBy) {
      Swal.fire({
        icon: "error",
        title: "Cannot Upvote",
        text: "You cannot upvote your own issue",
        confirmButtonColor: "#2d361b",
      });
      return;
    }

    setIsUpvoting(true);
    upvoteMutation.mutate();
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Delete Issue?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#2d361b",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate();
    });
  };

  return (
    <div className="min-h-screen bg-[#eff0e1]">
      <div className="w-11/12 mx-auto py-8">
        <div className="text-sm breadcrumbs text-[#2d361b]/70 mb-6">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/all-issues">All Issues</Link></li>
            <li className="font-semibold text-[#2d361b]">{issue.title}</li>
          </ul>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10 mb-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-[#2d361b]">{issue.title}</h1>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className={getStatusBadge(issue.status)}>
                      {(issue.status || "pending").toUpperCase()}
                    </span>
                    <span className={getPriorityBadge(issue.priority)}>
                      {(issue.priority || "normal").toLowerCase() === "high"
                        ? "🔥 HIGH PRIORITY"
                        : "Normal Priority"}
                    </span>
                    <span className="badge badge-outline border-[#2d361b] text-[#2d361b]">
                      {issue.category}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <button
                    onClick={handleUpvote}
                    disabled={isUpvoting || upvoteMutation.isPending}
                    className="btn bg-[#2d361b] text-[#d6d37c] rounded-2xl border-none hover:bg-[#1f2613] flex items-center gap-2"
                  >
                    <FaArrowUp />
                    <span>Upvote</span>
                  </button>

                  <span className="mt-2 text-[#2d361b] font-bold text-lg">
                    ▲ {issue.upvoteCount || 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-[#2d361b]/10 mb-6">
              <img
                src={issue.image || "https://via.placeholder.com/800x400?text=No+Image"}
                alt={issue.title}
                className="w-full h-64 md:h-96 object-cover rounded-xl"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/800x400?text=No+Image";
                }}
              />
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10 mb-6">
              <h2 className="text-2xl font-bold text-[#2d361b] mb-4">Issue Details</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-[#2d361b]" />
                  <div>
                    <p className="text-sm text-[#2d361b]/70">Location</p>
                    <p className="font-semibold text-[#2d361b]">{issue.location || "Not specified"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-[#2d361b]" />
                  <div>
                    <p className="text-sm text-[#2d361b]/70">Reported On</p>
                    <p className="font-semibold text-[#2d361b]">{formatDate(issue.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaUserTie className="text-[#2d361b]" />
                  <div>
                    <p className="text-sm text-[#2d361b]/70">Reported By</p>
                    <p className="font-semibold text-[#2d361b]">{issue.reportedByName || issue.reportedBy || "Anonymous"}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold text-[#2d361b] mb-3">Description</h3>
                <p className="text-[#2d361b]/80 leading-relaxed whitespace-pre-line">
                  {issue.description || "No description provided."}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10 mb-6">
              <h2 className="text-2xl font-bold text-[#2d361b] mb-4">Actions</h2>
              <div className="flex flex-wrap gap-4">
                {canEditDelete && (
                  <>
                    <Link
                      to={`/dashboard/citizens/edit-issue/${id}`}
                      className="btn bg-[#2d361b] text-[#d6d37c] rounded-2xl border-none flex items-center gap-2"
                    >
                      <FaEdit /> Edit Issue
                    </Link>
                    <button
                      onClick={handleDelete}
                      disabled={deleteMutation.isPending}
                      className="btn btn-error text-white rounded-2xl border-none flex items-center gap-2"
                    >
                      <FaTrash /> Delete Issue
                    </button>
                  </>
                )}

                {(issue.priority || "").toLowerCase() === "high" && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-amber-200">
                    <FaCheckCircle className="text-green-600" />
                    <span className="font-semibold text-green-700">This issue is boosted</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
              <h2 className="text-2xl font-bold text-[#2d361b] mb-6">Issue Timeline</h2>

              {timeline.length === 0 ? (
                <div className="text-center py-8 text-[#2d361b]/60">
                  <FaClock className="text-4xl mx-auto mb-4 opacity-50" />
                  <p>No timeline entries yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {timeline.map((entry, index) => (
                    <div
                      key={index}
                      className="relative pl-10 pb-6 border-l-2 border-[#2d361b]/20 last:border-l-0"
                    >
                      <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[#2d361b]"></div>

                      <div className="bg-[#eff0e1] rounded-xl p-4">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className={getStatusBadge(entry.status)}>
                            {(entry.status || "").toUpperCase()}
                          </span>
                          <span className="text-sm text-[#2d361b]/70">{formatDate(entry.date)}</span>
                        </div>

                        <p className="text-[#2d361b] font-medium mb-2">{entry.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {assignedStaff ? (
              <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
                <h2 className="text-xl font-bold text-[#2d361b] mb-4">Assigned Staff</h2>
                <div className="flex items-center gap-4">
                  <img
                    src={assignedStaff.photo}
                    alt={assignedStaff.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#2d361b]/20"
                  />
                  <div>
                    <h3 className="font-bold text-[#2d361b]">{assignedStaff.name}</h3>
                    <p className="text-sm text-[#2d361b]/70">{assignedStaff.department}</p>
                    <p className="text-sm text-[#2d361b]/60 mt-1">{assignedStaff.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-[#1c260f] to-[#1f2b12] rounded-2xl p-6 border border-[#2f3a1a]">
                <h2 className="text-xl font-bold text-[#f4f6e8] mb-3">Waiting for Assignment</h2>
                <p className="text-[#9aa36a] text-sm">
                  This issue has not been assigned to any staff member yet.
                </p>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
              <h2 className="text-xl font-bold text-[#2d361b] mb-4">Issue Summary</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#2d361b]/70">Category</p>
                  <p className="font-semibold text-[#2d361b]">{issue.category}</p>
                </div>
                <div>
                  <p className="text-sm text-[#2d361b]/70">Last Updated</p>
                  <p className="font-semibold text-[#2d361b]">{formatDate(issue.updatedAt)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-3">Need Help?</h3>
              <p className="text-blue-800/70 text-sm mb-4">
                If you have additional information about this issue, contact support.
              </p>
              <button className="btn btn-outline btn-sm border-blue-300 text-blue-700 rounded-xl">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;