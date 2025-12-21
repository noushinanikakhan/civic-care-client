import React, { useState } from "react";
import Swal from "sweetalert2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import { API_BASE } from "../../../utils/api";
import { authFetch } from "../../../utils/authFetch";

const StaffProfile = () => {
  const { user, loading } = useAuth();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["user-profile", user?.email],
    enabled: !!user?.email && !loading,
    queryFn: async () => {
      const res = await authFetch(`${API_BASE}/users/profile/${encodeURIComponent(user.email)}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to load profile");
      return json.user;
    },
  });

  const profile = data || {};
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  const updateMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: (name || profile.name || "").trim(),
        photoURL: (photoURL || profile.photoURL || "").trim(),
      };

      const res = await authFetch(`${API_BASE}/users/profile`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to update profile");
      return json;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["user-profile", user?.email] });
      Swal.fire({ icon: "success", title: "Profile updated!", timer: 1000, showConfirmButton: false });
    },
    onError: (err) => Swal.fire({ icon: "error", title: "Failed", text: err.message, confirmButtonColor: "#2d361b" }),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eff0e1]">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }

  return (
    <section className="bg-[#eff0e1] min-h-screen py-8">
      <div className="w-11/12 mx-auto max-w-3xl space-y-5">
        <div>
          <h1 className="text-3xl font-bold text-[#2d361b]">Staff Profile</h1>
          <p className="text-[#2d361b]/70 mt-2">Update your name and photo URL.</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#2d361b]/10 p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="avatar">
              <div className="w-20 rounded-2xl bg-[#eff0e1]">
                {/* fallback */}
                <img
                  src={photoURL || profile.photoURL || "https://via.placeholder.com/150"}
                  alt="Profile"
                />
              </div>
            </div>

            <div>
              <p className="text-lg font-semibold text-[#2d361b]">{profile.name || "Unnamed"}</p>
              <p className="text-sm text-[#2d361b]/70">{profile.email}</p>
              <span className="badge badge-ghost mt-2">{profile.role || "staff"}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text text-[#2d361b]">Name</span>
              </label>
              <input
                className="input input-bordered w-full rounded-xl"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={profile.name || "Enter your name"}
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text text-[#2d361b]">Photo URL</span>
              </label>
              <input
                className="input input-bordered w-full rounded-xl"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder={profile.photoURL || "Paste image URL"}
              />
            </div>
          </div>

          <button
            className="btn rounded-2xl bg-[#2d361b] text-[#d6d37c] w-full"
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default StaffProfile;
