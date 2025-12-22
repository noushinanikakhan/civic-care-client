import React from "react";
import { Link, NavLink, Outlet } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Logo from "../components/Logo/Logo";
import useAuth from "../hooks/useAuth";
import { authFetch } from "../utils/authFetch";
import { API_BASE } from "../utils/api";

const DashboardLayout = () => {
  const { user, loading } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-role", user?.email],
    enabled: !!user?.email && !loading,
    queryFn: async () => {
      const res = await authFetch(
        `${API_BASE}/users/profile/${encodeURIComponent(user.email)}`
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || "Failed to load profile");
      return json.user; // ✅ server returns { success, user }
    },
  });

  const role = ((data?.role || "citizen") + "").toLowerCase();

  const navClass = ({ isActive }) =>
    `gap-2 rounded-xl ${
      isActive ? "bg-[#d6d37c]/40" : "hover:bg-[#d6d37c]/30"
    }`;

  const MenuCitizen = () => (
    <>
      <li>
        <NavLink to="/dashboard/citizens/my-issues" className={navClass}>
          🧾 My Issues
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/citizens/report-issue" className={navClass}>
          ➕ Report Issue
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/citizens/profile" className={navClass}>
          👤 My Profile
        </NavLink>
      </li>
    </>
  );

  const MenuStaff = () => (
    <>
      <li>
        <NavLink to="/dashboard/staff" className={navClass}>
          🛠 Staff Dashboard
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/staff/assigned-issues" className={navClass}>
          📌 Assigned Issues
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/staff/profile" className={navClass}>
          👤 My Profile
        </NavLink>
      </li>
    </>
  );

  const MenuAdmin = () => (
    <>
      <li>
        <NavLink to="/dashboard/admin" className={navClass}>
          📊 Dashboard
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/admin/all-issues" className={navClass}>
          📋 All Issues
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/admin/manage-users" className={navClass}>
          👥 Manage Users
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/admin/manage-staff" className={navClass}>
          🧑‍🔧 Manage Staff
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/admin/payments" className={navClass}>
          💳 Payments
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/admin/profile" className={navClass}>
          👤 Profile
        </NavLink>
      </li>
    </>
  );

  const panelTitle =
    role === "admin" ? "Admin Panel" : role === "staff" ? "Staff Panel" : "Citizen Panel";

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eff0e1]">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-[#eff0e1]">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* MAIN CONTENT */}
      <div className="drawer-content flex flex-col">
        {/* TOP NAVBAR */}
        <nav className="navbar bg-[#eff0e1] border-b border-[#2d361b]/20 px-4">
          <label
            htmlFor="dashboard-drawer"
            className="btn btn-ghost lg:hidden text-[#2d361b]"
          >
            ☰
          </label>

          <Link to="/dashboard" className="flex items-center gap-2">
            <Logo size={32} />
            <span className="text-xl font-bold text-[#2d361b]">
              CivicCare Dashboard
            </span>
          </Link>

          <div className="ml-auto">
            <span className="btn btn-sm btn-outline border-[#2d361b] text-[#2d361b]">
              Role: {panelTitle.replace(" Panel", "")}
            </span>
          </div>
        </nav>

        {/* PAGE CONTENT */}
        <div className="p-6 flex-1">
          <Outlet />
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>

        <aside className="w-64 bg-[#dde4c8] text-[#2d361b] min-h-full px-4 py-6 border-r border-[#2d361b]/15">
          <div className="mb-8 flex items-center gap-2">
            <Logo size={28} />
            <h2 className="text-lg font-semibold">{panelTitle}</h2>
          </div>

          <ul className="menu gap-1 font-medium">
            {role === "admin" ? <MenuAdmin /> : role === "staff" ? <MenuStaff /> : <MenuCitizen />}

            <div className="divider my-3"></div>

            <li>
              <NavLink to="/" className={navClass}>
                ⬅ Back to Home
              </NavLink>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;
