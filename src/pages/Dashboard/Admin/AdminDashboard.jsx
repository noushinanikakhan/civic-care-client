import React from "react";

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#2d361b]">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card bg-white shadow-md p-6">
          <h3 className="text-lg font-semibold">Total Issues</h3>
          <p className="text-3xl font-bold text-blue-600">156</p>
        </div>
        <div className="card bg-white shadow-md p-6">
          <h3 className="text-lg font-semibold">Resolved Issues</h3>
          <p className="text-3xl font-bold text-green-600">89</p>
        </div>
        <div className="card bg-white shadow-md p-6">
          <h3 className="text-lg font-semibold">Pending Issues</h3>
          <p className="text-3xl font-bold text-yellow-600">42</p>
        </div>
        <div className="card bg-white shadow-md p-6">
          <h3 className="text-lg font-semibold">Total Payments</h3>
          <p className="text-3xl font-bold text-purple-600">৳25,400</p>
        </div>
      </div>
      <div className="bg-white shadow-md p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">System Overview</h3>
        <p className="text-gray-600">Admin dashboard content will be implemented with dynamic data and management features later.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;