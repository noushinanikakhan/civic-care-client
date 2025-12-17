import React from "react";
import Logo from "../components/Logo/Logo";
import Login from "../pages/Login/Login";
import Navbar from "../pages/Home/shared/Navbar/Navbar";
import Footer from "../pages/Home/shared/Footer/Footer";
import Register from "../pages/Register/Register";
import { Outlet } from "react-router";


const AuthLayout = () => {
    return (
        <div>
          {/* <Logo></Logo> */}
          <Navbar></Navbar>
          <Outlet></Outlet>
          <Footer></Footer>
        </div>
    )
}

export default AuthLayout