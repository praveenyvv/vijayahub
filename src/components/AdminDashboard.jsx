import React, { useState } from 'react';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Truck,
  Store,
  FileText,
  RotateCcw,
  Search,
  ExternalLink,
  Lock,
  Eye,
  Upload,
  Image as ImageIcon,
  X,
  Star,
  Cloud,
  Bell,
  Sparkles,
  Clock,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

// Sample royalty-free photo presets to make testing instant for the owner
const IMAGE_PRESETS = [
  { label: 'Mixer Grinder', url: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Induction Stove', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80' },
  { label: 'Air Fryer', url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80' },
  { label: 'Gas Stove', url: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=800&q=80' },
  { label: 'Electric Kettle', url: 'https://images.unsplash.com/photo-1520038410233-7141be7e6f97?auto=format&fit=crop&w=800&q=80' },
  { label: 'Cashews (Kaju)', url: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80' },
  { label: 'Almonds (Badam)', url: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80' },
  { label: 'Walnuts (Akhrot)', url: 'https://images.unsplash.com/photo-1558818498-28c1e002b655?auto=format&fit=crop&w=800&q=80' },
  { label: 'Figs (Anjeer)', url: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Raisins (Kishmish)', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80' }
];

const DEFAULT_LOOSE_VARIANTS = [
  { weight: '100g', label: '100g Pouch', price: 120, mrp: 160 },
  { weight: '250g', label: '250g Pouch', price: 265, mrp: 340 },
  { weight: '500g', label: '500g Pouch', price: 499, mrp: 650, isDefault: true },
  { weight: '1kg', label: '1 KG Value Pack', price: 960, mrp: 1250 }
];

export default function AdminDashboard() {
  const {
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    setInvoiceOrder,
    resetToDemoData,
    storeInfo,
    setIsAdminMode,
    isCloudConnected,
    newOrderAlert,
    setNewOrderAlert,
    categories,
    setCategories,
    feedbacks,
    seedDefaultCatalog
  } = useStore();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products', 'customers', 'feedbacks', 'settings'
  const [orderFilter, setOrderFilter] = useState('All');
  const [orderDateFilter, setOrderDateFilter] = useState('All'); // 'All', 'Today', 'Tomorrow'
  const [orderSearch, setOrderSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // Dynamic Category Creation
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategoryInput, setShowAddCategoryInput] = useState(false);

  // Dedicated OTP Verification Modal state
  const [otpVerificationModal, setOtpVerificationModal] = useState({
    isOpen: false,
    order: null,
    enteredOtp: '',
    error: ''
  });

  // Add / Edit Product Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [customUrlInput, setCustomUrlInput] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: categories[0] || 'Kitchen Appliances',
    price: '',
    mrp: '',
    stock: '',
    maxPerCustomer: 0,
    hasVariants: false,
    variants: DEFAULT_LOOSE_VARIANTS,
    images: [IMAGE_PRESETS[0].url],
    image: IMAGE_PRESETS[0].url,
    description: '',
    power: '',
    warranty: '',
    boxContents: '',
    packWeight: '',
    grade: '',
    badge: ''
  });

  // Calculate Metrics
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  const openAddProductModal = () => {
    setEditingProductId(null);
    setCustomUrlInput('');
    setFormData({
      title: '',
      category: categories[0] || 'Kitchen Appliances',
      price: '',
      mrp: '',
      stock: '10',
      maxPerCustomer: 0,
      hasVariants: false,
      variants: DEFAULT_LOOSE_VARIANTS,
      images: [IMAGE_PRESETS[0].url],
      image: IMAGE_PRESETS[0].url,
      description: '',
      power: '',
      warranty: '1 Year Warranty',
      boxContents: '',
      packWeight: '500g',
      grade: 'Grade A',
      badge: 'New Arrival'
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product) => {
    setEditingProductId(product.id);
    setCustomUrlInput('');
    const existingImages =
      Array.isArray(product.images) && product.images.length > 0
        ? [...product.images]
        : (product.image ? [product.image] : [IMAGE_PRESETS[0].url]);

    setFormData({
      title: product.title,
      category: product.category,
      price: product.price,
      mrp: product.mrp,
      stock: product.stock,
      maxPerCustomer: product.maxPerCustomer || product.max_per_customer || 0,
      hasVariants: Boolean(product.hasVariants),
      variants:
        product.variants && product.variants.length > 0
          ? [...product.variants]
          : DEFAULT_LOOSE_VARIANTS,
      images: existingImages,
      image: existingImages[0] || product.image,
      description: product.description || '',
      power: product.specs?.power || '',
      warranty: product.specs?.warranty || '',
      boxContents: product.specs?.boxContents || '',
      packWeight: product.specs?.packWeight || '',
      grade: product.specs?.grade || '',
      badge: product.badge || ''
    });
    setIsProductModalOpen(true);
  };

  const handleUpdateVariantPrice = (weight, field, value) => {
    setFormData((prev) => {
      const updatedVariants = prev.variants.map((v) =>
        v.weight === weight ? { ...v, [field]: Number(value) } : v
      );
      const defaultVar = updatedVariants.find((v) => v.isDefault) || updatedVariants[0];
      return {
        ...prev,
        variants: updatedVariants,
        price: defaultVar?.price || prev.price,
        mrp: defaultVar?.mrp || prev.mrp
      };
    });
  };

  // Multiple image file upload handler (converts files to base64 Data URLs)
  const handleImageFilesUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const readers = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((newBase64Images) => {
      setFormData((prev) => {
        const validNew = newBase64Images.filter(Boolean);
        const updated = [...(prev.images || []), ...validNew];
        return {
          ...prev,
          images: updated,
          image: updated[0] || prev.image
        };
      });
    });
    e.target.value = '';
  };

  const handleAddUrlImage = () => {
    const trimmed = customUrlInput.trim();
    if (!trimmed) return;
    setFormData((prev) => {
      const updated = [...(prev.images || []), trimmed];
      return {
        ...prev,
        images: updated,
        image: updated[0] || trimmed
      };
    });
    setCustomUrlInput('');
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => {
      const updated = prev.images.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: updated,
        image: updated[0] || ''
      };
    });
  };

  const handleSetCoverImage = (indexToCover) => {
    setFormData((prev) => {
      const updated = [...prev.images];
      const [chosen] = updated.splice(indexToCover, 1);
      updated.unshift(chosen);
      return {
        ...prev,
        images: updated,
        image: chosen
      };
    });
  };

  const handlePresetAdd = (presetUrl) => {
    setFormData((prev) => {
      const updated = [...(prev.images || []), presetUrl];
      return {
        ...prev,
        images: updated,
        image: updated[0] || presetUrl
      };
    });
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const finalImages =
      formData.images && formData.images.length > 0
        ? formData.images
        : (formData.image ? [formData.image] : [IMAGE_PRESETS[0].url]);

    const productPayload = {
      title: formData.title,
      category: formData.category,
      price: Number(formData.price),
      mrp: Number(formData.mrp || formData.price),
      stock: Number(formData.stock),
      maxPerCustomer: Number(formData.maxPerCustomer || 0),
      hasVariants: Boolean(formData.hasVariants),
      variants: formData.hasVariants ? formData.variants : [],
      images: finalImages,
      image: finalImages[0],
      description: formData.description,
      badge: formData.badge,
      specs:
        formData.category === 'Kitchen Appliances'
          ? {
              power: formData.power,
              warranty: formData.warranty,
              boxContents: formData.boxContents
            }
          : {
              packWeight: formData.packWeight,
              grade: formData.grade,
              fssaiLicense: storeInfo.fssaiNumber
            }
    };

    if (editingProductId) {
      updateProduct(editingProductId, productPayload);
    } else {
      addProduct(productPayload);
    }

    setIsProductModalOpen(false);
  };

  // Helper to get YYYY-MM-DD in local browser/client timezone
  const getLocalDateStr = (d = new Date()) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayDateStr = getLocalDateStr(new Date());
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowDateStr = getLocalDateStr(tomorrowDate);

  const getOrderLocalDateStr = (dateVal) => {
    if (!dateVal) return '';
    try {
      return getLocalDateStr(new Date(dateVal));
    } catch {
      return String(dateVal).split('T')[0];
    }
  };

  const filteredOrders = orders.filter((o) => {
    // 1. Status Filter
    const matchesStatus =
      orderFilter === 'All' || o.status.toLowerCase() === orderFilter.toLowerCase();

    // 2. Search Filter (by Order ID e.g. VH-1024, Customer Name, or Phone Number)
    const q = orderSearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      (o.customer?.name && o.customer.name.toLowerCase().includes(q)) ||
      (o.customer?.phone && o.customer.phone.includes(q)) ||
      (o.upiRefNumber && o.upiRefNumber.toLowerCase().includes(q));

    // 3. Date / Pickup Timing Filter
    let matchesDate = true;
    if (orderDateFilter === 'Today') {
      const orderLocalDay = getOrderLocalDateStr(o.date);
      matchesDate =
        orderLocalDay === todayDateStr ||
        (o.date && o.date.startsWith(todayDateStr)) ||
        (o.pickupSlot && o.pickupSlot.toLowerCase().includes('today'));
    } else if (orderDateFilter === 'Tomorrow') {
      const orderLocalDay = getOrderLocalDateStr(o.date);
      matchesDate =
        orderLocalDay === tomorrowDateStr ||
        (o.date && o.date.startsWith(tomorrowDateStr)) ||
        (o.pickupSlot && o.pickupSlot.toLowerCase().includes('tomorrow'));
    }

    return matchesStatus && matchesSearch && matchesDate;
  });

  // Calculate Unique Registered / Ordering Customers
  const customerMap = {};
  orders.forEach((o) => {
    const phone = o.customer?.phone?.replace(/\D/g, '');
    if (phone) {
      if (!customerMap[phone]) {
        customerMap[phone] = {
          name: o.customer.name,
          phone: o.customer.phone,
          email: o.customer.email,
          ordersCount: 0,
          totalSpent: 0,
          lastOrderDate: o.date,
          orders: []
        };
      }
      customerMap[phone].ordersCount += 1;
      if (o.paymentStatus === 'PAID') {
        customerMap[phone].totalSpent += o.total;
      }
      customerMap[phone].orders.push(o);
    }
  });
  const customerList = Object.values(customerMap);

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100/70 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black text-slate-900">
                Vijaya<span className="text-amber-600">Hub</span> Owner Portal
              </span>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                Live Admin Mode
              </span>
              {/* Cloud Sync Status Badge */}
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
                  isCloudConnected
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
                title={
                  isCloudConnected
                    ? 'Supabase Cloud Database connected & syncing real-time across devices'
                    : 'LocalStorage active. Connect Supabase credentials in .env to enable multi-device cloud sync.'
                }
              >
                <Cloud className={`w-3 h-3 ${isCloudConnected ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{isCloudConnected ? 'Cloud Synced' : 'Local Mode'}</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Store Owner Dashboard • Manage Products, Prices, Stock & Local Vizag Orders
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsAdminMode(false)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Preview Live Store</span>
            </button>
            <button
              onClick={seedDefaultCatalog}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 border border-emerald-300"
              title="Upload and restore all initial 10 products (mixers, cooktop, cashews, almonds) permanently into Supabase Cloud"
            >
              <Cloud className="w-3.5 h-3.5 text-emerald-600" />
              <span>Seed Cloud Catalog</span>
            </button>
            <button
              onClick={resetToDemoData}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 border border-slate-200"
              title="Reset products and orders to initial demo state"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>

        {/* Real-time Order Popup Banner (if a new order was received from cloud) */}
        {newOrderAlert && (
          <div className="bg-emerald-600 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top duration-300">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-white animate-bounce" />
              </div>
              <div>
                <p className="font-extrabold text-sm">
                  🔔 New Order Received: #{newOrderAlert.id} (₹{newOrderAlert.total?.toLocaleString('en-IN')})
                </p>
                <p className="text-xs text-emerald-100">
                  Customer: <strong>{newOrderAlert.customer?.name}</strong> • Slot: {newOrderAlert.pickupSlot}
                </p>
              </div>
            </div>
            <button
              onClick={() => setNewOrderAlert(null)}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Executive Metrics Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              Direct to Consumer in Vizag
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900">{totalOrders}</p>
            <p className="text-[11px] text-slate-500 font-semibold mt-1">
              Pickup + 20 KM Delivery
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Active Products</span>
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900">{products.length}</p>
            <p className="text-[11px] text-slate-500 font-semibold mt-1">
              In stock catalog
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Low Stock</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-rose-600">
              {lowStockProducts.length}
            </p>
            <p className="text-[11px] text-rose-700 font-semibold mt-1">
              Items with &le; 5 units left
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white rounded-2xl px-3 pt-2 shadow-xs">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'orders'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders & Fulfillment ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'products'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Catalog & Stock ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'customers'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Customers List ({customerList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('feedbacks')}
            className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'feedbacks'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Feedback & Support ({feedbacks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'settings'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Vizag Store & Categories</span>
          </button>
        </div>

        {/* TAB 1: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Customer Orders Pipeline
                </h3>
                <p className="text-xs text-slate-500">
                  Update status here to immediately update the customer's live tracking screen!
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {['All', 'Placed', 'Packed', 'Ready for Pickup', 'Completed', 'Cancelled'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setOrderFilter(filter)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                      orderFilter === filter
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Order Search & Date Filter Bar (Handles 100+ Orders easily) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
              {/* Search Bar */}
              <div className="sm:col-span-2 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Instant Search: Enter Order ID (e.g. VH-1024), Customer Mobile, or Name..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-amber-500 font-semibold"
                />
                {orderSearch && (
                  <button
                    onClick={() => setOrderSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Date Filter (Today / Tomorrow / All) */}
              <div className="flex items-center justify-end gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase px-2">Pickup:</span>
                {['All', 'Today', 'Tomorrow'].map((df) => (
                  <button
                    key={df}
                    onClick={() => setOrderDateFilter(df)}
                    className={`flex-1 py-1 px-2 text-[11px] font-bold rounded-lg transition-colors text-center ${
                      orderDateFilter === df
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {df}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Order ID</th>
                    <th className="py-3 px-3">Customer & Contact</th>
                    <th className="py-3 px-3">Fulfillment</th>
                    <th className="py-3 px-3">Items</th>
                    <th className="py-3 px-3">Total Amount</th>
                    <th className="py-3 px-3">Current Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        No orders match this filter. Place a test order from the storefront!
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Order ID */}
                        <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                          {order.id}
                        </td>

                        {/* Customer & Pickup Verification OTP */}
                        <td className="py-3.5 px-3">
                          <p className="font-bold text-slate-900">{order.customer.name}</p>
                          <p className="text-slate-500 text-[11px]">📞 {order.customer.phone}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-amber-300" title="Counter Handover OTP">
                              OTP: <strong>{order.pickupOtp || order.pickup_otp || order.customer?.pickupOtp || '4821'}</strong>
                            </span>
                            <a
                              href={`https://wa.me/91${order.customer?.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${order.customer.name}! VijayaHub Order #${order.id} update: Status is '${order.status}'. Verification OTP: ${order.pickupOtp || order.pickup_otp || order.customer?.pickupOtp || '4821'}`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200"
                              title="Send WhatsApp update to customer"
                            >
                              WA Alert
                            </a>
                          </div>
                        </td>

                        {/* Fulfillment */}
                        {/* Pickup Slot & 24hr Expiry */}
                        <td className="py-3.5 px-3">
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 font-bold px-2 py-0.5 rounded-full text-[10px] border border-amber-200">
                              <Store className="w-3 h-3 text-amber-600" /> Dwaraka Nagar Hub
                            </span>
                            <p className="text-[11px] text-slate-700 font-semibold line-clamp-1">
                              Slot: {order.pickupSlot || 'Immediate'}
                            </p>
                            {order.expiresAt && order.status !== 'Completed' && (
                              <p className={`text-[10px] font-mono font-bold ${
                                new Date(order.expiresAt) < new Date() ? 'text-rose-600' : 'text-slate-500'
                              }`}>
                                {new Date(order.expiresAt) < new Date() ? '⚠️ Expired (Restocked)' : `Expires: ${new Date(order.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Items */}
                        <td className="py-3.5 px-3">
                          <div className="space-y-1 max-w-xs">
                            {order.items.map((it, idx) => (
                              <div key={idx} className="text-slate-700 text-[11px] leading-tight">
                                <span className="font-bold text-slate-900">{it.quantity}x</span> {it.title}
                                {it.selectedWeight && (
                                  <span className="ml-1 text-[10px] text-amber-800 font-bold bg-amber-50 px-1 py-0.2 rounded border border-amber-200">
                                    {it.selectedWeight}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Total & Payment */}
                        <td className="py-3.5 px-3">
                          <p className="font-extrabold text-slate-900">
                            ₹{order.total.toLocaleString('en-IN')}
                          </p>
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-emerald-700 block">
                              {order.paymentStatus}
                            </span>
                            {order.upiRefNumber && order.upiRefNumber !== 'Direct Transfer' && (
                              <span className="inline-block text-[9px] font-mono bg-amber-50 text-amber-900 font-bold px-1.5 py-0.5 rounded border border-amber-200">
                                UTR: {order.upiRefNumber}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Order Status Controller (Forward-Only Progression) */}
                        <td className="py-3.5 px-3">
                          <select
                            value={order.status}
                            disabled={order.status === 'Completed' || order.status === 'Cancelled'}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === 'Completed') {
                                setOtpVerificationModal({
                                  isOpen: true,
                                  order: order,
                                  enteredOtp: '',
                                  error: ''
                                });
                              } else {
                                updateOrderStatus(order.id, val);
                              }
                            }}
                            className={`border rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-hidden ${
                              order.status === 'Cancelled'
                                ? 'bg-rose-50 border-rose-300 text-rose-800 opacity-80 cursor-not-allowed'
                                : order.status === 'Completed'
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 cursor-not-allowed'
                                : order.status === 'Ready for Pickup'
                                ? 'bg-amber-50 border-amber-300 text-amber-800'
                                : order.status === 'Packed'
                                ? 'bg-sky-50 border-sky-300 text-sky-800'
                                : 'bg-white border-slate-300 text-slate-800'
                            }`}
                          >
                            <option value="Placed" disabled={order.status !== 'Placed'}>
                              1. Placed
                            </option>
                            <option
                              value="Packed"
                              disabled={
                                order.status === 'Ready for Pickup' ||
                                order.status === 'Completed'
                              }
                            >
                              2. Packed
                            </option>
                            <option
                              value="Ready for Pickup"
                              disabled={order.status === 'Completed'}
                            >
                              3. Ready for Pickup
                            </option>
                            <option value="Completed">4. Completed / Collected</option>
                            <option value="Cancelled">⚠️ Cancel & Restock</option>
                          </select>
                        </td>

                        {/* Invoice & View */}
                        <td className="py-3.5 px-3 text-right">
                          <button
                            onClick={() => setInvoiceOrder(order)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] transition-colors border border-slate-200"
                            title="Generate Tax Invoice"
                          >
                            <FileText className="w-3 h-3 text-amber-600" />
                            <span>Invoice</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCT MANAGEMENT & STOCK */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Product Inventory & Prices
                </h3>
                <p className="text-xs text-slate-500">
                  Add, edit, or adjust stock counts on any of your products with zero code!
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search product..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                  />
                </div>

                <button
                  onClick={openAddProductModal}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm shadow-amber-600/30 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

            {/* Product Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Product</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Price & MRP</th>
                    <th className="py-3 px-3">Stock Count</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => {
                    const isOut = product.stock <= 0;
                    const isLow = product.stock > 0 && product.stock <= 5;

                    return (
                      <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Title & Image */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <img
                                src={product.images?.[0] || product.image}
                                alt={product.title}
                                className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200"
                              />
                              {(product.images?.length > 1) && (
                                <span className="absolute -bottom-1 -right-1 bg-black/75 text-white text-[9px] font-bold px-1 py-0.2 rounded-md shadow-xs">
                                  +{product.images.length}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 line-clamp-1">{product.title}</p>
                              <p className="text-[11px] text-slate-400 line-clamp-1">
                                {product.specs?.power || product.specs?.packWeight || 'Vizag Stock'}
                              </p>
                              {product.hasVariants && product.variants?.length > 0 && (
                                <div className="flex items-center gap-1 mt-1 flex-wrap">
                                  <span className="text-[9px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                                    Multi-Pack ({product.variants.length}):
                                  </span>
                                  {product.variants.map((v) => (
                                    <span key={v.weight} className="text-[9px] font-mono bg-slate-100 text-slate-700 px-1 py-0.2 rounded">
                                      {v.weight}: ₹{v.price}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-3">
                          <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                            {product.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-3">
                          <p className="font-extrabold text-slate-900">
                            ₹{product.price.toLocaleString('en-IN')}
                          </p>
                          <p className="text-[10px] text-slate-400 line-through">
                            ₹{product.mrp.toLocaleString('en-IN')}
                          </p>
                        </td>

                        {/* Stock Adjuster */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateProduct(product.id, { stock: Math.max(0, product.stock - 1) })
                              }
                              className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600"
                            >
                              -
                            </button>
                            <span className="font-bold font-mono text-slate-900 min-w-6 text-center">
                              {product.stock}
                            </span>
                            <button
                              onClick={() =>
                                updateProduct(product.id, { stock: product.stock + 1 })
                              }
                              className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center font-bold text-slate-600"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* Stock Badge */}
                        <td className="py-3 px-3">
                          {isOut ? (
                            <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded">
                              Out of Stock
                            </span>
                          ) : isLow ? (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                              Low ({product.stock})
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                              Available
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditProductModal(product)}
                              className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                              title="Edit product details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete "${product.title}"?`)) {
                                  deleteProduct(product.id);
                                }
                              }}
                              className="p-1.5 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: REGISTERED CUSTOMERS DIRECTORY */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Customer Directory & Order History ({customerList.length} Customers)
                </h3>
                <p className="text-xs text-slate-500">
                  View customers who have placed store pickup orders, their total spend, and contact numbers.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Customer Name</th>
                    <th className="py-3 px-3">Mobile Number</th>
                    <th className="py-3 px-3">Total Orders</th>
                    <th className="py-3 px-3">Total Value (Paid)</th>
                    <th className="py-3 px-3">Last Order Date</th>
                    <th className="py-3 px-3 text-right">Quick Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customerList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No customer orders recorded yet.
                      </td>
                    </tr>
                  ) : (
                    customerList.map((cust) => (
                      <tr key={cust.phone} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-slate-900">
                          {cust.name}
                        </td>
                        <td className="py-3.5 px-3 font-mono font-bold text-slate-700">
                          📞 {cust.phone}
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="bg-slate-100 text-slate-800 font-extrabold text-xs px-2.5 py-0.5 rounded-full">
                            {cust.ordersCount} orders
                          </span>
                        </td>
                        <td className="py-3.5 px-3 font-extrabold text-emerald-700">
                          ₹{cust.totalSpent.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-3 text-slate-500 text-[11px]">
                          {cust.lastOrderDate ? new Date(cust.lastOrderDate).toLocaleDateString() : '—'}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <a
                            href={`https://wa.me/91${cust.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(cust.name)},%20this%20is%20VijayaHub%20Dwaraka%20Nagar%20store`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold text-[11px] border border-emerald-200 transition"
                          >
                            WhatsApp
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOMER SUPPORT TICKETS & FEEDBACK */}
        {activeTab === 'feedbacks' && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Customer Reviews, Inquiries & Complaints ({feedbacks.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time feedback submitted by shoppers from the customer storefront.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Customer & Contact</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Rating / Order ID</th>
                    <th className="py-3 px-3">Message / Complaint</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {feedbacks.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No feedback or complaints submitted yet.
                      </td>
                    </tr>
                  ) : (
                    feedbacks.map((fb) => (
                      <tr key={fb.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-3 text-slate-500 text-[11px] whitespace-nowrap">
                          {new Date(fb.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-3">
                          <p className="font-bold text-slate-900">{fb.customer_name}</p>
                          <p className="text-slate-500 font-mono text-[11px]">📞 {fb.customer_phone}</p>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className={`inline-block font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            fb.type === 'complaint'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : fb.type === 'order_help'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {fb.type}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          {fb.type === 'review' && (
                            <span className="font-bold text-amber-700">⭐ {fb.rating}/5</span>
                          )}
                          {fb.order_id && (
                            <span className="font-mono font-bold text-slate-700 block text-[11px]">
                              Order #{fb.order_id}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 max-w-sm text-slate-700 leading-relaxed font-medium">
                          {fb.message}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <a
                            href={`https://wa.me/91${fb.customer_phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(fb.customer_name)},%20this%20is%20VijayaHub%20support%20regarding%20your%20feedback`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-[11px] transition shadow-2xs"
                          >
                            Resolve / Chat
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: STORE & CATEGORY RULES */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Visakhapatnam Store Pickup & 24-Hour Inventory Rules
              </h3>
              <p className="text-xs text-slate-500">
                Our operations are strictly store pickup at Dwaraka Nagar with automated inventory protection.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pickup Location Settings */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-amber-600" />
                  <h4 className="font-bold text-sm text-slate-900">Dwaraka Nagar Hub Location</h4>
                </div>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <p><strong>Hub Name:</strong> {storeInfo.name}</p>
                  <p><strong>Address:</strong> {storeInfo.address}</p>
                  <p><strong>Working Hours:</strong> {storeInfo.workingHours}</p>
                  <p><strong>Manager Phone:</strong> {storeInfo.phone}</p>
                  <p className="text-emerald-700 font-bold pt-1">
                    ✓ Pickup fee is always ₹0 (Free for all customers)
                  </p>
                </div>
              </div>

              {/* 24-Hour Auto Restock Rule */}
              <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <h4 className="font-bold text-sm text-amber-950">24-Hour Expiry & Auto-Restock Rule</h4>
                </div>
                <div className="space-y-1.5 text-xs text-amber-900">
                  <p><strong>Pickup Window:</strong> 24 Hours from online order booking</p>
                  <p><strong>Auto-Cancellation:</strong> Any order not collected within 24 hours is automatically cancelled by the system.</p>
                  <p><strong>Automatic Restock:</strong> When an order expires or is cancelled, all items are <strong>immediately returned to product stock</strong> so other shoppers can purchase them.</p>
                  <p className="text-emerald-800 font-bold pt-1">
                    ✓ Zero stranded stock • Protected inventory
                  </p>
                </div>
              </div>

              {/* Dynamic Category Management */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 md:col-span-2 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">
                      Storefront Product Categories ({categories.length})
                    </h4>
                    <p className="text-xs text-slate-500">
                      Create custom categories (e.g. "Gift Hampers", "Festive Specials", "Raw Spices") without writing any code!
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddCategoryInput(!showAddCategoryInput)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Category</span>
                  </button>
                </div>

                {showAddCategoryInput && (
                  <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 animate-in fade-in duration-150">
                    <input
                      type="text"
                      placeholder="e.g. Diwali Gift Hampers, Organic Seeds, Cookware..."
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newCategoryName.trim()) return;
                        if (categories.includes(newCategoryName.trim())) {
                          alert('Category already exists!');
                          return;
                        }
                        setCategories([...categories, newCategoryName.trim()]);
                        setNewCategoryName('');
                        setShowAddCategoryInput(false);
                      }}
                      className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition"
                    >
                      Save Category
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddCategoryInput(false)}
                      className="p-2 text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* Categories Badge List */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {categories.map((cat) => (
                    <div
                      key={cat}
                      className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800"
                    >
                      <span>{cat}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({products.filter((p) => p.category === cat).length} items)
                      </span>
                      {cat !== 'Kitchen Appliances' && cat !== 'Dry Fruits & Nuts' && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete category "${cat}"?`)) {
                              setCategories(categories.filter((c) => c !== cat));
                            }
                          }}
                          className="text-slate-400 hover:text-rose-600 transition"
                          title="Remove category"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* COUNTER PICKUP OTP VERIFICATION MODAL (PREVENTS FALSE HANDOVERS) */}
      {otpVerificationModal.isOpen && otpVerificationModal.order && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/30">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    Counter Handover Authentication
                  </h3>
                  <p className="text-xs text-slate-300">
                    Order #{otpVerificationModal.order.id} • {otpVerificationModal.order.customer?.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  setOtpVerificationModal({ isOpen: false, order: null, enteredOtp: '', error: '' })
                }
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 space-y-1.5">
                <p className="font-bold text-slate-900">
                  🛡️ Store Security Protocol:
                </p>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Ask the customer to open their <strong>'My Orders'</strong> tracking screen or show the WhatsApp message to give you their <strong>4-Digit Pickup OTP</strong>.
                </p>
              </div>

              {/* OTP Input Form */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-slate-800 text-center uppercase tracking-wider">
                  Enter Customer's 4-Digit Pickup OTP
                </label>
                <div className="flex justify-center">
                  <input
                    type="text"
                    maxLength={4}
                    autoFocus
                    placeholder="• • • •"
                    value={otpVerificationModal.enteredOtp}
                    onChange={(e) =>
                      setOtpVerificationModal((prev) => ({
                        ...prev,
                        enteredOtp: e.target.value.replace(/\D/g, ''),
                        error: ''
                      }))
                    }
                    className="w-48 py-3 text-center text-3xl font-mono font-black tracking-widest bg-slate-50 border-2 border-slate-300 focus:border-amber-600 rounded-2xl focus:bg-white focus:outline-hidden"
                  />
                </div>
                {otpVerificationModal.error && (
                  <p className="text-xs text-rose-600 font-bold text-center animate-shake">
                    {otpVerificationModal.error}
                  </p>
                )}
              </div>

              {/* Order Reference details */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Customer Phone:</span>
                  <strong className="text-slate-900 font-mono">
                    {otpVerificationModal.order.customer?.phone}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Order Total:</span>
                  <strong className="text-emerald-700 font-bold">
                    ₹{otpVerificationModal.order.total?.toLocaleString('en-IN')} (PAID)
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span className="font-medium text-slate-800">
                    {otpVerificationModal.order.items?.length || 1} items
                  </span>
                </div>
              </div>

              {/* Submit Handover Button */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const expected = (
                      otpVerificationModal.order.pickupOtp ||
                      otpVerificationModal.order.pickup_otp ||
                      otpVerificationModal.order.customer?.pickupOtp ||
                      '4821'
                    )
                      .toString()
                      .trim();
                    const entered = otpVerificationModal.enteredOtp.trim();

                    if (!entered || entered.length < 4) {
                      setOtpVerificationModal((prev) => ({
                        ...prev,
                        error: 'Please enter the complete 4-digit OTP.'
                      }));
                      return;
                    }

                    if (entered !== expected) {
                      setOtpVerificationModal((prev) => ({
                        ...prev,
                        error: `❌ OTP Mismatch! "${entered}" is incorrect. Ask customer to re-check their screen.`
                      }));
                      return;
                    }

                    // OTP Verified! Complete order
                    updateOrderStatus(otpVerificationModal.order.id, 'Completed');
                    setOtpVerificationModal({
                      isOpen: false,
                      order: null,
                      enteredOtp: '',
                      error: ''
                    });
                  }}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify OTP & Mark Order Collected</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setOtpVerificationModal({ isOpen: false, order: null, enteredOtp: '', error: '' })
                  }
                  className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <h3 className="font-extrabold text-base">
                {editingProductId ? 'Edit Product Details' : 'Add New Product to Catalog'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              {/* Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Prestige Deluxe 3-Burner Gas Stove"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-medium"
                />
              </div>

              {/* Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. 50% OFF, Best Seller, Direct Farm"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Price, MRP, Stock & Per-Customer Limit */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="499"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Original MRP (₹)</label>
                  <input
                    type="number"
                    placeholder="650"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    placeholder="10"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1" title="0 means unlimited; >0 restricts purchase per mobile number for special offers">
                    Max / User Limit
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0 = No limit"
                    value={formData.maxPerCustomer}
                    onChange={(e) => setFormData({ ...formData, maxPerCustomer: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-bold text-rose-600"
                  />
                </div>
              </div>

              {/* Multi-Image Upload & Management */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-bold text-slate-800 text-sm">Product Photos ({formData.images?.length || 0})</label>
                    <p className="text-xs text-slate-500">
                      Upload multiple photos from your device, paste URLs, or pick presets. The 1st photo is used as the cover.
                    </p>
                  </div>
                  {formData.images?.length > 0 && (
                    <span className="text-[11px] font-bold px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full">
                      ★ 1st photo is Main Cover
                    </span>
                  )}
                </div>

                {/* Upload Buttons & URL Input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {/* File Upload Button */}
                  <label className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white border-2 border-dashed border-amber-300 hover:border-amber-500 hover:bg-amber-50/50 rounded-xl cursor-pointer transition text-amber-800 font-bold text-xs shadow-xs">
                    <Upload className="w-4 h-4 text-amber-600" />
                    <span>Upload from Device (Multiple)</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageFilesUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Add via URL */}
                  <div className="flex gap-1.5">
                    <input
                      type="url"
                      placeholder="Or paste image URL..."
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddUrlImage();
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleAddUrlImage}
                      disabled={!customUrlInput.trim()}
                      className="px-3 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition shrink-0"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Preset Chips */}
                <div className="pt-1">
                  <span className="text-[11px] text-slate-500 font-semibold block mb-1">
                    Quick demo photos (click to add):
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                    {IMAGE_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handlePresetAdd(p.url)}
                        className="px-2 py-1 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-700 rounded-lg text-[10px] font-medium transition flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3 text-amber-600" />
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Thumbnails preview & reorder list */}
                {formData.images && formData.images.length > 0 ? (
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-700 block mb-2">
                      Attached Photos Preview & Order:
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                      {formData.images.map((imgUrl, idx) => {
                        const isCover = idx === 0;
                        return (
                          <div
                            key={idx}
                            className={`group relative rounded-xl overflow-hidden border-2 bg-slate-100 aspect-square shadow-xs transition ${
                              isCover ? 'border-amber-500 ring-2 ring-amber-400/30' : 'border-slate-200 hover:border-slate-400'
                            }`}
                          >
                            <img
                              src={imgUrl}
                              alt={`Product upload ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=400&q=80';
                              }}
                            />

                            {/* Badge */}
                            {isCover ? (
                              <span className="absolute top-1 left-1 bg-amber-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5 fill-white" />
                                Cover
                              </span>
                            ) : (
                              <span className="absolute top-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                                #{idx + 1}
                              </span>
                            )}

                            {/* Action Buttons overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                              <div className="flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(idx)}
                                  title="Delete photo"
                                  className="w-6 h-6 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition shadow-sm"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {!isCover && (
                                <button
                                  type="button"
                                  onClick={() => handleSetCoverImage(idx)}
                                  title="Set as main cover photo"
                                  className="w-full py-1 bg-white/95 hover:bg-white text-slate-800 text-[10px] font-bold rounded shadow-xs flex items-center justify-center gap-1 transition"
                                >
                                  <Star className="w-3 h-3 text-amber-500" />
                                  Make Cover
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 border border-dashed border-red-300 rounded-xl bg-red-50/50">
                    <AlertTriangle className="w-5 h-5 text-red-500 mx-auto mb-1" />
                    <p className="text-xs font-bold text-red-700">No photos attached yet</p>
                    <p className="text-[11px] text-red-600">Please upload at least 1 photo for this product.</p>
                  </div>
                )}
              </div>

              {/* Dynamic Category Specific Inputs */}
              {formData.category === 'Kitchen Appliances' ? (
                <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 space-y-3">
                  <h4 className="font-bold text-amber-950 uppercase tracking-wider text-[11px]">
                    🍳 Kitchen Appliance Technical Specs:
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Power / Motor Wattage</label>
                      <input
                        type="text"
                        placeholder="e.g. 750W Vega Motor"
                        value={formData.power}
                        onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Warranty Term</label>
                      <input
                        type="text"
                        placeholder="e.g. 2 Years Brand Warranty"
                        value={formData.warranty}
                        onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">In The Box Items</label>
                    <input
                      type="text"
                      placeholder="e.g. 1 Motor Unit, 3 Stainless Steel Jars, Manual"
                      value={formData.boxContents}
                      onChange={(e) => setFormData({ ...formData, boxContents: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-amber-950 uppercase tracking-wider text-[11px]">
                      🥜 Dry Fruit Quality & Packaging Specs:
                    </h4>
                    <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-amber-900">
                      <input
                        type="checkbox"
                        checked={formData.hasVariants}
                        onChange={(e) => setFormData({ ...formData, hasVariants: e.target.checked })}
                        className="rounded accent-amber-600 w-4 h-4 cursor-pointer"
                      />
                      <span>Enable Weight Variants (100g/250g/500g/1kg)</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Quality Grade</label>
                      <input
                        type="text"
                        placeholder="e.g. Grade W-240 Jumbo Whole"
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Default Pack Weight Note</label>
                      <input
                        type="text"
                        placeholder="e.g. 500g Resealable Pouch"
                        value={formData.packWeight}
                        onChange={(e) => setFormData({ ...formData, packWeight: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  {/* Weight Variant Price Matrix */}
                  {formData.hasVariants && (
                    <div className="pt-2 border-t border-amber-200/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-950">
                          Configure Pack Variant Prices:
                        </span>
                        <span className="text-[10px] text-amber-700 font-medium">
                          500g is used as master display price
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {formData.variants?.map((v) => (
                          <div
                            key={v.weight}
                            className={`p-2.5 rounded-xl border bg-white ${
                              v.isDefault ? 'border-amber-400 ring-1 ring-amber-400/30' : 'border-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-extrabold text-slate-800">{v.weight}</span>
                              {v.isDefault && (
                                <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="space-y-1">
                              <div>
                                <label className="text-[9px] text-slate-500 font-bold block">Selling Price (₹)</label>
                                <input
                                  type="number"
                                  value={v.price}
                                  onChange={(e) => handleUpdateVariantPrice(v.weight, 'price', e.target.value)}
                                  className="w-full px-1.5 py-1 text-xs font-bold border border-slate-200 rounded bg-slate-50 focus:bg-white"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] text-slate-400 font-medium block">MRP (₹)</label>
                                <input
                                  type="number"
                                  value={v.mrp}
                                  onChange={(e) => handleUpdateVariantPrice(v.weight, 'mrp', e.target.value)}
                                  className="w-full px-1.5 py-1 text-[11px] border border-slate-200 rounded bg-slate-50 focus:bg-white"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Description</label>
                <textarea
                  rows={2}
                  placeholder="Detailed description of features, benefits, and quality..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-md shadow-amber-600/30"
                >
                  {editingProductId ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
