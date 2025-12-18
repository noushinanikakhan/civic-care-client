import React, { useMemo, useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";

const AllIssues = () => {
  // UI state (later you’ll send these to server as query params)
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [priority, setPriority] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 6;

  // ✅ temporary mock data (replace with axios call later)
  const { data: issues = [], isLoading } = useQuery({
    queryKey: ["issues", { search, status, category, priority, page, limit }],
    queryFn: async () => {
      // Mock list (keep it small; you’ll replace with API)
      const mock = [
        {
          _id: "1",
          title: "Streetlight not working near bus stop",
          category: "Streetlight",
          status: "pending",
          priority: "normal",
          location: "Sylhet, Ambarkhana",
          image:
            "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=1200&q=60",
          upvoteCount: 12,
        },
        {
          _id: "2",
          title: "Garbage overflow beside main road",
          category: "Waste",
          status: "in-progress",
          priority: "high",
          location: "Sylhet, Zindabazar",
          image:
            "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=1200&q=60",
          upvoteCount: 29,
        },
        {
          _id: "3",
          title: "Pothole causing traffic jam",
          category: "Road",
          status: "working",
          priority: "normal",
          location: "Sylhet, Shahjalal Uposhohor",
          image:
            "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=60",
          upvoteCount: 44,
        },
        {
          _id: "4",
          title: "Water leakage on footpath",
          category: "Water",
          status: "resolved",
          priority: "high",
          location: "Sylhet, Subidbazar",
          image:
            "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1200&q=60",
          upvoteCount: 18,
        },
        {
          _id: "5",
          title: "Damaged footpath near school gate",
          category: "Footpath",
          status: "pending",
          priority: "normal",
          location: "Sylhet, Tilagor",
          image:
            "https://images.unsplash.com/photo-1560438718-eb61ede255eb?auto=format&fit=crop&w=1200&q=60",
          upvoteCount: 6,
        },
        {
          _id: "6",
          title: "Drain blockage after rainfall",
          category: "Drainage",
          status: "closed",
          priority: "normal",
          location: "Sylhet, Chowhatta",
          image:
            "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1200&q=60",
          upvoteCount: 9,
        },
      ];

      // Client-side filtering for now (server-side later)
      const s = search.toLowerCase();
      let filtered = mock.filter((i) =>
        i.title.toLowerCase().includes(s) ||
        i.location.toLowerCase().includes(s) ||
        i.category.toLowerCase().includes(s)
      );

      if (status !== "all") filtered = filtered.filter((i) => i.status === status);
      if (category !== "all") filtered = filtered.filter((i) => i.category === category);
      if (priority !== "all") filtered = filtered.filter((i) => i.priority === priority);

      // Boosted first (requirement)
      filtered = filtered.sort((a, b) => {
        const pa = a.priority === "high" ? 1 : 0;
        const pb = b.priority === "high" ? 1 : 0;
        return pb - pa;
      });

      // Pagination
      const start = (page - 1) * limit;
      return filtered.slice(start, start + limit);
    },
  });

  // For UI dropdown options (static list now; later derive from DB)
  const categories = useMemo(
    () => ["all", "Road", "Streetlight", "Water", "Waste", "Footpath", "Drainage"],
    []
  );

  const getStatusBadge = (s) => {
    if (s === "pending") return "badge badge-warning text-[#2d361b]";
    if (s === "in-progress") return "badge badge-info text-white";
    if (s === "working") return "badge badge-primary text-white";
    if (s === "resolved") return "badge badge-success text-white";
    if (s === "closed") return "badge badge-neutral text-white";
    if (s === "rejected") return "badge badge-error text-white";
    return "badge";
  };

  const getPriorityBadge = (p) =>
    p === "high"
      ? "badge badge-success text-white"
      : "badge badge-outline text-[#2d361b] border-[#2d361b]/40";

  return (
    <section className="bg-[#eff0e1]">
      <div className="w-11/12 mx-auto py-10 lg:py-14">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#2d361b]">
              All Issues
            </h1>
            <p className="mt-2 text-[#2d361b]/80 max-w-2xl">
              Browse reported public infrastructure problems with status, priority, and community upvotes.
            </p>
          </div>

          {/* Search */}
          <div className="w-full lg:w-[420px]">
            <label className="input input-bordered flex items-center gap-2 bg-white">
              <input
                type="text"
                className="grow"
                placeholder="Search by title, category, or location..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
              <span className="text-[#2d361b]/60 text-sm">⌕</span>
            </label>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          <select
            className="select select-bordered bg-white"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All Categories" : c}
              </option>
            ))}
          </select>

          <select
            className="select select-bordered bg-white"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In-Progress</option>
            <option value="working">Working</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            className="select select-bordered bg-white"
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Priority</option>
            <option value="high">High (Boosted)</option>
            <option value="normal">Normal</option>
          </select>
        </div>

        {/* Loader */}
        {isLoading && (
          <div className="mt-10 flex justify-center">
            <span className="loading loading-spinner loading-lg text-[#2d361b]"></span>
          </div>
        )}

        {/* Cards */}
        {!isLoading && (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {issues.map((issue) => (
              <div
                key={issue._id}
                className="rounded-3xl overflow-hidden bg-white/60 border border-[#2d361b]/10"
              >
                <img
                  src={issue.image}
                  alt={issue.title}
                  className="h-44 w-full object-cover"
                />

                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-[#2d361b]/80">
                      {issue.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={getPriorityBadge(issue.priority)}>
                        {issue.priority === "high" ? "High" : "Normal"}
                      </span>
                      <span className={getStatusBadge(issue.status)}>
                        {issue.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-3 text-xl font-bold text-[#2d361b] line-clamp-2">
                    {issue.title}
                  </h3>

                  <p className="mt-2 text-[#2d361b]/75 text-sm">
                    📍 {issue.location}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <button className="btn btn-ghost text-[#2d361b]">
                      ▲ {issue.upvoteCount}
                    </button>

                    <Link
                      to={`/issues/${issue._id}`}
                      className="btn bg-[#2d361b] text-[#d6d37c] rounded-2xl border-none"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination (UI-ready) */}
        <div className="mt-12 flex items-center justify-center gap-3">
          <button
            className="btn btn-outline border-[#2d361b] text-[#2d361b] rounded-2xl"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <span className="font-semibold text-[#2d361b]">Page {page}</span>
          <button
            className="btn btn-outline border-[#2d361b] text-[#2d361b] rounded-2xl"
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default AllIssues;
