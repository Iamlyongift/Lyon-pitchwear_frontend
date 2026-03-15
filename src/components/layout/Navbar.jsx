import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const {  token, isAdmin, logout } = useAuthStore();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-brand-gray border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-brand-gold font-bold text-2xl tracking-widest uppercase">
              Lyon
            </span>
            <span className="text-white font-light text-2xl tracking-widest uppercase">
              Pitchwear
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/"     className="text-gray-300 hover:text-brand-gold transition-colors text-sm uppercase tracking-wider">Home</Link>
            <Link to="/shop" className="text-gray-300 hover:text-brand-gold transition-colors text-sm uppercase tracking-wider">Shop</Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">

            {/* Cart Icon */}
            <Link to="/checkout" className="relative text-gray-300 hover:text-brand-gold transition-colors">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-gold text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User is logged in */}
            {token ? (
              <div className="flex items-center space-x-3">
                {/* Admin Dashboard link */}
                {isAdmin && (
                  <Link to="/admin/dashboard" className="text-brand-gold hover:text-yellow-400 transition-colors">
                    <LayoutDashboard size={22} />
                  </Link>
                )}

                {/* Profile link */}
                <Link to="/profile" className="text-gray-300 hover:text-brand-gold transition-colors">
                  <User size={22} />
                </Link>

                {/* Logout */}
                <button onClick={handleLogout} className="text-gray-300 hover:text-red-400 transition-colors">
                  <LogOut size={22} />
                </button>
              </div>
            ) : (
              /* User is not logged in */
              <div className="hidden md:flex items-center space-x-3">
                <Link to="/login" className="text-gray-300 hover:text-brand-gold text-sm uppercase tracking-wider transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-brand-gold text-black px-4 py-2 text-sm uppercase tracking-wider font-semibold hover:bg-yellow-400 transition-colors">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-gray-300 hover:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-brand-gray border-t border-gray-800 px-4 py-4 space-y-3">
          <Link to="/"     onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-brand-gold py-2 uppercase tracking-wider text-sm">Home</Link>
          <Link to="/shop" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-brand-gold py-2 uppercase tracking-wider text-sm">Shop</Link>
          {!token && (
            <>
              <Link to="/login"    onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-brand-gold py-2 uppercase tracking-wider text-sm">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block text-brand-gold py-2 uppercase tracking-wider text-sm font-semibold">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;