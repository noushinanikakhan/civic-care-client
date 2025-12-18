import React, { useContext, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { AuthContext } from "../../../context/AuthContext/AuthContext";

const API_BASE = "http://localhost:3000";

const AllIssues = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ server-side controls
  const [page, setPage] = useState(1);
  const [limit] = useState(9);

  // inputs (search/filter)
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState(""); // applied search

  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");

  // build query string for server
  const queryString = useMemo(() => {
    const qs = new URLSearchParams();
    qs.set("page", page);
    qs.set("limit", limit);
    if (search) qs.set("search", search);
    if (category) qs.set("category", category);
    if (status) qs.set("status", status);
    if (priority) qs.set("priority", priority);
    return qs.toString();
  }, [page, limit, search, category, status, priority]);

  const {
    data,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["issues", page, limit, search, category, status, priority],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/issues?${queryString}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Failed to load issues");
      return json;
    },
    keepPreviousData: true,
  });

  const issues = data?.issues || [];
  const totalPages = data?.totalPages || 1;

  // ✅ Apply search
  const handleApplySearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  // ✅ Filter change (server-side)
  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  // ✅ Upvote rules + SweetAlert + instant update
  const handleUpvote = async (issue) => {
    if (!user?.email) {
      Swal.fire({
        icon: "info",
        title: "Login Required",
        text: "You must login to upvote an issue.",
        confirmButtonText: "Go to Login",
      }).then(() => navigate("/login", { state: location.pathname }));
      return;
    }

    const ownerEmail = issue.userEmail || issue.reportedBy;
    if (ownerEmail && ownerEmail === user.email) {
      Swal.fire({
        icon: "warning",
        title: "Not Allowed",
        text: "You cannot upvote your own issue.",
      });
      return;
    }

    const res = await fetch(`${API_BASE}/issues/${issue._id}/upvote`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail: user.email }),
    });

    const result = await res.json();

    if (!res.ok) {
      Swal.fire({
        icon: "error",
        title: "Upvote Failed",
        text: result?.message || "Something went wrong",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Upvoted!",
      timer: 900,
      showConfirmButton: false,
    });

    // ✅ instant UI update
    refetch();
  };

  // ✅ loader requirement
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <section className="w-11/12 mx-auto py-10">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#2d361b]">All Issues</h2>
        <p className="text-[#2d361b]/80">
          Search, filter and upvote issues to show public importance.
        </p>
      </div>

      {/* ✅ Search + Filters */}
      <div className="bg-white rounded-2xl shadow p-4 mb-6">
        <form
          onSubmit={handleApplySearch}
          className="flex flex-col lg:flex-row gap-3 lg:items-center"
        >
          <input
            type="text"
            placeholder="Search by title, category, location..."
            className="input input-bordered w-full lg:w-[380px]"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />

          <select
            className="select select-bordered w-full lg:w-52"
            value={category}
            onChange={handleFilterChange(setCategory)}
          >
            <option value="all">All Categories</option>
            <option value="Road">Road</option>
            <option value="Water">Water</option>
            <option value="Electricity">Electricity</option>
            <option value="Garbage">Garbage</option>
          </select>

          <select
            className="select select-bordered w-full lg:w-52"
            value={status}
            onChange={handleFilterChange(setStatus)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In-Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select
            className="select select-bordered w-full lg:w-52"
            value={priority}
            onChange={handleFilterChange(setPriority)}
          >
            <option value="all">All Priority</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>

          <button className="btn rounded-xl" type="submit">
            Search
          </button>

          {/* ✅ small fetching indicator (while changing page/filter/search) */}
          {isFetching && (
            <span className="ml-1 text-sm text-[#2d361b]/70">
              Loading...
            </span>
          )}
        </form>
      </div>

      {/* ✅ Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {issues.map((issue) => (
          <div
            key={issue._id}
            className="card bg-white shadow-md rounded-2xl overflow-hidden"
          >
            <figure className="h-44">
              <img
                src={issue.image}
                alt={issue.title}
                className="h-full w-full object-cover"
              />
            </figure>

            <div className="card-body">
              <h3 className="text-lg font-bold text-[#2d361b]">
                {issue.title}
              </h3>

              <div className="flex flex-wrap gap-2 text-sm">
                <span className="badge badge-outline">
                  {issue.category || "N/A"}
                </span>

                <span className="badge">{issue.status || "pending"}</span>

                <span className="badge badge-outline">
                  {issue.priority === "high" ? "High" : "Normal"}
                </span>

                {issue.isBoosted && (
                  <span className="badge badge-warning">Boosted</span>
                )}
              </div>

              <p className="text-sm text-[#2d361b]/80 mt-2">
                <span className="font-semibold">Location:</span>{" "}
                {issue.location || "N/A"}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleUpvote(issue)}
                  className="btn btn-sm rounded-xl"
                >
                  ▲ {issue.upvoteCount || 0}
                </button>

                <Link
                  to={`/issues/${issue._id}`}
                  className="btn btn-sm rounded-xl"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}

        {issues.length === 0 && (
          <div className="col-span-full text-center py-16 text-[#2d361b]/70">
            No issues found.
          </div>
        )}
      </div>

      {/* ✅ Pagination */}
      <div className="mt-10 flex items-center justify-center gap-2">
        <button
          className="btn btn-sm"
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>

        <span className="px-3 text-[#2d361b] font-medium">
          Page {page} / {totalPages}
        </span>

        <button
          className="btn btn-sm"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default AllIssues;
