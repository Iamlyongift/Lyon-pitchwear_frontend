import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-brand-gray border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-brand-gold font-bold text-xl tracking-widest uppercase">Lyon</span>
              <span className="text-white font-light text-xl tracking-widest uppercase">Pitchwear</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Elite sports apparel for the modern athlete. Performance meets style on and off the pitch.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold uppercase tracking-wider text-sm mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/"     className="text-gray-400 hover:text-brand-gold text-sm transition-colors">Home</Link></li>
              <li><Link to="/shop" className="text-gray-400 hover:text-brand-gold text-sm transition-colors">Shop</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-brand-gold text-sm transition-colors">My Account</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold uppercase tracking-wider text-sm mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/shop?category=kits"               className="text-gray-400 hover:text-brand-gold text-sm transition-colors">Kits</Link></li>
              <li><Link to="/shop?category=gym-gear"           className="text-gray-400 hover:text-brand-gold text-sm transition-colors">Gym Gear</Link></li>
              <li><Link to="/shop?category=training-equipment" className="text-gray-400 hover:text-brand-gold text-sm transition-colors">Training Equipment</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Lyon Pitchwear. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;