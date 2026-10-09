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
  Eye
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
    setIsAdminMode
  } = useStore();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products', 'settings'
  const [orderFilter, setOrderFilter] = useState('All');
  const [productSearch, setProductSearch] = useState('');

  // Add / Edit Product Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Kitchen Appliances',
    price: '',
    mrp: '',
    stock: '',
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
    setFormData({
      title: '',
      category: 'Kitchen Appliances',
      price: '',
      mrp: '',
      stock: '10',
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
    setFormData({
      title: product.title,
      category: product.category,
      price: product.price,
      mrp: product.mrp,
      stock: product.stock,
      image: product.image,
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

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const productPayload = {
      title: formData.title,
      category: formData.category,
      price: Number(formData.price),
      mrp: Number(formData.mrp || formData.price),
      stock: Number(formData.stock),
      image: formData.image,
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

  const filteredOrders =
    orderFilter === 'All'
      ? orders
      : orders.filter((o) => o.status.toLowerCase() === orderFilter.toLowerCase());

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
              onClick={resetToDemoData}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 border border-slate-200"
              title="Reset products and orders to initial demo state"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>

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
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'settings'
                ? 'border-amber-600 text-amber-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Vizag Store & Delivery Rules</span>
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
                {['All', 'Placed', 'Packed', 'Completed'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setOrderFilter(filter)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
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

                        {/* Customer */}
                        <td className="py-3.5 px-3">
                          <p className="font-bold text-slate-900">{order.customer.name}</p>
                          <p className="text-slate-500 text-[11px]">📞 {order.customer.phone}</p>
                        </td>

                        {/* Fulfillment */}
                        <td className="py-3.5 px-3">
                          {order.fulfillmentType === 'pickup' ? (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-full text-[10px] border border-amber-200">
                              <Store className="w-3 h-3 text-amber-600" /> Store Pickup
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-800 font-bold px-2 py-0.5 rounded-full text-[10px] border border-orange-200">
                              <Truck className="w-3 h-3 text-orange-600" /> 20KM ({order.customer.pincode})
                            </span>
                          )}
                        </td>

                        {/* Items */}
                        <td className="py-3.5 px-3">
                          <div className="space-y-0.5 max-w-xs">
                            {order.items.map((it, idx) => (
                              <p key={idx} className="text-slate-700 text-[11px]">
                                <span className="font-bold text-slate-900">{it.quantity}x</span> {it.title}
                              </p>
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

                        {/* Order Status Controller */}
                        <td className="py-3.5 px-3">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 focus:ring-1 focus:ring-amber-500 focus:outline-hidden"
                          >
                            <option value="Placed">Placed</option>
                            <option value="Packed">Packed</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Ready for Pickup">Ready for Pickup</option>
                            <option value="Completed">Completed / Delivered</option>
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
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-slate-900 line-clamp-1">{product.title}</p>
                              <p className="text-[11px] text-slate-400 line-clamp-1">
                                {product.specs?.power || product.specs?.packWeight || 'Vizag Stock'}
                              </p>
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

        {/* TAB 3: STORE & DELIVERY SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Visakhapatnam Local Delivery & Pickup Rules
              </h3>
              <p className="text-xs text-slate-500">
                These rules govern your 20 KM radius fulfillment and store pickup options.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pickup Location Settings */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-amber-600" />
                  <h4 className="font-bold text-sm text-slate-900">Self-Pickup Hub Details</h4>
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

              {/* Delivery Radius Settings */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-orange-600" />
                  <h4 className="font-bold text-sm text-slate-900">Local Delivery Model</h4>
                </div>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <p><strong>Delivery Radius:</strong> {storeInfo.deliveryRadiusKm} KM from Dwaraka Nagar</p>
                  <p><strong>Standard Local Fee:</strong> ₹{storeInfo.localDeliveryFlatFee}</p>
                  <p><strong>Free Delivery Threshold:</strong> Free on orders &ge; ₹{storeInfo.freeDeliveryThreshold}</p>
                  <p><strong>Pincodes Covered:</strong> 530001 to 530052 (Vizag Urban & Suburbs)</p>
                  <p className="text-slate-500 text-[11px] pt-1">
                    Orders are delivered within 2–4 hours using local staff or on-demand Porter/Rapido bikes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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
                    <option value="Kitchen Appliances">Kitchen Appliances</option>
                    <option value="Fresh Dry Fruits">Fresh Dry Fruits</option>
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

              {/* Price, MRP, Stock */}
              <div className="grid grid-cols-3 gap-3">
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
                  <label className="block font-bold text-slate-700 mb-1">Initial Stock Units *</label>
                  <input
                    type="number"
                    required
                    placeholder="10"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-bold"
                  />
                </div>
              </div>

              {/* Image URL & Preset Selection */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Photo URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-mono text-[11px] mb-2"
                />
                
                {/* Photo Presets for quick selection */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-semibold">Or pick a demo image:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {IMAGE_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: p.url })}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-medium"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
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
                  <h4 className="font-bold text-amber-950 uppercase tracking-wider text-[11px]">
                    🥜 Dry Fruit Quality & Packaging Specs:
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Net Weight Variant</label>
                      <input
                        type="text"
                        placeholder="e.g. 500 Grams Resealable Pouch"
                        value={formData.packWeight}
                        onChange={(e) => setFormData({ ...formData, packWeight: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Quality Grade</label>
                      <input
                        type="text"
                        placeholder="e.g. Grade W-240 Jumbo Whole"
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
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
