import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { API_BASE } from "../../../utils/api";

const LatestResolvedIssues = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["latest-resolved-issues"],
    queryFn: async () => {
      // ✅ server-side filter + limit
      const qs = new URLSearchParams();
      qs.set("status", "resolved");    // filter by status
      qs.set("page", "1");
      qs.set("limit", "6");           // at least 6
      qs.set("sort", "latest");       // if your backend supports it; if not, ignore (won't break)

      const res = await fetch(`${API_BASE}/issues?${qs.toString()}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to load resolved issues");
      return json;
    },
  });

  const issues = data?.issues || [];

  if (isLoading) {
    return (
      <section className="bg-[#eff0e1] py-14">
        <div className="w-11/12 mx-auto flex items-center justify-center">
          <span className="loading loading-infinity loading-xl text-[#2d361b]" />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="bg-[#eff0e1] py-14">
        <div className="w-11/12 mx-auto">
          <div className="rounded-2xl bg-white/60 border border-[#2d361b]/10 p-6">
            <p className="text-[#2d361b] font-semibold">Failed to load latest resolved issues.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#f6f7ef] py-14">
      <div className="w-11/12 mx-auto">
        {/* Heading */}
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#2d361b]">
              Latest Resolved Issues
            </h2>
            <p className="mt-2 text-[#2d361b]/70 max-w-2xl">
              Recently resolved reports — see what’s improving in the city.
            </p>
          </div>

          <Link
            to="/all-issues"
            className="btn btn-outline rounded-2xl border-[#2d361b] text-[#2d361b] hover:bg-[#2d361b] hover:text-[#d6d37c]"
          >
            Browse All Issues
          </Link>
        </div>

        {/* Cards */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {issues.map((issue) => (
            <div
              key={issue._id}
              className="rounded-2xl overflow-hidden bg-white/70 border border-[#2d361b]/10 hover:shadow-md transition"
            >
              <div className="h-44 bg-white">
                <img
                  src={issue.image || "https://via.placeholder.com/800x400?text=Resolved+Issue"}
                  alt={issue.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/800x400?text=Resolved+Issue";
                  }}
                />
              </div>

              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="badge badge-success text-white">RESOLVED</span>
                  {issue.priority?.toLowerCase() === "high" || issue.isBoosted ? (
                    <span className="badge bg-[#d6d37c] text-[#2d361b] font-bold">
                      Boosted
                    </span>
                  ) : (
                    <span className="badge badge-outline border-[#2d361b]/20 text-[#2d361b]">
                      Normal
                    </span>
                  )}
                  <span className="badge badge-outline border-[#2d361b]/20 text-[#2d361b]">
                    {issue.category || "General"}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#2d361b] line-clamp-2">
                  {issue.title}
                </h3>

                <p className="mt-2 text-sm text-[#2d361b]/70 line-clamp-2">
                  {issue.description || "No description provided."}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-[#2d361b]/70">
                    📍 {issue.location || "N/A"}
                  </p>

                  <Link
                    to={`/issues/${issue._id}`}
                    className="btn btn-sm bg-[#2d361b] text-[#d6d37c] rounded-xl border-none"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {issues.length === 0 && (
            <div className="col-span-full text-center py-10 text-[#2d361b]/70">
              No resolved issues found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LatestResolvedIssues;
