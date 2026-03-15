import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Award } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { getAllProducts } from '../api/product.api';
import { formatPrice } from '../utils/formatPrice';

// ─── Product Card Component ────────────────────────────────────────────────────
const ProductCard = ({ product }) => (
  <Link to={`/products/${product._id}`} className="group block">
    <div className="bg-gray-900 border border-gray-800 overflow-hidden hover:border-brand-gold transition-all duration-300">
      {/* Product Image */}
      <div className="aspect-square overflow-hidden bg-gray-800">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
            No Image
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-white font-medium text-sm uppercase tracking-wider truncate">
          {product.name}
        </h3>
        <p className="text-brand-gold font-semibold mt-1">
          {formatPrice(product.price)}
        </p>
        {product.rating > 0 && (
          <p className="text-yellow-400 text-xs mt-1">
            {'★'.repeat(Math.round(product.rating))} ({product.ratingCount})
          </p>
        )}
      </div>
    </div>
  </Link>
);

// ─── Home Page ─────────────────────────────────────────────────────────────────
const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured products from backend on page load
  useEffect(() => {
  const fetchFeatured = async () => {
    try {
      const res = await getAllProducts({ featured: true, limit: 4 });
      setFeaturedProducts(res.data.data); // ← clean and correct
    } catch (err) {
      console.error('Failed to fetch featured products', err);
    } finally {
      setLoading(false);
    }
  };
  fetchFeatured();
}, []);

  return (
    <Layout>
      {/* ── Hero Section ───────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-gray-900 to-brand-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-900/20 via-transparent to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p className="text-brand-gold uppercase tracking-[0.3em] text-sm mb-4 font-light">
            Elite Sports Apparel
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-tight leading-none mb-6">
            Perform At <br />
            <span className="text-brand-gold">Your Peak</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Premium kits, gym gear, and training equipment engineered for elite athletes. 
            Built to perform. Designed to last.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="bg-brand-gold text-black px-8 py-4 uppercase tracking-widest font-bold text-sm hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 group"
            >
              Shop Now
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/shop?category=kits"
              className="border border-gray-600 text-white px-8 py-4 uppercase tracking-widest font-light text-sm hover:border-brand-gold hover:text-brand-gold transition-colors"
            >
              View Kits
            </Link>
          </div>
        </div>
      </section>

      {/* ── Categories Section ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-brand-gold uppercase tracking-widest text-sm mb-2">Collections</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight">
            Shop By Category
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Kits',               value: 'kits',               desc: 'Match-day & training kits'       },
            { label: 'Gym Gear',           value: 'gym-gear',           desc: 'Performance gym apparel'         },
            { label: 'Training Equipment', value: 'training-equipment', desc: 'Cones, bibs, nets & more'        },
          ].map((cat) => (
            <Link
              key={cat.value}
              to={`/shop?category=${cat.value}`}
              className="group relative bg-gray-900 border border-gray-800 p-8 hover:border-brand-gold transition-all duration-300 text-center"
            >
              <div className="w-12 h-1 bg-brand-gold mx-auto mb-4 group-hover:w-20 transition-all duration-300" />
              <h3 className="text-white font-bold uppercase tracking-wider text-lg mb-2">
                {cat.label}
              </h3>
              <p className="text-gray-400 text-sm">{cat.desc}</p>
              <ArrowRight
                size={16}
                className="text-brand-gold mx-auto mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-900">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-brand-gold uppercase tracking-widest text-sm mb-2">Handpicked</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight">
              Featured Products
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden md:flex items-center gap-2 text-brand-gold hover:text-yellow-400 transition-colors text-sm uppercase tracking-wider"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          // Loading skeleton
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 animate-pulse">
                <div className="aspect-square bg-gray-800" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-800 rounded w-3/4" />
                  <div className="h-4 bg-gray-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            No featured products yet.
          </div>
        )}

        <div className="text-center mt-8 md:hidden">
          <Link to="/shop" className="text-brand-gold text-sm uppercase tracking-wider">
            View All Products →
          </Link>
        </div>
      </section>

      {/* ── Why Lyon Section ────────────────────────────────────────────── */}
      <section className="bg-gray-900/50 border-t border-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-brand-gold uppercase tracking-widest text-sm mb-2">Why Choose Us</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight">
              The Lyon Standard
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap size={32} className="text-brand-gold" />,
                title: 'Performance First',
                desc: 'Every piece is engineered for maximum athletic performance — moisture-wicking, breathable, and durable.',
              },
              {
                icon: <Shield size={32} className="text-brand-gold" />,
                title: 'Built to Last',
                desc: 'Premium materials and quality stitching ensure your gear withstands the most intense sessions.',
              },
              {
                icon: <Award size={32} className="text-brand-gold" />,
                title: 'Elite Standard',
                desc: 'Worn by serious athletes. Designed for those who refuse to compromise on quality.',
              },
            ].map((item, i) => (
              <div key={i} className="text-center p-6">
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-white font-bold uppercase tracking-wider mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;