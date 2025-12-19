import React from "react";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE } from "../../../utils/api";
import { authFetch } from "../../../utils/authFetch";

const ManageUsers = () => {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await authFetch(`${API_BASE}/users`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to load users");
      return json.users || [];
    },
  });

  const users = (data || []).filter((u) => (u.role || "").toLowerCase() === "citizen");

  const toggleMutation = useMutation({
    mutationFn: async (email) => {
      const res = await authFetch(`${API_BASE}/users/${encodeURIComponent(email)}/toggle-block`, {
        method: "PATCH",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to toggle block");
      return json;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin-users"] });
      Swal.fire({ icon: "success", title: "Updated!", timer: 1200, showConfirmButton: false });
    },
    onError: (err) => Swal.fire({ icon: "error", title: "Failed", text: err.message }),
  });

  const handleToggle = async (u) => {
    const ok = await Swal.fire({
      icon: "warning",
      title: u.isBlocked ? "Unblock this user?" : "Block this user?",
      text: "This will update the database immediately.",
      showCancelButton: true,
      confirmButtonColor: "#2d361b",
      confirmButtonText: u.isBlocked ? "Unblock" : "Block",
    });

    if (ok.isConfirmed) toggleMutation.mutate(u.email);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eff0e1]">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }

  return (
    <section className="bg-[#eff0e1] min-h-screen">
      <div className="w-11/12 mx-auto space-y-5">
        <div>
          <h1 className="text-3xl font-bold text-[#2d361b]">Manage Users</h1>
          <p className="text-[#2d361b]/70 mt-2">Only citizen users are shown here.</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#2d361b]/10 overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="text-[#2d361b]">
                <th>Name</th>
                <th>Email</th>
                <th>Subscription</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-[#2d361b]/70">
                    No citizen users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id}>
                    <td className="font-semibold text-[#2d361b]">{u.name || "Unnamed"}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className="badge badge-ghost">
                        {u.isPremium ? "Premium" : "Free"}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${u.isBlocked ? "badge-error" : "badge-success"}`}>
                        {u.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        className="btn btn-sm btn-outline border-[#2d361b] text-[#2d361b] rounded-xl"
                        onClick={() => handleToggle(u)}
                      >
                        {u.isBlocked ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ManageUsers;
