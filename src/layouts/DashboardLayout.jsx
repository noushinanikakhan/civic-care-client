import React from "react";
import { Link, Outlet } from "react-router";
import Logo from "../components/Logo/Logo";

const DashboardLayout = () => {
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

          <div className="flex items-center gap-2">
            <Logo size={32} />
            <span className="text-xl font-bold text-[#2d361b]">
              CivicCare Dashboard
            </span>
          </div>
          
          {/* Role Switcher - Static for now */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-sm btn-outline border-[#2d361b] text-[#2d361b]">
              Role: Citizen
            </div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
              <li><Link to="/dashboard/citizens">Citizen Panel</Link></li>
              <li><Link to="/dashboard/staff">Staff Panel</Link></li>
              <li><Link to="/dashboard/admin">Admin Panel</Link></li>
            </ul>
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
          {/* Sidebar Header */}
          <div className="mb-8 flex items-center gap-2">
            <Logo size={28} />
            <h2 className="text-lg font-semibold">Citizen Panel</h2>
          </div>

          {/* Role Switcher in Sidebar */}
          <div className="mb-6">
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-sm btn-outline border-[#2d361b] text-[#2d361b] w-full justify-start">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M19 9l-7 7-7-7" />
                </svg>
                Switch Role
              </div>
              <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-full p-2 shadow">
                <li><Link to="/dashboard/citizens" className="active:bg-[#d6d37c]/30">Citizen Panel</Link></li>
                <li><Link to="/dashboard/staff" className="active:bg-[#d6d37c]/30">Staff Panel</Link></li>
                <li><Link to="/dashboard/admin" className="active:bg-[#d6d37c]/30">Admin Panel</Link></li>
              </ul>
            </div>
          </div>

          {/* Navigation */}
          <ul className="menu gap-1 font-medium">
            {/* My Issues */}
            <li>
              <Link to="/dashboard/citizens/my-issues" className="hover:bg-[#d6d37c]/30 gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 7h16" />
                  <path d="M4 7v13h16V7" />
                  <path d="M9 3h6v4H9z" />
                </svg>
                My Issues
              </Link>
            </li>

            {/* Report Issue */}
            <li>
              <Link to="/dashboard/citizens/report-issue" className="hover:bg-[#d6d37c]/30 gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
                Report Issue
              </Link>
            </li>

            {/* Profile */}
            <li>
              <Link to="/dashboard/citizens/profile" className="hover:bg-[#d6d37c]/30 gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                My Profile
              </Link>
            </li>

            <div className="divider my-3"></div>

            {/* Back to Home */}
            <li>
              <Link to="/" className="hover:bg-[#d6d37c]/30 gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </Link>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;