import React, { useState } from "react";
import { Link } from "react-router";

const ReportIssue = () => {
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Static submission for now
    alert("Issue report submitted successfully! (Static demo)");
  };

  return (
    <section className="bg-[#eff0e1] min-h-screen py-8">
      <div className="w-11/12 mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2d361b]">Report an Issue</h1>
          <p className="text-[#2d361b]/70 mt-2">
            Help improve your community by reporting public infrastructure issues
          </p>
        </div>

        {/* Free User Limit Warning */}
        <div className="bg-gradient-to-r from-[#1c260f] to-[#1f2b12] text-[#f4f6e8] rounded-2xl p-6 mb-8 border border-[#2f3a1a]">
          <div className="flex items-start gap-4">
            <div className="bg-[#2d361b] p-3 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Free User Limit</h3>
              <p className="mt-2 text-[#9aa36a]">
                Free users can submit up to 3 issues. You have submitted 3 out of 3 issues.
                Upgrade to Premium for unlimited submissions.
              </p>
              <Link 
                to="/dashboard/profile" 
                className="btn bg-[#d6d37c] text-[#2d361b] border-none mt-3 rounded-2xl hover:bg-[#c4c16a]"
              >
                Upgrade to Premium
              </Link>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-[#2d361b]/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Issue Title */}
            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text text-[#2d361b] font-semibold">Issue Title *</span>
              </label>
              <input
                type="text"
                placeholder="Brief title of the issue (e.g., 'Large pothole on Main Street')"
                className="input input-bordered w-full bg-white"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="label">
                <span className="label-text text-[#2d361b] font-semibold">Category *</span>
              </label>
              <select className="select select-bordered w-full bg-white" required>
                <option value="">Select a category</option>
                <option value="road">Road Damage & Potholes</option>
                <option value="lighting">Streetlight Issues</option>
                <option value="sanitation">Garbage & Sanitation</option>
                <option value="water">Water Leakage</option>
                <option value="footpath">Damaged Footpaths</option>
                <option value="electrical">Electrical Hazards</option>
                <option value="drainage">Drainage Problems</option>
                <option value="other">Other Issues</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="label">
                <span className="label-text text-[#2d361b] font-semibold">Priority</span>
              </label>
              <select className="select select-bordered w-full bg-white">
                <option value="normal">Normal</option>
                <option value="high">High (Boost with payment)</option>
              </select>
              <p className="text-xs text-[#2d361b]/60 mt-2">
                High priority issues are displayed above normal issues and get faster attention.
              </p>
            </div>

            {/* Location */}
            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text text-[#2d361b] font-semibold">Location *</span>
              </label>
              <input
                type="text"
                placeholder="Address or area where the issue is located"
                className="input input-bordered w-full bg-white"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text text-[#2d361b] font-semibold">Description *</span>
              </label>
              <textarea
                placeholder="Detailed description of the issue. Include any relevant details that can help resolve it faster."
                className="textarea textarea-bordered w-full h-32 bg-white"
                required
              />
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text text-[#2d361b] font-semibold">Photo Evidence *</span>
              </label>
              
              <div className="border-2 border-dashed border-[#2d361b]/30 rounded-2xl p-6 bg-[#eff0e1]/50">
                {imagePreview ? (
                  <div className="text-center">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-w-full max-h-64 mx-auto rounded-xl mb-4"
                    />
                    <label className="btn btn-outline text-[#2d361b] rounded-2xl cursor-pointer">
                      Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        required
                      />
                    </label>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#2d361b]/10 flex items-center justify-center">
                      <svg className="w-10 h-10 text-[#2d361b]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-[#2d361b] font-medium mb-2">Upload a clear photo of the issue</p>
                    <p className="text-sm text-[#2d361b]/60 mb-4">
                      A clear photo helps staff identify and resolve the issue faster
                    </p>
                    <label className="btn bg-[#2d361b] text-[#d6d37c] rounded-2xl cursor-pointer">
                      Select Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        required
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col md:flex-row gap-4 mt-8 pt-6 border-t border-[#2d361b]/10">
            <button
              type="submit"
              className="btn bg-[#2d361b] text-[#d6d37c] rounded-2xl flex-1 border-none"
            >
              Submit Issue Report
            </button>
            <Link 
              to="/dashboard/my-issues"
              className="btn btn-outline text-[#2d361b] rounded-2xl flex-1"
            >
              Cancel
            </Link>
          </div>

          {/* Note */}
          <div className="mt-6 p-4 bg-[#eff0e1] rounded-xl border border-[#2d361b]/10">
            <p className="text-sm text-[#2d361b]">
              <span className="font-semibold">Note:</span> After submission, you can track the issue 
              status from "My Issues" page. You'll receive updates when staff works on your issue.
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ReportIssue;