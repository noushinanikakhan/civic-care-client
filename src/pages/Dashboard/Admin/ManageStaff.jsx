import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authFetch } from "../../../utils/authFetch";
import useAuth from "../../../hooks/useAuth";
import { API_BASE } from "../../../utils/api";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  photoURL: "",
  password: "",
};

const ManageStaff = () => {
  const qc = useQueryClient();
  const { user, loading } = useAuth();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create"); // create | update
  const [form, setForm] = useState(emptyForm);

  const enabled = useMemo(() => !!user?.email && !loading, [user?.email, loading]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-staff"],
    enabled,
    queryFn: async () => {
      const res = await authFetch(`${API_BASE}/admin/staff`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to load staff");
      return json.staff || [];
    },
  });

  const staff = data || [];

  const openCreate = () => {
    setMode("create");
    setForm(emptyForm);
    setOpen(true);
  };

  const openUpdate = (s) => {
    setMode("update");
    setForm({
      name: s.name || "",
      email: s.email || "",
      phone: s.phone || "",
      photoURL: s.photoURL || "",
      password: s.staffPassword || "", // ✅ show stored password
    });
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setForm(emptyForm);
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        photoURL: form.photoURL.trim(),
        password: form.password,
      };

      const res = await authFetch(`${API_BASE}/admin/staff`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to create staff");
      return json;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin-staff"] });
      closeModal();
      Swal.fire({ icon: "success", title: "Staff created!", timer: 1200, showConfirmButton: false });
    },
    onError: (err) => Swal.fire({ icon: "error", title: "Failed", text: err.message }),
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        photoURL: form.photoURL.trim(),
        password: form.password, // ✅ update password too (Firebase + Mongo)
      };

      const res = await authFetch(`${API_BASE}/admin/staff/${encodeURIComponent(form.email)}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to update staff");
      return json;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin-staff"] });
      closeModal();
      Swal.fire({ icon: "success", title: "Updated!", timer: 1200, showConfirmButton: false });
    },
    onError: (err) => Swal.fire({ icon: "error", title: "Failed", text: err.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (email) => {
      const res = await authFetch(`${API_BASE}/admin/staff/${encodeURIComponent(email)}`, {
        method: "DELETE",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to delete staff");
      return json;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin-staff"] });
      Swal.fire({ icon: "success", title: "Deleted!", timer: 1200, showConfirmButton: false });
    },
    onError: (err) => Swal.fire({ icon: "error", title: "Failed", text: err.message }),
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "create") {
      if (!form.name || !form.email || !form.password) {
        Swal.fire({ icon: "warning", title: "Missing", text: "Name, Email, Password required." });
        return;
      }
      createMutation.mutate();
      return;
    }

    // update
    if (!form.name || !form.email) {
      Swal.fire({ icon: "warning", title: "Missing", text: "Name and Email required." });
      return;
    }
    updateMutation.mutate();
  };

  const handleDelete = async (s) => {
    const ok = await Swal.fire({
      icon: "warning",
      title: "Delete staff?",
      text: "You cannot change after delete.",
      showCancelButton: true,
      confirmButtonColor: "#2d361b",
      confirmButtonText: "Delete",
    });

    if (ok.isConfirmed) deleteMutation.mutate(s.email);
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eff0e1]">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#eff0e1] min-h-screen flex items-center justify-center">
        <p className="text-[#2d361b] font-semibold">{error.message}</p>
      </div>
    );
  }

  return (
    <section className="bg-[#eff0e1] min-h-screen">
      <div className="w-11/12 mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#2d361b]">Manage Staff</h1>
            <p className="text-[#2d361b]/70 mt-2">Add, update, delete staff.</p>
          </div>

          <button className="btn bg-[#2d361b] text-[#d6d37c] rounded-2xl" onClick={openCreate}>
            Add Staff
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#2d361b]/10 overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="text-[#2d361b]">
                <th>Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Password</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {staff.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#2d361b]/70">
                    No staff found.
                  </td>
                </tr>
              ) : (
                staff.map((s) => (
                  <tr key={s._id || s.email}>
                    <td>
                      <div className="avatar">
                        <div className="w-10 rounded-full ring ring-[#2d361b]/20 ring-offset-2">
                          <img
                            src={s.photoURL || "https://i.ibb.co/2dR2x9f/user.png"}
                            alt="staff"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="font-semibold text-[#2d361b]">{s.name || "Unnamed"}</td>
                    <td>{s.email}</td>
                    <td>{s.phone || "-"}</td>
                    <td className="text-sm">{s.staffPassword || "-"}</td>
                    <td className="text-right space-x-2">
                      <button
                        className="btn btn-sm btn-outline border-[#2d361b] text-[#2d361b] rounded-xl"
                        onClick={() => openUpdate(s)}
                      >
                        Update
                      </button>

                      <button
                        className="btn btn-sm btn-outline border-red-600 text-red-600 rounded-xl"
                        onClick={() => handleDelete(s)}
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-3">
            <div className="w-full max-w-lg bg-white rounded-2xl p-6 border border-[#2d361b]/10">
              <h2 className="text-xl font-bold text-[#2d361b]">
                {mode === "create" ? "Add Staff" : "Update Staff"}
              </h2>

              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <input
                  className="input input-bordered w-full"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                />

                <input
                  className="input input-bordered w-full"
                  placeholder="Email"
                  value={form.email}
                  disabled={mode !== "create"}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                />

                <input
                  className="input input-bordered w-full"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                />

                <input
                  className="input input-bordered w-full"
                  placeholder="Photo URL"
                  value={form.photoURL}
                  onChange={(e) => setForm((p) => ({ ...p, photoURL: e.target.value }))}
                />

                <input
                  className="input input-bordered w-full"
                  placeholder="Password"
                  type="text"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                />

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" className="btn btn-ghost" onClick={closeModal}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn bg-[#2d361b] text-[#d6d37c] rounded-2xl"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    Save
                  </button>
                </div>
              </form>

            
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ManageStaff;
