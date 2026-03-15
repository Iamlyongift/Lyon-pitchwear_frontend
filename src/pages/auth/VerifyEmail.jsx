import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "../../api/axios";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("verifying"); // verifying | success | error

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        return;
      }
      try {
        await axios.get(`/auth/verify-email?token=${token}`);
        setStatus("success");
      } catch (err) {
        setStatus("error");
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="mb-8">
          <Link to="/">
            <span className="text-brand-gold font-bold text-3xl tracking-widest uppercase">
              Lyon{" "}
            </span>
            <span className="text-white font-light text-3xl tracking-widest uppercase">
              Pitchwear
            </span>
          </Link>
        </div>

        {/* Verifying */}
        {status === "verifying" && (
          <div>
            <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Verifying your email...</p>
          </div>
        )}

        {/* Success */}
        {status === "success" && (
          <div className="bg-gray-900 border border-gray-800 p-8">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-tight mb-3">
              Email Verified!
            </h2>
            <p className="text-gray-400 mb-6 text-sm">
              Your email has been verified successfully. You can now sign in.
            </p>
            <Link
              to="/login"
              className="block w-full bg-brand-gold text-black py-3 uppercase tracking-widest font-bold text-sm hover:bg-yellow-400 transition-colors"
            >
              Sign In
            </Link>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="bg-gray-900 border border-gray-800 p-8">
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-tight mb-3">
              Verification Failed
            </h2>
            <p className="text-gray-400 mb-6 text-sm">
              This link is invalid or has expired. Please register again or
              contact support.
            </p>
            <Link
              to="/register"
              className="block w-full bg-brand-gold text-black py-3 uppercase tracking-widest font-bold text-sm hover:bg-yellow-400 transition-colors"
            >
              Register Again
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
