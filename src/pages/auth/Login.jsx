import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { loginUser } from "../../api/auth.api";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form);
      const { token, data } = res.data;
      setAuth(data, token, false);
      toast.success(`Welcome back, ${data.firstName}!`);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <span className="text-brand-gold font-bold text-3xl tracking-widest uppercase">
              Lyon{" "}
            </span>
            <span className="text-white font-light text-3xl tracking-widest uppercase">
              Pitchwear
            </span>
          </Link>
          <p className="text-gray-400 mt-2 text-sm">Sign in to your account</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 border border-gray-800 p-8 space-y-5"
        >
          <div>
            <label className="text-white text-xs uppercase tracking-wider block mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
              placeholder="john@gmail.com"
            />
          </div>

          <div>
            <label className="text-white text-xs uppercase tracking-wider block mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 pr-12 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-brand-gold text-xs hover:text-yellow-400 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-gold text-black py-4 uppercase tracking-widest font-bold text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-700" />
            <span className="text-gray-500 text-xs uppercase tracking-wider">
              or
            </span>
            <div className="flex-1 h-px bg-gray-700" />
          </div>

          {/* Google Button */}

          <a
            href={`${import.meta.env.VITE_API_URL?.replace("/api", "")}/api/auth/google`}
            className="w-full flex items-center justify-center gap-3 border border-gray-700 text-white py-3 text-sm uppercase tracking-wider hover:border-gray-500 hover:bg-gray-800 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </a>
          <p className="text-center text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-brand-gold hover:text-yellow-400 transition-colors"
            >
              Register
            </Link>
          </p>
        </form>

        {/* Admin login link */}
        <p className="text-center text-gray-600 text-xs mt-4">
          Are you an admin?{" "}
          <Link
            to="/admin/login"
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            Admin Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
