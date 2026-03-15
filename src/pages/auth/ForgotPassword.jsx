import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/auth.api';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword({ email });
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // ── Success Screen ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="text-6xl mb-6">📧</div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-tight mb-3">
            Check Your Email
          </h2>
          <p className="text-gray-400 mb-2 text-sm">
            We sent a password reset link to:
          </p>
          <p className="text-brand-gold font-semibold mb-6">{email}</p>
          <p className="text-gray-500 text-xs mb-8">
            Didn't receive it? Check your spam folder or try again.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setSubmitted(false)}
              className="text-brand-gold text-sm hover:text-yellow-400 transition-colors uppercase tracking-wider"
            >
              Try a different email
            </button>
            <Link
              to="/login"
              className="text-gray-400 text-sm hover:text-white transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <span className="text-brand-gold font-bold text-3xl tracking-widest uppercase">Lyon </span>
            <span className="text-white font-light text-3xl tracking-widest uppercase">Pitchwear</span>
          </Link>
          <p className="text-gray-400 mt-2 text-sm">Reset your password</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 p-8 space-y-5">
          <div>
            <p className="text-gray-400 text-sm mb-5 leading-relaxed">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <label className="text-white text-xs uppercase tracking-wider block mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
              placeholder="john@gmail.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-gold text-black py-4 uppercase tracking-widest font-bold text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <p className="text-center text-gray-400 text-sm">
            Remember your password?{' '}
            <Link to="/login" className="text-brand-gold hover:text-yellow-400 transition-colors">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;