import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { adminLogin } from '../../api/admin.api';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adminLogin(form);
      const { token, data } = res.data;
      setAuth(data, token, true); // ← isAdmin = true
      toast.success(`Welcome, ${data.firstName}!`);
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
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
            <span className="text-brand-gold font-bold text-3xl tracking-widest uppercase">Lyon </span>
            <span className="text-white font-light text-3xl tracking-widest uppercase">Pitchwear</span>
          </Link>
          <p className="text-gray-400 mt-2 text-sm">Admin Portal</p>
          <div className="w-12 h-0.5 bg-brand-gold mx-auto mt-3" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 p-8 space-y-5">
          <div>
            <label className="text-white text-xs uppercase tracking-wider block mb-2">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
              placeholder="superadmin@lyonpitchwear.com"
            />
          </div>

          <div>
            <label className="text-white text-xs uppercase tracking-wider block mb-2">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-gold text-black py-4 uppercase tracking-widest font-bold text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Admin Sign In'}
          </button>

          <p className="text-center text-gray-600 text-xs">
            Not an admin?{' '}
            <Link to="/login" className="text-gray-500 hover:text-gray-300 transition-colors">
              Customer Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;