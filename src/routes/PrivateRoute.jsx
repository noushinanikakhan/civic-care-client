import React from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router";

const PrivateRoute = ({children}) => {

    const { user, loading} = useAuth;
    const location = useLocation()
    console.log('location', location)

    if (loading){
       return <div>
        <span className="loading loading-infinity loading-xl"></span>
       </div> 
    } 

    if (!user){
        return <Navigate state={location.pathname} to='/login'></Navigate>
    }
  return (
    <section className="min-h-screen bg-[#eff0e1] flex items-center justify-center py-10">
 
    </section>
  );
};

export default PrivateRoute;
