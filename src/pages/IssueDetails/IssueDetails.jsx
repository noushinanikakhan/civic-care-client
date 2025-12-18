// src/pages/IssueDetails/IssueDetails.jsx
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaArrowUp, FaEdit, FaTrash, FaUserTie, FaClock, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isUpvoting, setIsUpvoting] = useState(false);

  // ✅ Fetch issue details with TanStack Query
  const { 
    data: issueData, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["issue", id],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3000/issues/${id}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch issue");
      }
      return res.json();
    },
    retry: 1,
  });

  // ✅ Upvote mutation with TanStack Query
  const upvoteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`http://localhost:3000/issues/${id}/upvote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: user?.email }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to upvote");
      }
      
      return res.json();
    },
    onSuccess: (data) => {
      // Invalidate and refetch the issue query to update UI
      queryClient.invalidateQueries(["issue", id]);
      
      Swal.fire({
        icon: "success",
        title: "Upvoted!",
        text: data.message || "Thank you for supporting this issue",
        confirmButtonColor: "#2d361b",
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Cannot Upvote",
        text: error.message,
        confirmButtonColor: "#2d361b",
      });
    },
    onSettled: () => {
      setIsUpvoting(false);
    },
  });

  // ✅ Delete mutation with TanStack Query
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`http://localhost:3000/issues/${id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete issue");
      }
      
      return res.json();
    },
    onSuccess: (data) => {
      // Invalidate issues list query
      queryClient.invalidateQueries(["issues"]);
      
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: data.message,
        confirmButtonColor: "#2d361b",
      });
      
      navigate("/dashboard/my-issues");
    },
  });

  const issue = issueData?.issue;
  const timeline = issue?.timeline || [];
  const assignedStaff = issue?.assignedStaff;


  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#eff0e1] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-[#2d361b]"></span>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="min-h-screen bg-[#eff0e1] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#2d361b]">Issue Not Found</h2>
          <Link to="/all-issues" className="btn bg-[#2d361b] text-[#d6d37c] mt-4">
            Back to All Issues
          </Link>
        </div>
      </div>
    );
  }

  // Status badge
  const getStatusBadge = (status) => {
    const base = "badge font-bold";
    switch (status) {
      case "pending": return `${base} badge-warning text-[#2d361b]`;
      case "in-progress": return `${base} badge-info text-white`;
      case "resolved": return `${base} badge-success text-white`;
      case "closed": return `${base} badge-neutral text-[#2d361b]`;
      default: return base;
    }
  };

  // Priority badge
  const getPriorityBadge = (priority) => {
    return priority === "high"
      ? "badge badge-success text-white font-bold"
      : "badge badge-outline border-[#2d361b] text-[#2d361b] font-bold";
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check if user can edit/delete
  const canEditDelete = user?.email === issue.reportedBy && issue.status === "pending";
  
  // Check if user can boost
  const canBoost = user?.email === issue.reportedBy && issue.priority !== "high" && user?.isPremium;

  // Handle upvote
  const handleUpvote = async () => {
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

  // Handle delete
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
      if (result.isConfirmed) {
        deleteMutation.mutate();
      }
    });
  };

  // Handle boost
  const handleBoost = () => {
    Swal.fire({
      title: "Boost Issue Priority",
      html: `
        <p>Boost this issue to <strong>High Priority</strong> for <span class="text-green-600 font-bold">৳100</span></p>
        <p class="text-sm mt-2">Boosted issues appear above normal issues and get faster attention from staff.</p>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#2d361b",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Pay ৳100 to Boost",
    }).then((result) => {
      if (result.isConfirmed) {
        // Implement payment logic here
        Swal.fire({
          title: "Payment Successful!",
          text: "Issue has been boosted to High Priority",
          icon: "success",
          confirmButtonColor: "#2d361b",
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#eff0e1]">
      <div className="w-11/12 mx-auto py-8">
        {/* Breadcrumb */}
        <div className="text-sm breadcrumbs text-[#2d361b]/70 mb-6">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/all-issues">All Issues</Link></li>
            <li className="font-semibold text-[#2d361b]">{issue.title}</li>
          </ul>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Issue Details */}
          <div className="lg:col-span-2">
            {/* Issue Header */}
            <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10 mb-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-[#2d361b]">{issue.title}</h1>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className={getStatusBadge(issue.status)}>
                      {issue.status.toUpperCase()}
                    </span>
                    <span className={getPriorityBadge(issue.priority)}>
                      {issue.priority === "high" ? "🔥 HIGH PRIORITY" : "Normal Priority"}
                    </span>
                    <span className="badge badge-outline border-[#2d361b] text-[#2d361b]">
                      {issue.category}
                    </span>
                  </div>
                </div>
                
                {/* Upvote Button */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={handleUpvote}
                    disabled={isUpvoting || upvoteMutation.isLoading}
                    className="btn bg-[#2d361b] text-[#d6d37c] rounded-2xl border-none hover:bg-[#1f2613] flex items-center gap-2"
                  >
                    <FaArrowUp />
                    <span>Upvote</span>
                  </button>
                  <span className="mt-2 text-[#2d361b] font-bold text-lg">
                    ▲ {issue.upvoteCount || 0}
                  </span>
                  <p className="text-xs text-[#2d361b]/60 mt-1">
                    {issue.upvotedBy?.length || 0} people upvoted
                  </p>
                </div>
              </div>
            </div>

            {/* Issue Image */}
            <div className="bg-white rounded-2xl p-4 border border-[#2d361b]/10 mb-6">
              <img
                src={issue.image}
                alt={issue.title}
                className="w-full h-64 md:h-96 object-cover rounded-xl"
              />
            </div>

            {/* Issue Information */}
            <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10 mb-6">
              <h2 className="text-2xl font-bold text-[#2d361b] mb-4">Issue Details</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-[#2d361b]" />
                  <div>
                    <p className="text-sm text-[#2d361b]/70">Location</p>
                    <p className="font-semibold text-[#2d361b]">{issue.location}</p>
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
                    <p className="font-semibold text-[#2d361b]">{issue.reportedByName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <FaMoneyBillWave className="text-[#2d361b]" />
                  <div>
                    <p className="text-sm text-[#2d361b]/70">Estimated Cost</p>
                    <p className="font-semibold text-[#2d361b]">৳{issue.estimatedCost?.toLocaleString() || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-[#2d361b] mb-3">Description</h3>
                <p className="text-[#2d361b]/80 leading-relaxed">{issue.description}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10 mb-6">
              <h2 className="text-2xl font-bold text-[#2d361b] mb-4">Actions</h2>
              <div className="flex flex-wrap gap-4">
                {canEditDelete && (
                  <>
                    <button className="btn bg-[#2d361b] text-[#d6d37c] rounded-2xl border-none hover:bg-[#1f2613] flex items-center gap-2">
                      <FaEdit /> Edit Issue
                    </button>
                    <button
                      onClick={handleDelete}
                      className="btn btn-error text-white rounded-2xl border-none flex items-center gap-2"
                    >
                      <FaTrash /> Delete Issue
                    </button>
                  </>
                )}
                
                {canBoost && (
                  <button
                    onClick={handleBoost}
                    className="btn bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-2xl border-none hover:opacity-90 flex items-center gap-2"
                  >
                    <FaMoneyBillWave /> Boost Priority (৳100)
                  </button>
                )}
                
                {issue.priority === "high" && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-amber-200">
                    <FaCheckCircle className="text-green-600" />
                    <span className="font-semibold text-green-700">This issue is boosted</span>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline Section */}
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
                    <div key={index} className="relative pl-10 pb-6 border-l-2 border-[#2d361b]/20 last:border-l-0">
                      {/* Timeline dot */}
                      <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[#2d361b]"></div>
                      
                      <div className="bg-[#eff0e1] rounded-xl p-4">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className={getStatusBadge(entry.status)}>
                            {entry.status.toUpperCase()}
                          </span>
                          <span className="text-sm text-[#2d361b]/70">{formatDate(entry.date)}</span>
                        </div>
                        
                        <p className="text-[#2d361b] font-medium mb-2">{entry.message}</p>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#2d361b]/10 flex items-center justify-center">
                              <span className="text-xs font-bold text-[#2d361b]">
                                {entry.updatedBy?.charAt(0) || "S"}
                              </span>
                            </div>
                            <span className="text-[#2d361b]/80">
                              {entry.updatedBy} ({entry.role})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Staff Info & Quick Stats */}
          <div className="space-y-6">
            {/* Staff Information Card */}
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
                
                <div className="mt-4 pt-4 border-t border-[#2d361b]/10">
                  <h4 className="font-semibold text-[#2d361b] mb-2">Contact Information</h4>
                  <p className="text-sm text-[#2d361b]/70">
                    Phone: <span className="font-medium">{assignedStaff.phone || "Not provided"}</span>
                  </p>
                  <p className="text-sm text-[#2d361b]/70">
                    Employee ID: <span className="font-medium">{assignedStaff.employeeId || "N/A"}</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-[#1c260f] to-[#1f2b12] rounded-2xl p-6 border border-[#2f3a1a]">
                <h2 className="text-xl font-bold text-[#f4f6e8] mb-3">Waiting for Assignment</h2>
                <p className="text-[#9aa36a] text-sm">
                  This issue has not been assigned to any staff member yet. 
                  It will be reviewed and assigned by the admin soon.
                </p>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
              <h2 className="text-xl font-bold text-[#2d361b] mb-4">Issue Summary</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#2d361b]/70">Category</p>
                  <p className="font-semibold text-[#2d361b]">{issue.category}</p>
                </div>
                <div>
                  <p className="text-sm text-[#2d361b]/70">Severity</p>
                  <p className="font-semibold text-[#2d361b] capitalize">{issue.severity || "medium"}</p>
                </div>
                <div>
                  <p className="text-sm text-[#2d361b]/70">Last Updated</p>
                  <p className="font-semibold text-[#2d361b]">{formatDate(issue.updatedAt)}</p>
                </div>
                {issue.resolvedAt && (
                  <div>
                    <p className="text-sm text-[#2d361b]/70">Resolved On</p>
                    <p className="font-semibold text-[#2d361b]">{formatDate(issue.resolvedAt)}</p>
                  </div>
                )}
                {issue.closedAt && (
                  <div>
                    <p className="text-sm text-[#2d361b]/70">Closed On</p>
                    <p className="font-semibold text-[#2d361b]">{formatDate(issue.closedAt)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Reporter Info */}
            <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
              <h2 className="text-xl font-bold text-[#2d361b] mb-4">Reporter Information</h2>
              <div className="flex items-center gap-3">
                <img
                  src={issue.reportedByPhoto || "https://api.dicebear.com/7.x/initials/svg?seed=" + issue.reportedByName}
                  alt={issue.reportedByName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-[#2d361b]">{issue.reportedByName}</h3>
                  <p className="text-sm text-[#2d361b]/70">{issue.reportedBy}</p>
                  {issue.reportedBy === user?.email && (
                    <span className="text-xs bg-[#2d361b]/10 text-[#2d361b] px-2 py-1 rounded mt-1 inline-block">
                      You reported this
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="font-bold text-blue-900 mb-3">Need Help?</h3>
              <p className="text-blue-800/70 text-sm mb-4">
                If you have additional information about this issue or need to report abuse, contact support.
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