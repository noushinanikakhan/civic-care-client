import React from "react";

const StaffDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#2d361b]">Staff Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-white shadow-md p-6">
          <h3 className="text-lg font-semibold">Assigned Issues</h3>
          <p className="text-3xl font-bold text-blue-600">12</p>
        </div>
        <div className="card bg-white shadow-md p-6">
          <h3 className="text-lg font-semibold">Issues Resolved</h3>
          <p className="text-3xl font-bold text-green-600">8</p>
        </div>
        <div className="card bg-white shadow-md p-6">
          <h3 className="text-lg font-semibold">Today's Tasks</h3>
          <p className="text-3xl font-bold text-yellow-600">4</p>
        </div>
      </div>
      <div className="bg-white shadow-md p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Recent Assigned Issues</h3>
        <p className="text-gray-600">Staff dashboard content will be implemented with dynamic data later.</p>
      </div>
    </div>
  );
};

export default StaffDashboard;