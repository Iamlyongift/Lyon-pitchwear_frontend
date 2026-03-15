import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Star } from "lucide-react";
import Layout from "../components/layout/Layout";
import { getProductById } from "../api/product.api";
import { getProductReviews } from "../api/review.api";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { formatPrice, formatDate } from "../utils/formatPrice";
import toast from "react-hot-toast";
import ReviewForm from "../components/review/ReviewForm";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, reviewRes] = await Promise.all([
          getProductById(id),
          getProductReviews(id),
        ]);
        setProduct(productRes.data.data);
        setReviews(reviewRes.data.data?.reviews || []);
        setReviewSummary(reviewRes.data.data?.summary || null);
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = () => {
    if (!token) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (product.colors?.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }
    addItem(product, quantity, selectedSize, selectedColor);
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
            <div className="aspect-square bg-gray-800" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-800 rounded w-3/4" />
              <div className="h-6 bg-gray-800 rounded w-1/4" />
              <div className="h-4 bg-gray-800 rounded w-full" />
              <div className="h-4 bg-gray-800 rounded w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="text-center py-20 text-gray-400">
          Product not found.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* ── Images ─────────────────────────────────────────────────── */}
          <div>
            {/* Main image */}
            <div className="aspect-square bg-gray-900 border border-gray-800 overflow-hidden mb-4">
              {product.images?.[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                  No Image
                </div>
              )}
            </div>

            {/* Thumbnail images */}
            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 border-2 overflow-hidden transition-colors ${
                      selectedImage === i
                        ? "border-brand-gold"
                        : "border-gray-700"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ───────────────────────────────────────────── */}
          <div>
            {/* Category badge */}
            <p className="text-brand-gold text-xs uppercase tracking-widest mb-2">
              {product.category}
            </p>

            {/* Name */}
            <h1 className="text-3xl font-bold text-white uppercase tracking-tight mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            {product.ratingCount > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={
                        star <= Math.round(product.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-600"
                      }
                    />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">
                  ({product.ratingCount} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <p className="text-3xl font-bold text-brand-gold mb-6">
              {formatPrice(product.price)}
            </p>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Size selector */}
            {product.sizes?.length > 0 && (
              <div className="mb-5">
                <p className="text-white text-sm uppercase tracking-wider mb-2">
                  Size{" "}
                  {selectedSize && (
                    <span className="text-brand-gold">— {selectedSize}</span>
                  )}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 border text-sm font-semibold transition-colors ${
                        selectedSize === size
                          ? "border-brand-gold bg-brand-gold text-black"
                          : "border-gray-600 text-white hover:border-brand-gold"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color selector */}
            {product.colors?.length > 0 && (
              <div className="mb-5">
                <p className="text-white text-sm uppercase tracking-wider mb-2">
                  Color{" "}
                  {selectedColor && (
                    <span className="text-brand-gold">— {selectedColor}</span>
                  )}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border text-sm transition-colors ${
                        selectedColor === color
                          ? "border-brand-gold bg-brand-gold text-black"
                          : "border-gray-600 text-white hover:border-brand-gold"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-white text-sm uppercase tracking-wider mb-2">
                Quantity
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 border border-gray-600 text-white hover:border-brand-gold transition-colors text-lg"
                >
                  −
                </button>
                <span className="text-white font-semibold w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 border border-gray-600 text-white hover:border-brand-gold transition-colors text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Stock status */}
            <p
              className={`text-sm mb-4 ${product.inStock ? "text-green-400" : "text-red-400"}`}
            >
              {product.inStock ? "✓ In Stock" : "✗ Out of Stock"}
            </p>

            {/* Add to cart button */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full bg-brand-gold text-black py-4 uppercase tracking-widest font-bold text-sm hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button>

            {/* SKU */}
            <p className="text-gray-600 text-xs mt-4">SKU: {product.sku}</p>
          </div>
        </div>

        {/* ── Reviews Section ─────────────────────────────────────────── */}
        {/* ── Reviews Section ─────────────────────────────────────────── */}
        <div className="mt-16 border-t border-gray-800 pt-10">
          <h2 className="text-2xl font-bold text-white uppercase tracking-tight mb-8">
            Customer Reviews
            {reviewSummary?.total > 0 && (
              <span className="text-brand-gold ml-3 text-lg">
                ({reviewSummary.total})
              </span>
            )}
          </h2>

          {/* Rating Summary */}
          {reviewSummary?.total > 0 && (
            <div className="bg-gray-900 border border-gray-800 p-6 mb-8 flex items-center gap-8">
              <div className="text-center">
                <p className="text-5xl font-bold text-brand-gold">
                  {reviewSummary.avgRating?.toFixed(1)}
                </p>
                <div className="flex justify-center mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={
                        star <= Math.round(reviewSummary.avgRating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-600"
                      }
                    />
                  ))}
                </div>
                <p className="text-gray-400 text-xs mt-1">
                  {reviewSummary.total} reviews
                </p>
              </div>
              <div className="flex-1 space-y-1">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs w-3">{star}</span>
                    <Star
                      size={10}
                      className="text-yellow-400 fill-yellow-400"
                    />
                    <div className="flex-1 bg-gray-800 h-2">
                      <div
                        className="bg-brand-gold h-2 transition-all"
                        style={{
                          width: reviewSummary.total
                            ? `${(reviewSummary[["one", "two", "three", "four", "five"][star - 1]] / reviewSummary.total) * 100}%`
                            : "0%",
                        }}
                      />
                    </div>
                    <span className="text-gray-500 text-xs w-4">
                      {reviewSummary[
                        ["one", "two", "three", "four", "five"][star - 1]
                      ] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="space-y-6 mb-10">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-gray-900 border border-gray-800 p-5"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {review.user?.firstName} {review.user?.lastName}
                      </p>
                      <div className="flex mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={12}
                            className={
                              star <= review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-600"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                  <p className="text-brand-gold text-sm font-semibold mb-1">
                    {review.title}
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {review.body}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm mb-10">
              No reviews yet. Be the first to review this product!
            </p>
          )}

          {/* Write a Review Form */}
          <ReviewForm
            productId={id}
            onReviewSubmitted={() => {
              // Refresh reviews after submission
              getProductReviews(id).then((res) => {
                setReviews(res.data.data?.reviews || []);
                setReviewSummary(res.data.data?.summary || null);
              });
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
