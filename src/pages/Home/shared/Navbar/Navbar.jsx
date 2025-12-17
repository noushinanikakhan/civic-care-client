import React from "react";
// import logo from "../../../../assets/rsz_logociviccare111.png"
import Logo from "../../../../components/Logo/Logo";
import { NavLink } from "react-router";

const Navbar = () => {
  const links = <>
       <li> <NavLink> All Issues</NavLink></li>
      <li><NavLink to='/help-guidlines'>Help & Guidelines</NavLink></li>
            <li><NavLink to='/about'>About</NavLink></li>


  </>
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
    <a className=" text-xl md:text-4xl ">
       <div className="flex items-center justify-start gap-2">
         <Logo></Logo>
        <h2 className="text-[#2d361b] font-bold">CivicCare</h2>
       </div>
    </a>
  </div>
  <div className="navbar-center hidden lg:flex text-[#2d361b]">
    <ul className="menu menu-horizontal px-1">
  {links}
    </ul>
  </div>
  <div className="navbar-end">
    <a className="btn bg-[#2d361b] text-[#d6d37c] rounded-2xl ">Login</a>
  </div>
</div>
    )
}

export default Navbar