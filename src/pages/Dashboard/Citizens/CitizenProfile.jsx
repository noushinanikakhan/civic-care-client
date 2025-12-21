// src/pages/Dashboard/Citizens/CitizenProfile.jsx
import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PDFDownloadLink } from "@react-pdf/renderer";

import useAuth from "../../../hooks/useAuth";
import { API_BASE } from "../../../utils/api";
import { authFetch } from "../../../utils/authFetch";

// ✅ make sure this file exists (I gave you before)
import InvoicePDF from "../../../components/InvoicePDF";

const CitizenProfile = () => {
  const qc = useQueryClient();
  const { user, loading } = useAuth();

  // -----------------------------
  // ✅ 1) LOAD PROFILE (Mongo)
  // -----------------------------
  const profileQuery = useQuery({
    queryKey: ["user-profile", user?.email],
    enabled: !!user?.email && !loading, // ✅ keep ONLY this enabled (no duplicates)
    queryFn: async () => {
      const res = await authFetch(`${API_BASE}/users/profile/${encodeURIComponent(user.email)}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to load profile");
      return json.user; // server returns { success:true, user:{} }
    },
  });

   // ✅ FIX 1: define profile BEFORE using it anywhere
  const profile = profileQuery.data;

  // ✅ FIX 2: safe image fallback (Mongo photoURL -> Firebase photoURL -> default)
  const displayPhoto =
    profile?.photoURL ||
    user?.photoURL ||
    "https://i.ibb.co/2P9QmWJ/default-avatar.png";


  // -----------------------------
  // ✅ 2) LOAD MY PAYMENTS
  // -----------------------------
  const paymentsQuery = useQuery({
    queryKey: ["my-payments", user?.email],
    enabled: !!user?.email && !loading,
    queryFn: async () => {
      const res = await authFetch(`${API_BASE}/payments/my`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to load payments");
      return json.payments || [];
    },
  });

  // const profile = profileQuery.data;
  const myPayments = paymentsQuery.data || [];

  const latestPayment = myPayments[0];
  const totalPayments = useMemo(() => myPayments.reduce((sum, p) => sum + (p.amount || 0), 0), [myPayments]);

  const isPremium = !!profile?.isPremium;
  const isBlocked = !!profile?.isBlocked;

  // -----------------------------
  // ✅ 3) LOCAL STATE FOR EDIT
  // -----------------------------
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  React.useEffect(() => {
    if (profile) {
      setName(profile?.name || "");
      setPhotoURL(profile?.photoURL || "");
    }
  }, [profile?._id]); // only reset when user doc changes

  // -----------------------------
  // ✅ 4) UPDATE PROFILE (Mongo)
  // -----------------------------
  const updateProfileMutation = useMutation({
    mutationFn: async () => {
     const res = await authFetch(`${API_BASE}/users/profile`, {
  method: "PATCH",
  body: JSON.stringify({ name, photoURL }),
});

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to update profile");
      return json;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["user-profile", user?.email] });
      Swal.fire({ icon: "success", title: "Profile updated", timer: 1100, showConfirmButton: false });
    },
    onError: (err) => {
      Swal.fire({ icon: "error", title: "Update Failed", text: err.message, confirmButtonColor: "#2d361b" });
    },
  });

  // -----------------------------
  // ✅ 5) SUBSCRIBE PREMIUM (1000tk)
  // -----------------------------
  const subscribeMutation = useMutation({
    mutationFn: async () => {
      const transactionId = `TRX-${Date.now()}`; // assignment
      const res = await authFetch(`${API_BASE}/payments/subscribe`, {
        method: "POST",
        body: JSON.stringify({ transactionId, method: "assignment" }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Payment failed");
      return json;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["user-profile", user?.email] });
      await qc.invalidateQueries({ queryKey: ["my-payments", user?.email] });

      Swal.fire({ icon: "success", title: "Premium activated!", timer: 1200, showConfirmButton: false });
    },
    onError: (err) => {
      Swal.fire({ icon: "error", title: "Payment Failed", text: err.message, confirmButtonColor: "#2d361b" });
    },
  });

  const handleSubscribe = async () => {
    if (isBlocked) {
      Swal.fire({
        icon: "warning",
        title: "Blocked user",
        text: "You are blocked. Please contact the authorities.",
        confirmButtonColor: "#2d361b",
      });
      return;
    }

    if (isPremium) {
      Swal.fire({
        icon: "info",
        title: "Already Premium",
        text: "You already have premium access.",
        confirmButtonColor: "#2d361b",
      });
      return;
    }

    const ok = await Swal.fire({
      icon: "question",
      title: "Subscribe for 1000tk?",
      text: "After payment you can report unlimited issues.",
      showCancelButton: true,
      confirmButtonColor: "#2d361b",
      confirmButtonText: "Pay 1000tk",
    });

    if (ok.isConfirmed) subscribeMutation.mutate();
  };

  // -----------------------------
  // ✅ LOADING / ERROR UI
  // -----------------------------
  if (loading || profileQuery.isLoading || paymentsQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eff0e1]">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }

  if (profileQuery.isError) {
    return (
      <div className="bg-[#eff0e1] min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10 w-full max-w-xl">
          <p className="text-[#2d361b] font-semibold">Failed to load profile.</p>
          <p className="text-[#2d361b]/70 mt-2">{String(profileQuery.error?.message || "")}</p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-[#eff0e1] min-h-screen py-8">
      <div className="w-11/12 mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#2d361b]">My Profile</h1>
            <p className="text-[#2d361b]/70 mt-2">View and update your profile information.</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {isPremium && (
              <span className="badge badge-success text-white px-4 py-3 rounded-xl">Premium</span>
            )}

            {isBlocked && (
              <span className="badge badge-error text-white px-4 py-3 rounded-xl">Blocked</span>
            )}

            {!isPremium && (
              <button
                onClick={handleSubscribe}
                disabled={subscribeMutation.isPending}
                className="btn rounded-2xl bg-green-600 text-white hover:bg-green-700"
              >
                {subscribeMutation.isPending ? "Processing..." : "Subscribe 1000tk"}
              </button>
            )}

            {latestPayment && (
              <PDFDownloadLink
                document={<InvoicePDF payment={latestPayment} />}
                fileName={`invoice-${latestPayment.transactionId || "premium"}.pdf`}
                className="btn rounded-2xl btn-outline border-[#2d361b] text-[#2d361b]"
              >
                Download Invoice
              </PDFDownloadLink>
            )}
          </div>
        </div>

        {/* Blocked warning */}
        {isBlocked && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <p className="text-red-700 font-semibold">You are blocked by admin.</p>
            <p className="text-red-700/80 mt-1">
              You can log in, but cannot submit, edit, upvote, or boost issues. Please contact authorities.
            </p>
          </div>
        )}

        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-[#2d361b]/10 p-6">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex items-center gap-4">
              <div className="avatar">
                <div className="w-20 rounded-2xl ring ring-[#2d361b]/20 ring-offset-base-100 ring-offset-2">
                  <img src={displayPhoto || null} alt="Profile" />

                </div>
              </div>

              <div>
                <p className="text-xl font-bold text-[#2d361b]">{profile?.name || "Unnamed"}</p>
                <p className="text-[#2d361b]/70">{profile?.email}</p>
                <p className="text-sm text-[#2d361b]/70 mt-1">Role: {profile?.role || "citizen"}</p>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text text-[#2d361b] font-semibold">Name</span>
                </label>
                <input
                  className="input input-bordered w-full rounded-2xl"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  disabled={isBlocked}
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text text-[#2d361b] font-semibold">Photo URL</span>
                </label>
                <input
                  className="input input-bordered w-full rounded-2xl"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="https://..."
                  disabled={isBlocked}
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button
                  onClick={() => updateProfileMutation.mutate()}
                  disabled={isBlocked || updateProfileMutation.isPending}
                  className="btn rounded-2xl bg-[#2d361b] text-[#d6d37c] hover:bg-[#233015]"
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payments summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
            <p className="text-sm text-[#2d361b]/70">Subscription</p>
            <p className="text-2xl font-bold text-[#2d361b] mt-2">
              {isPremium ? "Premium" : "Free"}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
            <p className="text-sm text-[#2d361b]/70">Total Payments</p>
            <p className="text-2xl font-bold text-[#2d361b] mt-2">{totalPayments} tk</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
            <p className="text-sm text-[#2d361b]/70">Last Transaction</p>
            <p className="text-sm font-semibold text-[#2d361b] mt-2 break-all">
              {latestPayment?.transactionId || "-"}
            </p>
          </div>
        </div>

        {/* Payments table (optional but helpful) */}
        <div className="bg-white rounded-2xl border border-[#2d361b]/10 overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="text-[#2d361b]">
                <th>Amount</th>
                <th>Method</th>
                <th>Transaction</th>
                <th>Date</th>
                <th className="text-right">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {myPayments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-[#2d361b]/70">
                    No payments found.
                  </td>
                </tr>
              ) : (
                myPayments.map((p) => (
                  <tr key={p._id}>
                    <td>{p.amount} tk</td>
                    <td>{p.method || "-"}</td>
                    <td className="text-xs">{p.transactionId || "-"}</td>
                    <td>{p.createdAt ? new Date(p.createdAt).toLocaleString() : "-"}</td>
                    <td className="text-right">
                      <PDFDownloadLink
                        document={<InvoicePDF payment={p} />}
                        fileName={`invoice-${p.transactionId || "payment"}.pdf`}
                        className="btn btn-sm rounded-xl bg-[#2d361b] text-[#d6d37c]"
                      >
                        Download
                      </PDFDownloadLink>
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

export default CitizenProfile;
