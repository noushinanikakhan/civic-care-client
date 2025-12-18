import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ after private route redirect, you'll send state: { from: location.pathname }
  const from = location?.state?.from || "/";

  const [loading, setLoading] = useState(false);

  const { loginUser , googleSignIn } = useAuth(); 


  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Missing information",
        text: "Please enter both email and password.",
        confirmButtonColor: "#2d361b",
      });
      return;
    }

    try {
      setLoading(true);

      // ✅ connect your auth
      await loginUser(email, password);

      Swal.fire({
        icon: "success",
        title: "Login successful",
        text: "Welcome back to CivicCare.",
        confirmButtonColor: "#2d361b",
      });

      navigate(from, { replace: true });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: err?.message || "Please check your credentials and try again.",
        confirmButtonColor: "#2d361b",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      // ✅ connect your auth
      // await googleSignIn();

      Swal.fire({
        icon: "success",
        title: "Signed in with Google",
        text: "You are now logged in.",
        confirmButtonColor: "#2d361b",
      });

      navigate(from, { replace: true });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Google sign-in failed",
        text: err?.message || "Please try again.",
        confirmButtonColor: "#2d361b",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#eff0e1] flex items-center justify-center py-10">
      <div className="w-11/12 max-w-4xl grid lg:grid-cols-2 overflow-hidden rounded-3xl border border-[#2d361b]/10 bg-white/60">
        {/* Left panel */}
        <div className="p-8 lg:p-10 bg-gradient-to-br from-[#1c260f] via-[#1f2b12] to-[#141b0a]">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#f4f6e8]">
            Welcome Back
          </h1>
          <p className="mt-3 text-[#9aa36a] leading-relaxed">
            Sign in to track submissions, view updates, and access your dashboard.
          </p>

          <div className="mt-8 p-5 rounded-2xl bg-[#1a220e] border border-[#2f3a1a]">
            <p className="font-semibold text-[#e6ecd1]">Quick note</p>
            <p className="mt-2 text-[#8e9960] text-sm leading-relaxed">
              CivicCare keeps progress history visible to improve transparency and accountability.
            </p>
          </div>
        </div>

        {/* Form panel */}
        <div className="p-8 lg:p-10">
          <h2 className="text-2xl font-bold text-[#2d361b]">Login</h2>
          <p className="mt-2 text-[#2d361b]/70">
            Use your email/password or continue with Google.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="label">
                <span className="label-text text-[#2d361b]">Email</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="input input-bordered w-full bg-white"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text text-[#2d361b]">Password</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="input input-bordered w-full bg-white"
              />
            </div>

            <button
              disabled={loading}
              className="btn w-full bg-[#2d361b] text-[#d6d37c] rounded-2xl border-none"
              type="submit"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#2d361b]/15" />
            <span className="text-sm text-[#2d361b]/60">OR</span>
            <div className="h-px flex-1 bg-[#2d361b]/15" />
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="btn w-full rounded-2xl bg-white border border-[#2d361b]/20 text-[#2d361b] hover:bg-[#2d361b] hover:text-[#d6d37c]"
          >
            Continue with Google
          </button>

          <p className="mt-6 text-[#2d361b]/70">
            New here?{" "}
            <Link to="/register" className="font-semibold text-[#2d361b] underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
