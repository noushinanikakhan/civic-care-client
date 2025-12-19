import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import { API_BASE } from "../../../utils/api";
import { authFetch } from "../../../utils/authFetch";

const AdminProfile = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-profile", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await authFetch(
        `${API_BASE}/users/profile/${encodeURIComponent(user.email)}`
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to load profile");
      return json.user;
    },
  });

  const [form, setForm] = useState({
    name: "",
    photoURL: "",
    phone: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || "",
        photoURL: data.photoURL || "",
        phone: data.phone || "",
      });
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await authFetch(`${API_BASE}/users/profile`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to update profile");
      return json;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["my-profile", user?.email] });
      Swal.fire({
        icon: "success",
        title: "Profile updated",
        timer: 1200,
        showConfirmButton: false,
      });
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: err.message,
      });
    },
  });

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    updateMutation.mutate({
      name: form.name.trim(),
      photoURL: form.photoURL.trim(),
      phone: form.phone.trim(),
    });
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
      <div className="bg-[#eff0e1] p-6 rounded-2xl">
        <p className="text-[#2d361b] font-semibold">Failed to load profile.</p>
      </div>
    );
  }

  return (
    <section className="bg-[#eff0e1] min-h-screen py-8">
      <div className="w-11/12 mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#2d361b]">Admin Profile</h1>
          <p className="text-[#2d361b]/70 mt-2">
            View and update your admin information.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#2d361b]/10 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#2d361b]/10">
              <img
                src={form.photoURL || "https://i.ibb.co/2y7bB6m/user.png"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <p className="text-[#2d361b] font-bold">{data?.name || "Admin"}</p>
              <p className="text-[#2d361b]/70 text-sm">{data?.email}</p>
              <span className="badge badge-warning mt-2">Admin</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text text-[#2d361b]">Name</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text text-[#2d361b]">Photo URL</span>
              </label>
              <input
                name="photoURL"
                value={form.photoURL}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text text-[#2d361b]">Phone</span>
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="01XXXXXXXXX"
              />
            </div>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="btn bg-[#2d361b] text-[#d6d37c] rounded-2xl w-full"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AdminProfile;
