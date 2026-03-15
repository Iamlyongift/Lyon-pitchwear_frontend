import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, Upload } from 'lucide-react';
import AdminLayout from '../../components/layout/AdminLayout';
import { adminCreateProduct, adminUpdateProduct, adminGetProductById } from '../../api/admin.api';
import toast from 'react-hot-toast';

const SIZES    = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const CATEGORIES = [
  { value: 'kits',               label: 'Kits'               },
  { value: 'gym-gear',           label: 'Gym Gear'           },
  { value: 'training-equipment', label: 'Training Equipment' },
];

const ProductForm = () => {
  const navigate    = useNavigate();
  const { id }      = useParams();
  const isEdit      = Boolean(id);

  const [loading, setLoading]         = useState(false);
  const [fetching, setFetching]       = useState(isEdit);
  const [newImages, setNewImages]     = useState([]);        // File objects
  const [previews, setPreviews]       = useState([]);        // Preview URLs
  const [existingImages, setExistingImages] = useState([]); // Existing Cloudinary URLs
  const [colorInput, setColorInput]   = useState('');

  const [form, setForm] = useState({
    name:        '',
    description: '',
    price:       '',
    category:    'kits',
    subCategory: '',
    sku:         '',
    inStock:     true,
    featured:    false,
    sizes:       [],
    colors:      [],
  });

  // Fetch product data if editing
  useEffect(() => {
    if (!isEdit) return;
    const fetchProduct = async () => {
      try {
        const res = await adminGetProductById(id);
        const p   = res.data.data;
        setForm({
          name:        p.name        || '',
          description: p.description || '',
          price:       p.price       || '',
          category:    p.category    || 'kits',
          subCategory: p.subCategory || '',
          sku:         p.sku         || '',
          inStock:     p.inStock     ?? true,
          featured:    p.featured    ?? false,
          sizes:       p.sizes       || [],
          colors:      p.colors      || [],
        });
        setExistingImages(p.images || []);
      } catch (err) {
        toast.error('Failed to load product');
      } finally {
        setFetching(false);
      }
    };
    fetchProduct();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  // Toggle size selection
  const toggleSize = (size) => {
    setForm({
      ...form,
      sizes: form.sizes.includes(size)
        ? form.sizes.filter((s) => s !== size)
        : [...form.sizes, size],
    });
  };

  // Add color
  const addColor = () => {
    const color = colorInput.trim().toLowerCase();
    if (!color) return;
    if (form.colors.includes(color)) {
      toast.error('Color already added');
      return;
    }
    setForm({ ...form, colors: [...form.colors, color] });
    setColorInput('');
  };

  // Remove color
  const removeColor = (color) => {
    setForm({ ...form, colors: form.colors.filter((c) => c !== color) });
  };

  // Handle image file selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + newImages.length + files.length;
    if (totalImages > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setNewImages([...newImages, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  // Remove existing image
  const removeExistingImage = (url) => {
    setExistingImages(existingImages.filter((img) => img !== url));
  };

  // Remove new image
  const removeNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.sizes.length === 0 && form.category === 'kits') {
      toast.error('Please select at least one size for kits');
      return;
    }

    setLoading(true);
    try {
      // Build FormData — needed for file uploads
      const formData = new FormData();

      // Append text fields
      Object.entries(form).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v, i) => formData.append(`${key}[${i}]`, v));
        } else {
          formData.append(key, value);
        }
      });

      // Append new image files
      newImages.forEach((file) => formData.append('images', file));

      // Append existing image URLs to keep (for update)
      if (isEdit) {
        existingImages.forEach((url, i) =>
          formData.append(`existingImages[${i}]`, url)
        );
      }

      if (isEdit) {
        await adminUpdateProduct(id, formData);
        toast.success('Product updated successfully!');
      } else {
        await adminCreateProduct(formData);
        toast.success('Product created successfully!');
      }

      navigate('/admin/products');
    } catch (err) {
      const msg = err.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg[0] : msg || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-800 rounded" />
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-brand-gold uppercase tracking-widest text-sm mb-1">
            {isEdit ? 'Edit' : 'New'} Product
          </p>
          <h1 className="text-3xl font-bold text-white uppercase tracking-tight">
            {isEdit ? 'Update Product' : 'Add Product'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── Basic Info ───────────────────────────────────────────── */}
          <div className="bg-gray-900 border border-gray-800 p-6 space-y-4">
            <h2 className="text-white font-bold uppercase tracking-wider text-sm mb-4">
              Basic Information
            </h2>

            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">
                Product Name *
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                placeholder="Lyon Home Kit"
              />
            </div>

            <div>
              <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors resize-none"
                placeholder="Premium match-day home kit..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">
                  Price (₦) *
                </label>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                  placeholder="25000"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">
                  SKU *
                </label>
                <input
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors uppercase"
                  placeholder="LYN-HK-001"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-xs uppercase tracking-wider block mb-2">
                  Sub Category
                </label>
                <input
                  name="subCategory"
                  value={form.subCategory}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                  placeholder="home, away, training..."
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="flex gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={form.inStock}
                  onChange={handleChange}
                  className="w-4 h-4 accent-yellow-500"
                />
                <span className="text-white text-sm">In Stock</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                  className="w-4 h-4 accent-yellow-500"
                />
                <span className="text-white text-sm">Featured</span>
              </label>
            </div>
          </div>

          {/* ── Sizes ────────────────────────────────────────────────── */}
          <div className="bg-gray-900 border border-gray-800 p-6">
            <h2 className="text-white font-bold uppercase tracking-wider text-sm mb-4">Sizes</h2>
            <div className="flex gap-2 flex-wrap">
              {SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`w-12 h-12 border text-sm font-semibold transition-colors ${
                    form.sizes.includes(size)
                      ? 'border-brand-gold bg-brand-gold text-black'
                      : 'border-gray-600 text-white hover:border-brand-gold'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* ── Colors ───────────────────────────────────────────────── */}
          <div className="bg-gray-900 border border-gray-800 p-6">
            <h2 className="text-white font-bold uppercase tracking-wider text-sm mb-4">Colors</h2>

            {/* Color tags */}
            {form.colors.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-4">
                {form.colors.map((color) => (
                  <span
                    key={color}
                    className="flex items-center gap-1 bg-gray-800 border border-gray-700 text-white px-3 py-1 text-sm"
                  >
                    {color}
                    <button
                      type="button"
                      onClick={() => removeColor(color)}
                      className="text-gray-400 hover:text-red-400 ml-1"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add color input */}
            <div className="flex gap-2">
              <input
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addColor(); }}}
                className="flex-1 bg-gray-800 border border-gray-700 text-white px-4 py-2 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                placeholder="Type a color and press Enter or Add"
              />
              <button
                type="button"
                onClick={addColor}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 text-sm transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* ── Images ───────────────────────────────────────────────── */}
          <div className="bg-gray-900 border border-gray-800 p-6">
            <h2 className="text-white font-bold uppercase tracking-wider text-sm mb-4">
              Images <span className="text-gray-500 font-normal normal-case">(max 5)</span>
            </h2>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Current Images</p>
                <div className="flex gap-2 flex-wrap">
                  {existingImages.map((url, i) => (
                    <div key={i} className="relative w-20 h-20">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(url)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New image previews */}
            {previews.length > 0 && (
              <div className="mb-4">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">New Images</p>
                <div className="flex gap-2 flex-wrap">
                  {previews.map((url, i) => (
                    <div key={i} className="relative w-20 h-20">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload button */}
            {(existingImages.length + newImages.length) < 5 && (
              <label className="flex items-center gap-2 border-2 border-dashed border-gray-700 hover:border-brand-gold p-6 cursor-pointer transition-colors justify-center">
                <Upload size={20} className="text-gray-400" />
                <span className="text-gray-400 text-sm">Click to upload images</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* ── Submit ───────────────────────────────────────────────── */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-brand-gold text-black py-4 uppercase tracking-widest font-bold text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              {loading
                ? (isEdit ? 'Updating...' : 'Creating...')
                : (isEdit ? 'Update Product' : 'Create Product')
              }
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="border border-gray-600 text-white px-6 py-4 text-sm uppercase tracking-wider hover:border-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ProductForm;