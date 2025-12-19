import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import { API_BASE } from "../../../utils/api";
import { authFetch } from "../../../utils/authFetch";

const CitizenProfile = () => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);

  

  const profileQuery = useQuery({
    queryKey: ["user-profile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
     const res = await authFetch(`${API_BASE}/users/profile/${encodeURIComponent(user.email)}`);

      if (!res.ok) throw new Error("Failed to load profile");
      return res.json();
    },
  });

  const issuesQuery = useQuery({
    queryKey: ["my-issues", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await fetch(
        `${API_BASE}/issues?reportedBy=${encodeURIComponent(
          user.email
        )}&page=1&limit=50`
      );
      if (!res.ok) throw new Error("Failed to load issues");
      return res.json();
    },
  });

  // ✅ IMPORTANT: compute safe values BEFORE any return
  const profile = profileQuery.data || {};
  const issues = issuesQuery.data?.issues || [];

  const isPremium = !!profile?.isPremium;
  const isBlocked = !!profile?.isBlocked;

  // ✅ IMPORTANT: useMemo must be above any return (fixes hook order crash)
  const stats = useMemo(() => {
    const total = issues.length;
    const pending = issues.filter(
      (i) => (i.status || "").toLowerCase() === "pending"
    ).length;
    const resolved = issues.filter(
      (i) => (i.status || "").toLowerCase() === "resolved"
    ).length;
    return { total, pending, resolved };
  }, [issues]);

  const issueLimit = isPremium ? Infinity : 3;
  const issuesUsed = issues.length;
  const remaining = isPremium ? "Unlimited" : Math.max(0, 3 - issuesUsed);

  // ✅ Now it's safe to return early (ALL hooks already ran)
  if (!user || profileQuery.isLoading || issuesQuery.isLoading) {
    return (
      <div className="min-h-screen bg-[#eff0e1] flex items-center justify-center">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }

  if (profileQuery.isError || issuesQuery.isError) {
    return (
      <div className="min-h-screen bg-[#eff0e1] flex items-center justify-center">
        <p className="text-[#2d361b] font-semibold">Failed to load profile.</p>
      </div>
    );
  }

  return (
    <section className="bg-[#eff0e1] min-h-screen py-8">
      <div className="w-11/12 mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2d361b]">My Profile</h1>
          <p className="text-[#2d361b]/70 mt-2">
            Manage your account and check activity
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-8 border border-[#2d361b]/10">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative">
                  <img
                    src={
                      user.photoURL ||
                      profile.photoURL ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${
                        user.displayName || user.email
                      }&backgroundColor=2d361b&fontColor=d6d37c`
                    }
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-[#2d361b]/30 object-cover"
                  />
                  {isPremium && (
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      PREMIUM
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[#2d361b]">
                    {user.displayName ||
                      profile.name ||
                      user.email?.split("@")[0]}
                  </h2>
                  <p className="text-[#2d361b]/70">{user.email}</p>

                  <div className="flex gap-2 mt-3 flex-wrap">
                    <span
                      className={`badge border-none ${
                        isPremium
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {isPremium ? "Premium Member" : "Free Account"}
                    </span>

                    {isBlocked && (
                      <span className="badge bg-red-100 text-red-800 border-none">
                        Account Blocked
                      </span>
                    )}

                    <span className="badge bg-[#eff0e1] text-[#2d361b] border-none">
                      Role: {profile.role}
                    </span>
                  </div>

                  <div className="mt-6">
                    <div className="flex justify-between text-sm text-[#2d361b] mb-2">
                      <span>Issue Submission Limit</span>
                      <span>
                        {issuesUsed} / {isPremium ? "∞" : issueLimit} used
                      </span>
                    </div>

                    <progress
                      className="progress progress-success w-full h-3"
                      value={isPremium ? 1 : Math.min(issuesUsed, 3)}
                      max={isPremium ? 1 : 3}
                    ></progress>

                    <p className="text-sm text-[#2d361b]/60 mt-2">
                      {isPremium
                        ? "Unlimited submissions enabled."
                        : `Remaining: ${remaining}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-[#2d361b]/10">
                <button
                  onClick={() => {
                    Swal.fire({
                      icon: "info",
                      title: "Edit Profile",
                      text: "Connect profile update with backend later (optional).",
                      confirmButtonColor: "#2d361b",
                    });
                    setEditMode(!editMode);
                  }}
                  className="btn bg-[#2d361b] text-[#d6d37c] rounded-2xl"
                >
                  {editMode ? "Close Edit" : "Edit Profile"}
                </button>

                {!isPremium && (
                  <button
                    onClick={() => {
                      Swal.fire({
                        icon: "info",
                        title: "Premium Payment",
                        text: "You said you will implement payment later — keep this for later.",
                        confirmButtonColor: "#2d361b",
                      });
                    }}
                    className="btn bg-green-600 text-white rounded-2xl ml-auto hover:bg-green-700"
                  >
                    Upgrade to Premium - 1000tk
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-gradient-to-br from-[#1c260f] to-[#1f2b12] text-[#f4f6e8] rounded-2xl p-6 border border-[#2f3a1a]">
              <h3 className="text-xl font-semibold mb-6">Your Activity</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-[#1a220e] rounded-xl">
                  <span>Total Issues</span>
                  <span className="font-bold">{stats.total}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-[#1a220e] rounded-xl">
                  <span>Pending Issues</span>
                  <span className="font-bold">{stats.pending}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-[#1a220e] rounded-xl">
                  <span>Resolved Issues</span>
                  <span className="font-bold">{stats.resolved}</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-[#1a220e] rounded-xl">
                  <span>Total Payments</span>
                  <span className="font-bold">0 tk</span>
                </div>
              </div>
            </div>

            {isBlocked && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <h4 className="font-bold text-red-800 mb-2">
                  Account Restricted
                </h4>
                <p className="text-sm text-red-700">
                  Your account is blocked by admin. You should disable
                  submitting/upvoting/boosting.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CitizenProfile;
