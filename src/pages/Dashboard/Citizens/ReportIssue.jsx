import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import { API_BASE } from "../../../utils/api";
import { authFetch } from "../../../utils/authFetch";

const ReportIssue = () => {
 const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState({
    title: "",
    category: "",
    priority: "normal",
    location: "",
    description: "",
    image: "", 
  });

  // Get user profile from MongoDB (isPremium / isBlocked / role)
  const profileQuery = useQuery({
    queryKey: ["user-profile", user?.email],
   enabled: !!user?.email && !loading,
    queryFn: async () => {
      const res = await authFetch(`${API_BASE}/users/profile/${encodeURIComponent(user.email)}`);
      if (!res.ok) throw new Error("Failed to load profile");
      const json = await res.json();
    return json.user; 
    },
  });

  // ✅ Get my issues count from DB
  const myIssuesQuery = useQuery({
    queryKey: ["my-issues", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await authFetch(`${API_BASE}/issues?reportedBy=${encodeURIComponent(user.email)}&page=1&limit=50`);
      if (!res.ok) throw new Error("Failed to load issues");
      return res.json();
    },
  });

 const isPremium = !!profileQuery.data?.isPremium;
 const isBlocked = !!profileQuery.data?.isBlocked;
  const issuesUsed = myIssuesQuery.data?.issues?.length || 0;

  // ✅ Requirement: free users max 3 issues, premium unlimited
  const canSubmit = useMemo(() => {
    if (!user?.email) return false;
    if (isBlocked) return false;
    if (isPremium) return true;
    return issuesUsed < 3;
  }, [user?.email, isBlocked, isPremium, issuesUsed]);

  const remaining = isPremium ? "Unlimited" : Math.max(0, 3 - issuesUsed);

  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await authFetch(`${API_BASE}/issues`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // show real error if server sends message
        throw new Error(data?.message || `Failed (${res.status})`);
      }

      return data;
    },
    onSuccess: async () => {
      // ✅ refresh UI instantly
      await queryClient.invalidateQueries({ queryKey: ["my-issues", user?.email] });
      await queryClient.invalidateQueries({ queryKey: ["citizen-stats", user?.email] });
      await queryClient.invalidateQueries({ queryKey: ["issues"] });

      Swal.fire({
        icon: "success",
        title: "Submitted!",
        text: "Issue reported successfully.",
        confirmButtonColor: "#2d361b",
      });

      // ✅ Requirement: go to my issues after create
      navigate("/dashboard/citizens/my-issues");
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Submit failed",
        text: err.message,
        confirmButtonColor: "#2d361b",
      });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ If you are using URL image input, you can skip FileReader.
  // If you keep FileReader, images can cause 413. Better to use URL/hosting.
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setForm((prev) => ({ ...prev, image: reader.result })); // ⚠️ big images may cause 413
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user?.email) {
      Swal.fire({
        icon: "warning",
        title: "Login required",
        text: "Please login to report an issue.",
        confirmButtonColor: "#2d361b",
      });
      return navigate("/login");
    }

    if (isBlocked) {
      Swal.fire({
        icon: "error",
        title: "Account blocked",
        text: "You cannot submit issues right now.",
        confirmButtonColor: "#2d361b",
      });
      return;
    }

    if (!canSubmit) {
      Swal.fire({
        icon: "info",
        title: "Free limit reached",
        text: "Free users can submit up to 3 issues. Upgrade to Premium for unlimited submissions.",
        confirmButtonColor: "#2d361b",
      });
      return;
    }

    const payload = {
      title: form.title.trim(),
      category: form.category,
      priority: form.priority || "normal",
      location: form.location.trim(),
      description: form.description.trim(),
      image: form.image, // URL preferred; base64 may cause 413
      status: "pending",

      // ✅ IMPORTANT for your /issues?reportedBy= filter
      reportedBy: user.email,
      reportedByName: user.displayName || "",
      userEmail: user.email, // keep both if your other code uses it
    };

    createMutation.mutate(payload);
  };

  if (profileQuery.isLoading || myIssuesQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eff0e1]">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }

  return (
    <section className="bg-[#eff0e1] min-h-screen py-8">
      <div className="w-11/12 mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2d361b]">Report an Issue</h1>
          <p className="text-[#2d361b]/70 mt-2">
            Free: 3 issues max. Premium: unlimited.
          </p>
        </div>

        {/* ✅ Requirement: if free + reached 3 => show subscription button */}
        {!isPremium && (
          <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-[#2d361b]">Free User Limit</h3>
                <p className="text-[#2d361b]/70 mt-1">
                  You used <span className="font-semibold">{issuesUsed}</span> / 3 issues. Remaining:{" "}
                  <span className="font-semibold">{remaining}</span>
                </p>
              </div>

              {!canSubmit && (
                <button
                  onClick={() => navigate("/dashboard/citizens/profile")}
                  className="btn bg-[#2d361b] text-[#d6d37c] rounded-2xl border-none"
                >
                  Upgrade to Premium
                </button>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-[#2d361b]/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text text-[#2d361b] font-semibold">Issue Title *</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                type="text"
                className="input input-bordered w-full bg-white"
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text text-[#2d361b] font-semibold">Category *</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
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
                value={form.priority}
                onChange={handleChange}
                className="select select-bordered w-full bg-white"
              >
                <option value="normal">Normal</option>
                <option value="high">High (Boost later)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text text-[#2d361b] font-semibold">Location *</span>
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                type="text"
                className="input input-bordered w-full bg-white"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text text-[#2d361b] font-semibold">Description *</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="textarea textarea-bordered w-full h-28 bg-white"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text text-[#2d361b] font-semibold">Photo Evidence *</span>
              </label>

              <div className="border-2 border-dashed border-[#2d361b]/30 rounded-2xl p-6 bg-[#eff0e1]/50">
                {imagePreview ? (
                  <div className="text-center">
                    <img src={imagePreview} alt="Preview" className="max-w-full max-h-64 mx-auto rounded-xl mb-4" />
                    <label className="btn btn-outline text-[#2d361b] rounded-2xl cursor-pointer">
                      Change Photo
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" required />
                    </label>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-[#2d361b] font-medium mb-2">Upload a clear photo</p>
                    <label className="btn bg-[#2d361b] text-[#d6d37c] rounded-2xl cursor-pointer border-none">
                      Select Photo
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" required />
                    </label>
                    {/* <p className="text-xs text-[#2d361b]/60 mt-2">
                      (If you face 413 error, use image URL hosting like imgbb later.)
                    </p> */}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-8 pt-6 border-t border-[#2d361b]/10">
            <button
              type="submit"
              className="btn bg-[#2d361b] text-[#d6d37c] rounded-2xl flex-1 border-none"
              disabled={createMutation.isPending || !canSubmit}
            >
              {createMutation.isPending ? "Submitting..." : "Submit Issue Report"}
            </button>

            {!canSubmit && !isPremium ? (
              <button
                type="button"
                onClick={() => navigate("/dashboard/citizens/profile")}
                className="btn bg-green-600 text-white rounded-2xl flex-1 border-none hover:bg-green-700"
              >
                Upgrade to Premium
              </button>
            ) : (
              <Link
                to="/dashboard/citizens/my-issues"
                className="btn btn-outline text-[#2d361b] rounded-2xl flex-1"
              >
                Cancel
              </Link>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default ReportIssue;
