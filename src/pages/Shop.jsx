import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { getAllProducts } from '../api/product.api';
import { formatPrice } from '../utils/formatPrice';
import { Link } from 'react-router-dom';

// ─── Product Card ──────────────────────────────────────────────────────────────
const ProductCard = ({ product }) => (
  <Link to={`/products/${product._id}`} className="group block">
    <div className="bg-gray-900 border border-gray-800 overflow-hidden hover:border-brand-gold transition-all duration-300">
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
      <div className="p-4">
        <h3 className="text-white font-medium text-sm uppercase tracking-wider truncate">
          {product.name}
        </h3>
        <p className="text-brand-gold font-semibold mt-1">{formatPrice(product.price)}</p>
        {product.rating > 0 && (
          <p className="text-yellow-400 text-xs mt-1">
            {'★'.repeat(Math.round(product.rating))} ({product.ratingCount})
          </p>
        )}
      </div>
    </div>
  </Link>
);

// ─── Shop Page ─────────────────────────────────────────────────────────────────
const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Get filters from URL params
  const category  = searchParams.get('category') || '';
  const search    = searchParams.get('search')   || '';
  const sortBy    = searchParams.get('sortBy')   || 'createdAt';
  const sortOrder = searchParams.get('sortOrder')|| 'desc';
  const limit     = 8;

  // Fetch products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page:  currentPage,
          limit,
          ...(category  && { category }),
          ...(search    && { search }),
          sortBy,
          sortOrder,
        };
        const res = await getAllProducts(params);
        setProducts(res.data.data || []);
        setTotalProducts(res.data.pagination?.total || 0);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, search, sortBy, sortOrder, currentPage]);

  // Update URL params
  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    setCurrentPage(1);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalProducts / limit);
  const hasFilters = category || search;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Page Header ──────────────────────────────────────────────── */}
        <div className="mb-8">
          <p className="text-brand-gold uppercase tracking-widest text-sm mb-1">Collection</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight">
            {category ? category.replace('-', ' ') : 'All Products'}
          </h1>
          <p className="text-gray-400 mt-1 text-sm">{totalProducts} products found</p>
        </div>

        {/* ── Search + Filter Bar ───────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">

          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              defaultValue={search}
              onKeyDown={(e) => {
                if (e.key === 'Enter') updateFilter('search', e.target.value);
              }}
              className="w-full bg-gray-900 border border-gray-700 text-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
            />
          </div>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split('-');
              updateFilter('sortBy', by);
              updateFilter('sortOrder', order);
            }}
            className="bg-gray-900 border border-gray-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand-gold"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-2 bg-gray-900 border border-gray-700 text-white px-4 py-3 text-sm"
          >
            <Filter size={16} /> Filters
          </button>
        </div>

        <div className="flex gap-8">

          {/* ── Sidebar Filters ───────────────────────────────────────────── */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-56 shrink-0`}>
            <div className="bg-gray-900 border border-gray-800 p-5">

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold uppercase tracking-wider text-sm">Filters</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-brand-gold text-xs flex items-center gap-1 hover:text-yellow-400">
                    <X size={12} /> Clear
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Category</p>
                {[
                  { label: 'All',                value: ''                   },
                  { label: 'Kits',               value: 'kits'               },
                  { label: 'Gym Gear',           value: 'gym-gear'           },
                  { label: 'Training Equipment', value: 'training-equipment' },
                ].map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => updateFilter('category', cat.value)}
                    className={`block w-full text-left py-2 text-sm transition-colors ${
                      category === cat.value
                        ? 'text-brand-gold font-semibold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Products Grid ─────────────────────────────────────────────── */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-gray-900 border border-gray-800 animate-pulse">
                    <div className="aspect-square bg-gray-800" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-800 rounded w-3/4" />
                      <div className="h-4 bg-gray-800 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 text-sm font-semibold transition-colors ${
                          currentPage === i + 1
                            ? 'bg-brand-gold text-black'
                            : 'bg-gray-900 border border-gray-700 text-white hover:border-brand-gold'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No products found.</p>
                <button onClick={clearFilters} className="text-brand-gold text-sm mt-2 hover:text-yellow-400">
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Shop;