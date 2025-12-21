import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Swal from "sweetalert2";
import { API_BASE } from "../../../utils/api";
import { authFetch } from "../../../utils/authFetch";
import InvoicePDF from "../../../components/InvoicePDF";

const AdminPayments = () => {
  const [emailFilter, setEmailFilter] = useState("");
  const [monthKey, setMonthKey] = useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-payments", emailFilter, monthKey],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (emailFilter.trim()) params.set("email", emailFilter.trim());
      if (monthKey.trim()) params.set("monthKey", monthKey.trim());

      const res = await authFetch(`${API_BASE}/admin/payments?${params.toString()}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to load payments");
      return json.payments || [];
    },
  });

  const payments = data || [];

  const total = useMemo(() => payments.reduce((sum, p) => sum + (p.amount || 0), 0), [payments]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eff0e1]">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#eff0e1] min-h-screen flex items-center justify-center">
        <p className="text-[#2d361b] font-semibold">Failed to load payments.</p>
      </div>
    );
  }

  return (
    <section className="bg-[#eff0e1] min-h-screen py-8">
      <div className="w-11/12 mx-auto space-y-5">
        <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#2d361b]">Payments</h1>
            <p className="text-[#2d361b]/70 mt-2">All subscription payments</p>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              className="input input-bordered rounded-2xl"
              placeholder="Filter by email"
            />
            <input
              value={monthKey}
              onChange={(e) => setMonthKey(e.target.value)}
              className="input input-bordered rounded-2xl"
              placeholder="MonthKey (YYYY-MM)"
            />
            <button
              onClick={() => {
                setEmailFilter("");
                setMonthKey("");
                Swal.fire({ icon: "success", title: "Filters cleared", timer: 900, showConfirmButton: false });
                refetch();
              }}
              className="btn rounded-2xl bg-[#2d361b] text-[#d6d37c]"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#2d361b]/10 p-4">
          <p className="text-[#2d361b] font-semibold">Total collected: {total} tk</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#2d361b]/10 overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="text-[#2d361b]">
                <th>Email</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Transaction</th>
                <th>Date</th>
                <th className="text-right">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-[#2d361b]/70">
                    No payments found.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p._id}>
                    <td className="font-semibold text-[#2d361b]">{p.email}</td>
                    <td>{p.amount} tk</td>
                    <td>{p.method || "-"}</td>
                    <td className="text-xs">{p.transactionId || "-"}</td>
                    <td>{p.createdAt ? new Date(p.createdAt).toLocaleString() : "-"}</td>
                    <td className="text-right">
                      <PDFDownloadLink
                        document={<InvoicePDF payment={p} />}
                        fileName={`invoice-${p.email}-${p.transactionId || "payment"}.pdf`}
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

export default AdminPayments;
