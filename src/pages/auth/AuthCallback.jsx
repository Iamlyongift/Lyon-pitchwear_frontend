import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { getMyProfile } from "../../api/auth.api";
import toast from "react-hot-toast";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token");
      const error = searchParams.get("error");

      if (error) {
        toast.error("Google login failed. Please try again.");
        navigate("/login");
        return;
      }

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Save token first
        localStorage.setItem("token", token);

        // Fetch user profile with the token
        const res = await getMyProfile();
        const user = res.data.data;

        // Save to auth store
        setAuth(user, token, false);
        toast.success(`Welcome, ${user.firstName}!`);
        navigate("/");
      } catch (err) {
        toast.error("Login failed. Please try again.");
        navigate("/login");
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-brand-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Signing you in with Google...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
