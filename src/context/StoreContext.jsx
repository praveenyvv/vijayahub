import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, VIZAG_STORE_INFO } from '../data/initialData';

const StoreContext = createContext();

const PRODUCTS_STORAGE_KEY = 'vijayahub_products_v1';
const ORDERS_STORAGE_KEY = 'vijayahub_orders_v1';
const CART_STORAGE_KEY = 'vijayahub_cart_v1';

export function StoreProvider({ children }) {
  // 1. Products state (persisted)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch (e) {
      return INITIAL_PRODUCTS;
    }
  });

  // 2. Orders state (persisted)
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch (e) {
      return INITIAL_ORDERS;
    }
  });

  // 3. Cart state (persisted)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // 4. UI Modals and Navigation states
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // --- Cart Actions ---
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stock) {
          alert(`Only ${product.stock} units available in stock.`);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        if (quantity > product.stock) {
          alert(`Only ${product.stock} units available in stock.`);
          return prevCart;
        }
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const product = products.find((p) => p.id === productId);
    if (product && newQuantity > product.stock) {
      alert(`Cannot add more than ${product.stock} items (stock limit reached).`);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // --- Order & Inventory Actions ---
  const placeOrder = (orderData) => {
    const newOrderId = `VH-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullOrder = {
      id: newOrderId,
      date: new Date().toISOString(),
      status: 'Placed',
      paymentStatus: 'PAID',
      ...orderData
    };

    // 1. Deduct stock from products automatically
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const purchasedItem = orderData.items.find((item) => item.id === p.id);
        if (purchasedItem) {
          const remainingStock = Math.max(0, p.stock - purchasedItem.quantity);
          return { ...p, stock: remainingStock };
        }
        return p;
      })
    );

    // 2. Add to orders list at the top
    setOrders((prev) => [fullOrder, ...prev]);

    // 3. Clear cart and set completed order for feedback
    clearCart();
    setIsCheckoutOpen(false);
    setCompletedOrder(fullOrder);

    return fullOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (completedOrder && completedOrder.id === orderId) {
      setCompletedOrder((prev) => ({ ...prev, status: newStatus }));
    }
  };

  // --- Admin Product Actions ---
  const addProduct = (newProduct) => {
    const id = `prod-custom-${Date.now()}`;
    const productWithDefaults = {
      id,
      rating: 5.0,
      reviewsCount: 1,
      badge: 'New Arrival',
      specs: {},
      ...newProduct
    };
    setProducts((prev) => [productWithDefaults, ...prev]);
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const resetToDemoData = () => {
    if (window.confirm('Reset all products and orders to initial demo state?')) {
      setProducts(INITIAL_PRODUCTS);
      setOrders(INITIAL_ORDERS);
      setCart([]);
      localStorage.removeItem(PRODUCTS_STORAGE_KEY);
      localStorage.removeItem(ORDERS_STORAGE_KEY);
      localStorage.removeItem(CART_STORAGE_KEY);
      alert('Reset to demo state successful!');
    }
  };

  // Cart calculations
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        cart,
        storeInfo: VIZAG_STORE_INFO,
        cartItemCount,
        cartSubtotal,
        // UI states
        isAdminMode,
        setIsAdminMode,
        isCartOpen,
        setIsCartOpen,
        selectedProduct,
        setSelectedProduct,
        isCheckoutOpen,
        setIsCheckoutOpen,
        completedOrder,
        setCompletedOrder,
        invoiceOrder,
        setInvoiceOrder,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        // Action methods
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        placeOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        resetToDemoData
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
