import React from "react";
// import logo from "../../../../assets/rsz_logociviccare111.png"
import Logo from "../../../../components/Logo/Logo";
import { NavLink } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../../hooks/useAuth";
import { API_BASE } from "../../../../utils/api";
import { authFetch } from "../../../../utils/authFetch";

const Navbar = () => {

  const { user, logoutUser, loading:authLoading  } = useAuth();

  const {
  data: profileData,
  isLoading: profileLoading,
   isError: profileError
} = useQuery({
    queryKey: ["user-profile", user?.email],
    enabled: !!user?.email,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    queryFn: async () => {
      try {
        const res = await authFetch(
          `${API_BASE}/users/profile/${encodeURIComponent(user.email)}`
        );
        if (!res.ok) throw new Error("Failed to load profile");
        const json = await res.json();
        return json.user;
      } catch (error) {
        console.error("Profile fetch error:", error);
        return null;
      }
    },
  });



    // ADD THESE CONSOLE LOGS:
  console.log("Navbar - user object:", user);
  console.log("Navbar - user exists?", !!user);
  console.log("Navbar - user email:", user?.email);

  const handleLogout = async () => {
     try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

const getInitials = (nameOrEmail = "") => {
  if (!nameOrEmail) return "U";
  const parts = nameOrEmail.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};


  // ✅ Use cached data or fallbacks
  const displayName = React.useMemo(() => {
    if (profileData?.name) return profileData.name;
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split("@")[0];
    return "Citizen";
  }, [profileData, user]);

  const displayPhoto = React.useMemo(() => {
    return profileData?.photoURL || user?.photoURL || null;
  }, [profileData, user]);

  // ✅ Show loading only on initial auth load, not profile load
  if (authLoading && !user) {
    return <div className="navbar bg-[#eff0e1] h-16 animate-pulse"></div>;
  }


  const links = <>
       <li> <NavLink to='/'> Home</NavLink></li>
       <li> <NavLink to='all-issues'> All Issues</NavLink></li>
      <li><NavLink to='/help-guidlines'>Help & Guidelines</NavLink></li>
            <li><NavLink to='/about'>About</NavLink></li>
  </>

    // ✅ PUT THIS HERE (right before JSX return)
  if (user && (authLoading || profileLoading)) {
    return <div className="navbar bg-[#eff0e1] h-16"></div>;
  }

    return (
<div className="navbar bg-[#eff0e1] sticky top-0 z-50">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
      </div>
      <ul
        tabIndex="-1"
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
      {links}
      </ul>
    </div>
    <NavLink className=" text-xl md:text-4xl" to='/'>
       <div className="flex items-center justify-start gap-2">
         <Logo></Logo>
        <h2 className="text-[#2d361b] font-bold">CivicCare</h2>
       </div>
    </NavLink>
  </div>
  <div className="navbar-center hidden lg:flex font-semibold text-[#2d361b]">
    <ul className="menu menu-horizontal px-1">
  {links}
    </ul>
  </div>
  <div className="navbar-end">
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full border border-[#2d361b]/30 bg-[#2d361b]/10">
                {displayPhoto ? (
                  <img
                    src={displayPhoto}
                    alt={displayName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
          onError={(e) => {
  e.target.style.display = 'none';
  const fallback = e.target.parentElement.querySelector('.avatar-fallback');
  if (fallback) {
    fallback.style.display = 'flex';
  }
}}
                  />
                ) : null}
                <div 
                  className={`w-full h-full flex items-center justify-center bg-[#2d361b] text-[#d6d37c] font-bold text-sm ${displayPhoto ? 'hidden avatar-fallback' : ''}`}
                >
                  {getInitials(displayName)}
                </div>
              </div>
            </label>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-[#eff0e1] rounded-box z-50 mt-3 w-56 p-2 shadow-lg border border-[#2d361b]/10"
            >
              <li className="px-3 py-3 cursor-default border-b border-[#2d361b]/10">
                <div>
                  <p className="text-[#2d361b] font-bold text-sm truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-[#2d361b]/70 mt-1 truncate">
                    {user?.email}
                  </p>
                  {profileLoading && (
                    <p className="text-xs text-[#2d361b]/50 mt-1">Loading profile...</p>
                  )}
                </div>
              </li>

              <li>
                <NavLink 
                  to="/dashboard" 
                  className="text-[#2d361b] hover:bg-[#2d361b]/10 hover:text-[#2d361b] rounded-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Dashboard
                </NavLink>
              </li>

              <li className="mt-1">
                <button 
                  onClick={handleLogout} 
                  className="text-[#b91c1c] hover:bg-red-50 hover:text-red-700 rounded-lg flex items-center w-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <>
            <NavLink
              to="/register"
              className="btn bg-[#2d361b] text-[#d6d37c] rounded-2xl hover:bg-[#1f2613] border-none"
            >
              Register
            </NavLink>
            <NavLink
              to="/login"
              className="btn bg-[#2d361b] text-[#d6d37c] rounded-2xl hover:bg-[#1f2613] border-none ml-2"
            >
              Login
            </NavLink>
          </>
        )}
      </div>



</div>
    )
}

export default Navbar