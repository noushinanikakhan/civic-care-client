import React from "react";
import { Link } from "react-router";

const MyIssues = () => {
  // Static data for now
  const issues = [
    {
      id: 1,
      title: "Pothole on Main Street",
      category: "Road Damage",
      status: "Pending",
      priority: "Normal",
      date: "2024-12-15",
      location: "Downtown",
      description: "Large pothole causing traffic issues",
    },
    {
      id: 2,
      title: "Broken Streetlight",
      category: "Public Lighting",
      status: "In Progress",
      priority: "High",
      date: "2024-12-10",
      location: "North Park",
      description: "Streetlight not working for 3 days",
    },
    {
      id: 3,
      title: "Garbage Overflow",
      category: "Sanitation",
      status: "Resolved",
      priority: "Normal",
      date: "2024-12-05",
      location: "Market Area",
      description: "Garbage bin overflowing for 2 days",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "badge-warning text-[#2d361b]";
      case "In Progress": return "badge-info text-[#2d361b]";
      case "Resolved": return "badge-success text-white";
      case "Closed": return "badge-neutral text-[#2d361b]";
      default: return "badge-ghost";
    }
  };

  const getPriorityColor = (priority) => {
    return priority === "High" 
      ? "badge-error text-white" 
      : "badge-outline text-[#2d361b]";
  };

  return (
    <section className="bg-[#eff0e1] min-h-screen py-8">
      <div className="w-11/12 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2d361b]">My Issues</h1>
          <p className="text-[#2d361b]/70 mt-2">
            Track and manage all your reported issues
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
            <p className="text-sm text-[#2d361b]/70">Total Issues</p>
            <p className="text-3xl font-bold text-[#2d361b] mt-2">3</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
            <p className="text-sm text-[#2d361b]/70">Pending</p>
            <p className="text-3xl font-bold text-[#2d361b] mt-2">1</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
            <p className="text-sm text-[#2d361b]/70">In Progress</p>
            <p className="text-3xl font-bold text-[#2d361b] mt-2">1</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
            <p className="text-sm text-[#2d361b]/70">Resolved</p>
            <p className="text-3xl font-bold text-[#2d361b] mt-2">1</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <select className="select select-bordered w-full md:w-auto bg-white">
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            
            <select className="select select-bordered w-full md:w-auto bg-white">
              <option value="">All Categories</option>
              <option value="road">Road Damage</option>
              <option value="lighting">Public Lighting</option>
              <option value="sanitation">Sanitation</option>
              <option value="water">Water Issues</option>
            </select>
            
            <button className="btn bg-[#2d361b] text-[#d6d37c] rounded-2xl">
              Apply Filters
            </button>
          </div>
        </div>

        {/* Issues Table */}
        <div className="bg-white rounded-2xl overflow-hidden border border-[#2d361b]/10">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-[#eff0e1]">
                <tr>
                  <th className="text-[#2d361b]">Issue Title</th>
                  <th className="text-[#2d361b]">Category</th>
                  <th className="text-[#2d361b]">Status</th>
                  <th className="text-[#2d361b]">Priority</th>
                  <th className="text-[#2d361b]">Date</th>
                  <th className="text-[#2d361b]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-[#eff0e1]/50">
                    <td>
                      <div>
                        <p className="font-medium text-[#2d361b]">{issue.title}</p>
                        <p className="text-sm text-[#2d361b]/70">{issue.location}</p>
                      </div>
                    </td>
                    <td>
                      <span className="text-[#2d361b]">{issue.category}</span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusColor(issue.status)}`}>
                        {issue.status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                    </td>
                    <td className="text-[#2d361b]/70">{issue.date}</td>
                    <td>
                      <div className="flex gap-2">
                        <Link 
                          to={`/dashboard/issues/${issue.id}`}
                          className="btn btn-sm bg-[#2d361b] text-[#d6d37c] rounded-2xl"
                        >
                          View
                        </Link>
                        {issue.status === "Pending" && (
                          <>
                            <button className="btn btn-sm btn-outline text-[#2d361b] rounded-2xl">
                              Edit
                            </button>
                            <button className="btn btn-sm btn-error text-white rounded-2xl">
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State (commented out for now) */}
        {/* <div className="text-center py-12">
          <div className="inline-block p-6 rounded-full bg-[#eff0e1] mb-4">
            <svg className="w-12 h-12 text-[#2d361b]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[#2d361b]">No Issues Yet</h3>
          <p className="text-[#2d361b]/70 mt-2 max-w-md mx-auto">
            You haven't reported any issues yet. Click the button below to report your first issue.
          </p>
          <Link to="/dashboard/report-issue" className="btn bg-[#2d361b] text-[#d6d37c] rounded-2xl mt-4">
            Report Your First Issue
          </Link>
        </div> */}
      </div>
    </section>
  );
};

export default MyIssues;