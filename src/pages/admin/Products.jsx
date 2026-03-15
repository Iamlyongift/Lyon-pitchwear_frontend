import { useState, useEffect } from "react";
import { Pencil, Trash2, ToggleLeft, ToggleRight, Plus } from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  adminGetAllProducts,
  adminDeleteProduct,
  adminToggleFeatured,
} from "../../api/admin.api";
import { formatPrice } from "../../utils/formatPrice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await adminGetAllProducts();
      setProducts(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await adminDeleteProduct(id);
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await adminToggleFeatured(id);
      toast.success("Featured status updated");
      fetchProducts();
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-brand-gold uppercase tracking-widest text-sm mb-1">
            Management
          </p>
          <h1 className="text-3xl font-bold text-white uppercase tracking-tight">
            Products
          </h1>
        </div>
        <button
          onClick={() => navigate("/admin/products/new")}
          className="flex items-center gap-2 bg-brand-gold text-black px-4 py-2 text-sm uppercase tracking-wider font-bold hover:bg-yellow-400 transition-colors"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-900 border border-gray-800 p-4 h-16 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-800">
                <tr>
                  <th className="text-gray-400 text-xs uppercase tracking-wider text-left px-4 py-3">
                    Product
                  </th>
                  <th className="text-gray-400 text-xs uppercase tracking-wider text-left px-4 py-3">
                    Category
                  </th>
                  <th className="text-gray-400 text-xs uppercase tracking-wider text-left px-4 py-3">
                    Price
                  </th>
                  <th className="text-gray-400 text-xs uppercase tracking-wider text-left px-4 py-3">
                    Stock
                  </th>
                  <th className="text-gray-400 text-xs uppercase tracking-wider text-left px-4 py-3">
                    Featured
                  </th>
                  <th className="text-gray-400 text-xs uppercase tracking-wider text-left px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-800 shrink-0 overflow-hidden">
                          {product.images?.[0] && (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium uppercase text-xs">
                            {product.name}
                          </p>
                          <p className="text-gray-500 text-xs">
                            SKU: {product.sku}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-400 capitalize">
                      {product.category}
                    </td>

                    <td className="px-4 py-3 text-brand-gold font-semibold">
                      {formatPrice(product.price)}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          product.inStock
                            ? "bg-green-900/30 text-green-400"
                            : "bg-red-900/30 text-red-400"
                        }`}
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleFeatured(product._id)}
                        className={
                          product.featured ? "text-brand-gold" : "text-gray-600"
                        }
                      >
                        {product.featured ? (
                          <ToggleRight size={24} />
                        ) : (
                          <ToggleLeft size={24} />
                        )}
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            navigate(`/admin/products/edit/${product._id}`)
                          }
                          className="text-gray-400 hover:text-brand-gold transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(product._id, product.name)
                          }
                          className="text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Products;
