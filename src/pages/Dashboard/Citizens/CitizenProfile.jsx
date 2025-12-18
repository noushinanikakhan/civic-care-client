import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";

const CitizenProfile = () => {
  const { user } = useAuth(); // Get the actual logged-in user
  const [isPremium, setIsPremium] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    photoURL: "",
  });

  // Initialize form data with user data
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || user.email?.split('@')[0] || "Citizen",
        photoURL: user.photoURL || "",
      });
    }
  }, [user]);

  // Get user metadata
  const getJoinDate = () => {
    if (!user?.metadata?.creationTime) return "Unknown";
    const date = new Date(user.metadata.creationTime);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatus = () => {
    if (!user) return "loading...";
    if (user.emailVerified) return "Verified";
    return "Not Verified";
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photoURL: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Here you would call your updateUserProfile function
      // For now, we'll simulate an update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been updated successfully.",
        confirmButtonColor: "#2d361b",
      });
      
      setEditMode(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message || "Failed to update profile. Please try again.",
        confirmButtonColor: "#2d361b",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle premium upgrade
  const handleUpgradePremium = () => {
    Swal.fire({
      title: "Upgrade to Premium",
      html: `
        <div class="text-left">
          <p class="mb-4">Upgrade to Premium for <strong>1000 tk</strong> to get:</p>
          <ul class="list-disc pl-5 mb-4 space-y-1">
            <li>Unlimited issue submissions</li>
            <li>Priority support</li>
            <li>Faster issue processing</li>
            <li>Premium badge on profile</li>
          </ul>
          <p class="text-sm text-gray-600">You'll be redirected to payment page.</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Proceed to Payment",
      confirmButtonColor: "#2d361b",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Simulate payment processing
        setLoading(true);
        setTimeout(() => {
          setIsPremium(true);
          setLoading(false);
          Swal.fire({
            icon: "success",
            title: "Premium Activated!",
            text: "You are now a premium member. Enjoy unlimited submissions!",
            confirmButtonColor: "#2d361b",
          });
        }, 1500);
      }
    });
  };

  // Static data for now (you'll replace with API calls later)
  const userStats = {
    issueLimit: 3,
    issuesSubmitted: 3,
    remainingIssues: 0,
  };

  const payments = [
    { id: 1, date: "2024-12-01", amount: 100, type: "Issue Boost", status: "Completed" },
    { id: 2, date: "2024-11-20", amount: 1000, type: "Premium Subscription", status: "Completed" },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-[#eff0e1] flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-[#2d361b]"></div>
          <p className="mt-4 text-[#2d361b]">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-[#eff0e1] min-h-screen py-8">
      <div className="w-11/12 mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#2d361b]">My Profile</h1>
          <p className="text-[#2d361b]/70 mt-2">
            Manage your account information and subscription
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl p-8 border border-[#2d361b]/10">
              {editMode ? (
                // Edit Form
                <form onSubmit={handleUpdateProfile}>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    {/* Profile Photo Upload */}
                    <div className="relative">
                      <img
                        src={formData.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${formData.displayName}&backgroundColor=2d361b&fontColor=d6d37c`}
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-4 border-[#2d361b]/30 object-cover"
                      />
                      <label className="absolute bottom-0 right-0 bg-[#2d361b] text-[#d6d37c] p-2 rounded-full cursor-pointer hover:bg-[#1f2613]">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </label>
                    </div>

                    {/* Edit Form Fields */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="label">
                          <span className="label-text text-[#2d361b] font-semibold">Display Name</span>
                        </label>
                        <input
                          type="text"
                          name="displayName"
                          value={formData.displayName}
                          onChange={handleInputChange}
                          className="input input-bordered w-full bg-white"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="label">
                          <span className="label-text text-[#2d361b] font-semibold">Email</span>
                        </label>
                        <input
                          type="email"
                          value={user.email || ""}
                          className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
                          disabled
                        />
                        <p className="text-xs text-[#2d361b]/60 mt-1">
                          Email cannot be changed
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-[#2d361b]/10">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn bg-[#2d361b] text-[#d6d37c] rounded-2xl"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="btn btn-outline text-[#2d361b] rounded-2xl"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                // View Mode
                <>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    {/* Profile Photo */}
                    <div className="relative">
                      <img
                        src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || user.email}&backgroundColor=2d361b&fontColor=d6d37c`}
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-4 border-[#2d361b]/30 object-cover"
                      />
                      {isPremium && (
                        <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          PREMIUM
                        </div>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                          <h2 className="text-2xl font-bold text-[#2d361b]">
                            {user.displayName || user.email?.split('@')[0] || "Citizen"}
                          </h2>
                          <p className="text-[#2d361b]/70">{user.email}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-sm text-[#2d361b]/60">
                              Joined {getJoinDate()}
                            </p>
                            <span className="text-xs px-2 py-1 rounded bg-[#eff0e1] text-[#2d361b]">
                              {getStatus()}
                            </span>
                          </div>
                        </div>
                        
                        {/* Status Badges */}
                        <div className="flex gap-2">
                          {isPremium ? (
                            <span className="badge bg-yellow-100 text-yellow-800 border-none">
                              Premium Member
                            </span>
                          ) : (
                            <span className="badge bg-gray-100 text-gray-800 border-none">
                              Free Account
                            </span>
                          )}
                          {isBlocked && (
                            <span className="badge bg-red-100 text-red-800 border-none">
                              Account Blocked
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Issue Limit Progress */}
                      <div className="mt-6">
                        <div className="flex justify-between text-sm text-[#2d361b] mb-2">
                          <span>Issue Submission Limit</span>
                          <span>
                            {userStats.issuesSubmitted} / {userStats.issueLimit} issues used
                          </span>
                        </div>
                        <progress 
                          className="progress progress-success w-full h-3" 
                          value={userStats.issuesSubmitted} 
                          max={userStats.issueLimit}
                        ></progress>
                        <p className="text-sm text-[#2d361b]/60 mt-2">
                          {userStats.remainingIssues === 0 ? (
                            <span className="text-red-600">You've reached your submission limit</span>
                          ) : (
                            `You can submit ${userStats.remainingIssues} more issue(s)`
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-[#2d361b]/10">
                    <button
                      onClick={() => setEditMode(true)}
                      className="btn bg-[#2d361b] text-[#d6d37c] rounded-2xl"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={() => {
                        Swal.fire({
                          title: "Change Password",
                          text: "Password change functionality will be added soon.",
                          icon: "info",
                          confirmButtonColor: "#2d361b",
                        });
                      }}
                      className="btn btn-outline text-[#2d361b] rounded-2xl"
                    >
                      Change Password
                    </button>
                    {!isPremium && (
                      <button 
                        onClick={handleUpgradePremium}
                        disabled={loading}
                        className="btn bg-green-600 text-white rounded-2xl ml-auto hover:bg-green-700"
                      >
                        {loading ? "Processing..." : "Upgrade to Premium - 1000tk"}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Subscription Section */}
            <div className="bg-white rounded-2xl p-8 border border-[#2d361b]/10">
              <h3 className="text-xl font-bold text-[#2d361b] mb-6">Subscription Plan</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Free Plan */}
                <div className={`p-6 rounded-2xl border-2 ${isPremium ? 'border-gray-200' : 'border-[#2d361b]'} relative`}>
                  {!isPremium && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-[#2d361b] text-[#d6d37c] text-sm font-bold px-4 py-1 rounded-full">
                        CURRENT PLAN
                      </span>
                    </div>
                  )}
                  <h4 className="text-lg font-bold text-[#2d361b] mb-2">Free Plan</h4>
                  <p className="text-3xl font-bold text-[#2d361b] mb-4">0 tk<span className="text-sm text-[#2d361b]/70">/lifetime</span></p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-[#2d361b]/70">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Submit up to 3 issues
                    </li>
                    <li className="flex items-center text-[#2d361b]/70">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Basic support
                    </li>
                    <li className="flex items-center text-[#2d361b]/70">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Track issue progress
                    </li>
                  </ul>
                  {isPremium ? (
                    <button className="btn btn-outline text-[#2d361b] rounded-2xl w-full" disabled>
                      Current Plan
                    </button>
                  ) : (
                    <button className="btn bg-[#2d361b] text-[#d6d37c] rounded-2xl w-full">
                      Selected
                    </button>
                  )}
                </div>

                {/* Premium Plan */}
                <div className={`p-6 rounded-2xl border-2 ${isPremium ? 'border-green-500 bg-green-50' : 'border-gray-200'} relative`}>
                  {isPremium && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                        ACTIVE PLAN
                      </span>
                    </div>
                  )}
                  <h4 className="text-lg font-bold text-[#2d361b] mb-2">Premium Plan</h4>
                  <p className="text-3xl font-bold text-[#2d361b] mb-4">1000 tk<span className="text-sm text-[#2d361b]/70">/lifetime</span></p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-[#2d361b]/70">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Unlimited issue submissions
                    </li>
                    <li className="flex items-center text-[#2d361b]/70">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Priority support
                    </li>
                    <li className="flex items-center text-[#2d361b]/70">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Faster issue processing
                    </li>
                    <li className="flex items-center text-[#2d361b]/70">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Premium badge on profile
                    </li>
                  </ul>
                  {isPremium ? (
                    <button className="btn bg-green-500 text-white rounded-2xl w-full">
                      Active Until: Lifetime
                    </button>
                  ) : (
                    <button 
                      onClick={handleUpgradePremium}
                      disabled={loading}
                      className="btn bg-green-600 text-white rounded-2xl w-full hover:bg-green-700"
                    >
                      {loading ? "Processing..." : "Upgrade Now"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Payments */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-[#1c260f] to-[#1f2b12] text-[#f4f6e8] rounded-2xl p-6 border border-[#2f3a1a]">
              <h3 className="text-xl font-semibold mb-6">Your Activity</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-[#1a220e] rounded-xl">
                  <span>Total Issues</span>
                  <span className="font-bold">{userStats.issuesSubmitted}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[#1a220e] rounded-xl">
                  <span>Pending Issues</span>
                  <span className="font-bold">1</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[#1a220e] rounded-xl">
                  <span>Resolved Issues</span>
                  <span className="font-bold">1</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[#1a220e] rounded-xl">
                  <span>Total Payments</span>
                  <span className="font-bold">1100 tk</span>
                </div>
              </div>
            </div>

            {/* Recent Payments */}
            <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
              <h3 className="text-xl font-bold text-[#2d361b] mb-6">Recent Payments</h3>
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div key={payment.id} className="p-4 border border-[#2d361b]/10 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-[#2d361b]">{payment.type}</span>
                      <span className="font-bold text-[#2d361b]">{payment.amount} tk</span>
                    </div>
                    <div className="flex justify-between text-sm text-[#2d361b]/70">
                      <span>{payment.date}</span>
                      <span className="text-green-600">{payment.status}</span>
                    </div>
                  </div>
                ))}
                {payments.length === 0 ? (
                  <p className="text-center text-[#2d361b]/70 py-4">No payment history</p>
                ) : (
                  <button 
                    onClick={() => {
                      Swal.fire({
                        title: "Payment History",
                        text: "Complete payment history will be available when backend is connected.",
                        icon: "info",
                        confirmButtonColor: "#2d361b",
                      });
                    }}
                    className="btn btn-outline text-[#2d361b] rounded-2xl w-full mt-4"
                  >
                    View All Payments
                  </button>
                )}
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-2xl p-6 border border-[#2d361b]/10">
              <h3 className="text-xl font-bold text-[#2d361b] mb-6">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#2d361b]/70">User ID</p>
                  <p className="text-[#2d361b] font-mono text-sm truncate">{user.uid}</p>
                </div>
                <div>
                  <p className="text-sm text-[#2d361b]/70">Provider</p>
                  <p className="text-[#2d361b]">{user.providerId}</p>
                </div>
                <div>
                  <p className="text-sm text-[#2d361b]/70">Email Status</p>
                  <p className="text-[#2d361b]">{user.emailVerified ? "Verified ✓" : "Not Verified"}</p>
                </div>
                <div>
                  <p className="text-sm text-[#2d361b]/70">Last Login</p>
                  <p className="text-[#2d361b]">
                    {user.metadata?.lastSignInTime 
                      ? new Date(user.metadata.lastSignInTime).toLocaleString()
                      : "Unknown"
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Blocked Account Warning */}
            {isBlocked && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <div className="bg-red-100 p-2 rounded-full">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-red-800 mb-2">Account Restricted</h4>
                    <p className="text-sm text-red-700">
                      Your account has been blocked by admin. You cannot submit, edit, upvote, or boost issues.
                      Please contact authorities for assistance.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CitizenProfile;