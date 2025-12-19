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

  const [page, setPage] = useState(1);
  const limit = 9;

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");

  const queryString = useMemo(() => {
    const qs = new URLSearchParams();
    qs.set("page", page);
    qs.set("limit", limit);
    if (search) qs.set("search", search);
    if (category !== "all") qs.set("category", category);
    if (status !== "all") qs.set("status", status);
    if (priority !== "all") qs.set("priority", priority);
    return qs.toString();
  }, [page, limit, search, category, status, priority]);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["issues", page, search, category, status, priority],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/issues?${queryString}`);
      const json = await res.json();
      if (!res.ok) throw new Error("Failed to load issues");
      return json;
    },
    keepPreviousData: true,
  });

  const issues = data?.issues || [];
  const totalPages = data?.totalPages || 1;

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleUpvote = async (issue) => {
    if (!user?.email) {
      Swal.fire({
        icon: "info",
        title: "Login Required",
        text: "Please login to upvote an issue.",
        confirmButtonColor: "#2d361b",
      }).then(() => navigate("/login", { state: location.pathname }));
      return;
    }

    const ownerEmail = issue.userEmail || issue.reportedBy;
    if (ownerEmail === user.email) {
      Swal.fire({
        icon: "warning",
        title: "Not Allowed",
        text: "You cannot upvote your own issue.",
        confirmButtonColor: "#2d361b",
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
        confirmButtonColor: "#2d361b",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Upvoted!",
      timer: 900,
      showConfirmButton: false,
    });

    refetch();
  };

  if (isLoading) {
    return (
      <section className="min-h-[60vh] bg-[#eff0e1] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-[#2d361b]" />
      </section>
    );
  }

  return (
    <section className="bg-[#eff0e1] py-10">
      <div className="w-11/12 mx-auto">
        <h2 className="text-4xl font-extrabold text-[#2d361b] text-center">
          All Issues
        </h2>

        <form
          onSubmit={handleSearch}
          className="mt-6 flex flex-col lg:flex-row gap-3 bg-[#f7f7ea] p-4 rounded-2xl"
        >
          <input
            type="text"
            placeholder="Search issues..."
            className="input input-bordered w-full bg-white"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />

          <select
            className="select select-bordered bg-white"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Road">Road Damage & Potholes</option>
            <option value="Water">Water Leakage</option>
            <option value="Electricity">Streetlight Issues</option>
            <option value="Garbage">Garbage & Sanitation</option>
            <option value="Other">Other</option>
          </select>

          <select
            className="select select-bordered bg-white"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In-Progress</option>
            <option value="resolved">Resolved</option>
     
          </select>

          <select
            className="select select-bordered bg-white"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="all">All Priority</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>

          <button className="btn bg-[#2d361b] text-[#d6d37c] rounded-2xl">
            Search
          </button>

          {isFetching && (
            <span className="text-sm text-[#2d361b]/70">Loading...</span>
          )}
        </form>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {issues.map((issue) => (
            <div
              key={issue._id}
              className="bg-[#f7f7ea] rounded-2xl shadow border border-[#2d361b]/10"
            >
              <figure className="h-44">
                <img
                  src={issue.image}
                  alt={issue.title}
                  className="h-full w-full object-cover rounded-t-2xl"
                />
              </figure>

              <div className="p-4">
                <h3 className="font-bold text-lg text-[#2d361b]">
                  {issue.title}
                </h3>

                <p className="text-sm text-[#2d361b]/80 mt-1">
                  Location: {issue.location || "N/A"}
                </p>

                <div className="flex flex-wrap gap-2 text-sm mt-2">
                  <span className="badge badge-outline">{issue.category}</span>
                  <span className="badge bg-[#2d361b] text-[#d6d37c]">
                    {issue.status}
                  </span>
                  <span className="badge badge-outline">
                    {issue.priority === "high" ? "High" : "Normal"}
                  </span>
                  {issue.isBoosted && (
                    <span className="badge bg-[#d6d37c] text-[#2d361b]">
                      Boosted
                    </span>
                  )}
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => handleUpvote(issue)}
                    className="btn btn-sm bg-[#2d361b] text-[#d6d37c] rounded-xl"
                  >
                    ▲ {issue.upvoteCount || 0}
                  </button>

                  <Link
                    to={`/issues/${issue._id}`}
                    className="btn btn-sm bg-[#d6d37c] text-[#2d361b] rounded-xl"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {issues.length === 0 && (
            <div className="col-span-full text-center py-12 text-[#2d361b]/70">
              No issues found.
            </div>
          )}
        </div>

        <div className="mt-10 flex justify-center gap-3">
          <button
            className="btn btn-sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          <span className="font-semibold text-[#2d361b]">
            Page {page} / {totalPages}
          </span>

          <button
            className="btn btn-sm"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default AllIssues;
