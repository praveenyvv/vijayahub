import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, VIZAG_STORE_INFO } from '../data/initialData';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const StoreContext = createContext();

const PRODUCTS_STORAGE_KEY = 'vijayahub_products_v2';
const ORDERS_STORAGE_KEY = 'vijayahub_orders_v1';
const CART_STORAGE_KEY = 'vijayahub_cart_v2';
const USER_STORAGE_KEY = 'vijayahub_user_v1';

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

  // 4. User profile state (persisted)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // 5. Custom Categories state (persisted)
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('vijayahub_categories_v1');
      return saved ? JSON.parse(saved) : ['Kitchen Appliances', 'Dry Fruits & Nuts'];
    } catch (e) {
      return ['Kitchen Appliances', 'Dry Fruits & Nuts'];
    }
  });

  // 6. Feedbacks & Customer Support tickets (persisted locally + cloud)
  const [feedbacks, setFeedbacks] = useState(() => {
    try {
      const saved = localStorage.getItem('vijayahub_feedbacks_v1');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Safe LocalStorage wrapper to prevent QuotaExceededError or private browsing exceptions
  const safeSetStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`localStorage set warning for ${key}:`, err);
      // If products storage exceeds quota, gracefully strip heavy data URLs and retry
      if (key === PRODUCTS_STORAGE_KEY && Array.isArray(value)) {
        try {
          const lightweight = value.map((p) => ({
            ...p,
            images: (p.images || []).filter((img) => !img?.startsWith('data:')).slice(0, 2),
            image: p.image?.startsWith('data:') ? '' : p.image
          }));
          localStorage.setItem(key, JSON.stringify(lightweight));
        } catch {
          // ignore fallback
        }
      }
    }
  };

  // Sync feedbacks to localStorage safely
  useEffect(() => {
    safeSetStorage('vijayahub_feedbacks_v1', feedbacks);
  }, [feedbacks]);

  // 7. UI Modals and Navigation states
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isCloudConnected, setIsCloudConnected] = useState(isSupabaseConfigured);
  const [isCloudLoaded, setIsCloudLoaded] = useState(!isSupabaseConfigured);
  const [newOrderAlert, setNewOrderAlert] = useState(null);

  // Sync categories to localStorage
  useEffect(() => {
    safeSetStorage('vijayahub_categories_v1', categories);
  }, [categories]);

  // Sync to localStorage safely
  useEffect(() => {
    safeSetStorage(PRODUCTS_STORAGE_KEY, products);
  }, [products]);

  useEffect(() => {
    safeSetStorage(ORDERS_STORAGE_KEY, orders);
  }, [orders]);

  useEffect(() => {
    safeSetStorage(CART_STORAGE_KEY, cart);
  }, [cart]);

  useEffect(() => {
    if (currentUser) {
      safeSetStorage(USER_STORAGE_KEY, currentUser);
    } else {
      try {
        localStorage.removeItem(USER_STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }, [currentUser]);

  // --- Real-Time Supabase Cloud Synchronization ---
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsCloudLoaded(true);
      return;
    }

    // 1. Initial fetch of products and orders from Supabase (Concurrent Parallel Fetch)
    const fetchCloudData = async () => {
      try {
        const [productsRes, ordersRes, feedbacksRes] = await Promise.all([
          supabase.from('products').select('*').order('created_at', { ascending: false }),
          supabase.from('orders').select('*').order('created_at', { ascending: false }),
          supabase.from('feedbacks').select('*').order('created_at', { ascending: false })
        ]);

        const cloudProducts = productsRes.data;
        const cloudOrders = ordersRes.data;
        const cloudFeedbacks = feedbacksRes.data;

        if (cloudProducts && cloudProducts.length > 0) {
          // Normalize snake_case columns if present
          const formattedProducts = cloudProducts.map((p) => ({
            ...p,
            hasVariants: p.has_variants ?? p.hasVariants,
            reviewsCount: p.reviews_count ?? p.reviewsCount
          }));
          setProducts(formattedProducts);
        }

        if (cloudOrders && cloudOrders.length > 0) {
          const now = new Date();
          const formattedOrders = cloudOrders.map((o) => {
            // Instant expiry check on load so past orders are never displayed as active
            const isExpired =
              o.expires_at &&
              new Date(o.expires_at) < now &&
              o.status !== 'Completed' &&
              o.status !== 'Cancelled';

            const effectiveStatus = isExpired ? 'Cancelled' : o.status;

            if (isExpired && isSupabaseConfigured && supabase) {
              supabase
                .from('orders')
                .update({
                  status: 'Cancelled',
                  cancellation_reason: 'Auto-cancelled: Store pickup not collected within 24 hours',
                  cancelled_at: now.toISOString()
                })
                .eq('id', o.id)
                .then();
            }

            return {
              ...o,
              itemSubtotal: o.item_subtotal ?? o.itemSubtotal,
              deliveryFee: o.delivery_fee ?? o.deliveryFee,
              pickupSlot: o.pickup_slot ?? o.pickupSlot,
              fulfillmentType: o.fulfillment_type ?? o.fulfillmentType,
              status: effectiveStatus,
              paymentStatus: o.payment_status ?? o.paymentStatus,
              paymentMethod: o.payment_method ?? o.paymentMethod,
              upiRefNumber: o.upi_ref_number ?? o.upiRefNumber,
              pickupOtp: o.pickup_otp ?? o.customer?.pickupOtp ?? o.pickupOtp ?? '4821',
              date: o.date || o.created_at || new Date().toISOString(),
              expiresAt: o.expires_at ?? o.expiresAt,
              cancellationReason: isExpired
                ? 'Auto-cancelled: Store pickup not collected within 24 hours'
                : (o.cancellation_reason ?? o.cancellationReason),
              cancelledAt: isExpired ? now.toISOString() : (o.cancelled_at ?? o.cancelledAt)
            };
          });

          // Merge safely: preserve any locally placed orders not yet in cloud so they never disappear
          setOrders((prev) => {
            const cloudIds = new Set(formattedOrders.map((co) => co.id));
            const localOnly = prev.filter((lo) => !cloudIds.has(lo.id));
            return [...formattedOrders, ...localOnly];
          });
        }

        if (cloudFeedbacks && cloudFeedbacks.length > 0) {
          setFeedbacks(cloudFeedbacks);
        }

        setIsCloudConnected(true);
      } catch (err) {
        console.warn('Supabase initial fetch note:', err);
      } finally {
        setIsCloudLoaded(true);
      }
    };

    fetchCloudData();

    // 2. Real-time Subscription to Live Orders & Products
    const ordersChannel = supabase
      .channel('realtime:orders')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        (payload) => {
          const newOrder = payload.new;
          const formatted = {
            ...newOrder,
            itemSubtotal: newOrder.item_subtotal ?? newOrder.itemSubtotal,
            deliveryFee: newOrder.delivery_fee ?? newOrder.deliveryFee,
            pickupSlot: newOrder.pickup_slot ?? newOrder.pickupSlot,
            fulfillmentType: newOrder.fulfillment_type ?? newOrder.fulfillmentType,
            paymentStatus: newOrder.payment_status ?? newOrder.paymentStatus,
            paymentMethod: newOrder.payment_method ?? newOrder.paymentMethod,
            upiRefNumber: newOrder.upi_ref_number ?? newOrder.upiRefNumber,
            pickupOtp: newOrder.pickup_otp ?? newOrder.customer?.pickupOtp ?? newOrder.pickupOtp ?? '4821',
            date: newOrder.date || newOrder.created_at || new Date().toISOString(),
            expiresAt: newOrder.expires_at ?? newOrder.expiresAt
          };

          setOrders((prev) => [formatted, ...prev.filter((o) => o.id !== formatted.id)]);
          setNewOrderAlert(formatted);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          const updated = payload.new;
          setOrders((prev) =>
            prev.map((o) =>
              o.id === updated.id
                ? {
                    ...o,
                    ...updated,
                    status: updated.status,
                    paymentStatus: updated.payment_status ?? updated.paymentStatus
                  }
                : o
            )
          );
        }
      )
      .subscribe();

    const productsChannel = supabase
      .channel('realtime:products')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProducts((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setProducts((prev) =>
              prev.map((p) => (p.id === payload.new.id ? { ...p, ...payload.new } : p))
            );
          } else if (payload.eventType === 'DELETE') {
            setProducts((prev) => prev.filter((p) => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(productsChannel);
    };
  }, []);

  // --- Cart Actions (Supports Multi-Weight Variants) ---
  const addToCart = (product, quantity = 1, selectedVariant = null) => {
    // If no variant passed but product has variants, pick default or first variant
    const variant =
      selectedVariant ||
      (product.variants && product.variants.length > 0
        ? product.variants.find((v) => v.isDefault) || product.variants[0]
        : null);

    const cartItemId = variant ? `${product.id}-${variant.weight}` : product.id;
    const itemPrice = variant ? variant.price : product.price;
    const itemMrp = variant ? (variant.mrp || product.mrp) : product.mrp;
    const itemWeight = variant ? (variant.label || variant.weight) : (product.specs?.packWeight || null);

    setCart((prevCart) => {
      const existing = prevCart.find((item) => (item.cartItemId || item.id) === cartItemId);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stock) {
          alert(`Only ${product.stock} units available in stock.`);
          return prevCart;
        }
        return prevCart.map((item) =>
          (item.cartItemId || item.id) === cartItemId ? { ...item, quantity: newQty } : item
        );
      } else {
        if (quantity > product.stock) {
          alert(`Only ${product.stock} units available in stock.`);
          return prevCart;
        }
        return [
          ...prevCart,
          {
            ...product,
            cartItemId,
            selectedVariant: variant,
            selectedWeight: itemWeight,
            price: itemPrice,
            mrp: itemMrp,
            quantity
          }
        ];
      }
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => (item.cartItemId || item.id) !== cartItemId));
  };

  const updateCartQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    const item = cart.find((i) => (i.cartItemId || i.id) === cartItemId);
    const product = item ? products.find((p) => p.id === item.id) : null;
    if (product && newQuantity > product.stock) {
      alert(`Cannot add more than ${product.stock} items (stock limit reached).`);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        (item.cartItemId || item.id) === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // --- Auto-Cancellation & Restock Effect for 24-Hour Expiry ---
  useEffect(() => {
    const checkAndCancelExpiredOrders = () => {
      const now = new Date();
      let hasChanges = false;
      const restockMap = {}; // productId -> quantity to restore

      setOrders((prevOrders) => {
        const updatedOrders = prevOrders.map((order) => {
          // If already completed or cancelled, skip
          if (order.status === 'Completed' || order.status === 'Cancelled') {
            return order;
          }

          // Check if expired (24 hours passed)
          if (order.expiresAt && new Date(order.expiresAt) < now) {
            hasChanges = true;
            // Record items to restock
            order.items?.forEach((item) => {
              restockMap[item.id] = (restockMap[item.id] || 0) + item.quantity;
            });

            // Persist cancellation in Supabase cloud database
            if (isSupabaseConfigured && supabase) {
              supabase
                .from('orders')
                .update({
                  status: 'Cancelled',
                  cancellation_reason: 'Auto-cancelled: Store pickup not collected within 24 hours',
                  cancelled_at: now.toISOString()
                })
                .eq('id', order.id)
                .then();
            }

            return {
              ...order,
              status: 'Cancelled',
              cancellationReason: 'Auto-cancelled: Store pickup not collected within 24 hours',
              cancelledAt: now.toISOString()
            };
          }

          return order;
        });

        return hasChanges ? updatedOrders : prevOrders;
      });

      // If any items need to be restocked, restore them into products inventory
      if (Object.keys(restockMap).length > 0) {
        setProducts((prevProducts) =>
          prevProducts.map((p) => {
            if (restockMap[p.id]) {
              return { ...p, stock: p.stock + restockMap[p.id] };
            }
            return p;
          })
        );
      }
    };

    // Run check on mount and every 30 seconds
    checkAndCancelExpiredOrders();
    const interval = setInterval(checkAndCancelExpiredOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  // --- Order & Inventory Actions ---
  const placeOrder = async (orderData) => {
    const newOrderId = `VH-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    // Generate secure 4-digit Pickup Verification OTP
    const pickupOtp = `${Math.floor(1000 + Math.random() * 9000)}`;

    const fullOrder = {
      id: newOrderId,
      date: now.toISOString(),
      expiresAt: expiresAt,
      fulfillmentType: 'pickup', // Strictly store pickup only
      status: 'Placed',
      paymentStatus: 'PAID',
      pickupOtp: pickupOtp, // Unique OTP required for physical pickup handover
      ...orderData
    };

    // 1. Deduct stock from products automatically upon order placement
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const totalPurchased = orderData.items
          ?.filter((item) => item.id === p.id)
          .reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;

        if (totalPurchased > 0) {
          const remainingStock = Math.max(0, p.stock - totalPurchased);
          // If Supabase is connected, update stock in cloud
          if (isSupabaseConfigured && supabase) {
            supabase.from('products').update({ stock: remainingStock }).eq('id', p.id).then();
          }
          return { ...p, stock: remainingStock };
        }
        return p;
      })
    );

    // 2. Add to orders list at the top
    setOrders((prev) => [fullOrder, ...prev.filter((o) => o.id !== fullOrder.id)]);

    // 3. Clear cart and set completed order for feedback
    clearCart();
    setIsCheckoutOpen(false);
    setCompletedOrder(fullOrder);

    // 4. Save order to Supabase cloud if connected
    if (isSupabaseConfigured && supabase) {
      try {
        const orderPayload = {
          id: fullOrder.id,
          customer: {
            ...fullOrder.customer,
            pickupOtp: fullOrder.pickupOtp
          },
          items: fullOrder.items,
          item_subtotal: fullOrder.itemSubtotal,
          delivery_fee: fullOrder.deliveryFee || 0,
          total: fullOrder.total,
          pickup_slot: fullOrder.pickupSlot,
          fulfillment_type: fullOrder.fulfillmentType,
          status: fullOrder.status,
          payment_status: fullOrder.paymentStatus,
          payment_method: fullOrder.paymentMethod,
          upi_ref_number: fullOrder.upiRefNumber,
          notes: fullOrder.notes,
          expires_at: fullOrder.expiresAt
        };

        // Attempt insert with pickup_otp column if it exists in DB table
        const { error: insertError } = await supabase.from('orders').insert([
          {
            ...orderPayload,
            pickup_otp: fullOrder.pickupOtp
          }
        ]);

        if (insertError) {
          console.warn('Supabase insert with pickup_otp column note:', insertError.message);
          // If pickup_otp column does not exist in schema, insert safe payload (pickupOtp is preserved in customer JSONB)
          const { error: fallbackError } = await supabase.from('orders').insert([orderPayload]);
          if (fallbackError) {
            console.error('Supabase fallback order insert error:', fallbackError);
          } else {
            console.log('Order successfully saved to Supabase (safe JSONB payload)');
          }
        } else {
          console.log('Order successfully saved to Supabase (with pickup_otp column)');
        }
      } catch (err) {
        console.warn('Supabase order insert note:', err);
      }
    }

    return fullOrder;
  };

  // Manual or Admin Cancel & Restock
  const cancelOrderAndRestock = (orderId, reason = 'Cancelled by Store Admin') => {
    const orderToCancel = orders.find((o) => o.id === orderId);
    if (!orderToCancel || orderToCancel.status === 'Cancelled') return;

    // Restore stock
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const totalReturned = orderToCancel.items
          ?.filter((it) => it.id === p.id)
          .reduce((sum, it) => sum + (it.quantity || 1), 0) || 0;

        if (totalReturned > 0) {
          const newStock = p.stock + totalReturned;
          if (isSupabaseConfigured && supabase) {
            supabase.from('products').update({ stock: newStock }).eq('id', p.id).then();
          }
          return { ...p, stock: newStock };
        }
        return p;
      })
    );

    // Update order status
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'Cancelled',
              cancellationReason: reason,
              cancelledAt: new Date().toISOString()
            }
          : o
      )
    );

    if (isSupabaseConfigured && supabase) {
      supabase
        .from('orders')
        .update({
          status: 'Cancelled',
          cancellation_reason: reason,
          cancelled_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .then();
    }

    if (completedOrder && completedOrder.id === orderId) {
      setCompletedOrder((prev) => ({
        ...prev,
        status: 'Cancelled',
        cancellationReason: reason
      }));
    }
  };

  // Order Status Progression Ranking: Strictly Forward-Only
  // 1 (Placed) -> 2 (Packed) -> 3 (Ready for Pickup) -> 4 (Completed)
  const STATUS_RANK = {
    Placed: 1,
    Packed: 2,
    'Ready for Pickup': 3,
    Completed: 4
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const currentOrder = orders.find((o) => o.id === orderId);
    if (!currentOrder) return;

    if (newStatus === 'Cancelled') {
      cancelOrderAndRestock(orderId, 'Cancelled via store manager / customer helpline');
      return;
    }

    // Prevent moving backwards once packed or ready for pickup
    const currentRank = STATUS_RANK[currentOrder.status] || 0;
    const newRank = STATUS_RANK[newStatus] || 0;

    if (newRank < currentRank) {
      alert(
        `Cannot move status backwards! Order #${orderId} is already '${currentOrder.status}'. Orders only move forward towards pickup completion.`
      );
      return;
    }

    // Auto-prompt WhatsApp notification when order is Ready for Pickup
    if (newStatus === 'Ready for Pickup') {
      const custPhone = currentOrder.customer?.phone?.replace(/\D/g, '');
      const custName = currentOrder.customer?.name || 'Customer';
      const otpCode = currentOrder.pickupOtp || '1234';
      const hubAddress = 'VijayaHub Central Hub, Dwaraka Nagar, Visakhapatnam';
      const waMsg = `Hello ${custName}! 📦 Your VijayaHub order #${currentOrder.id} is PACKED & READY FOR PICKUP at ${hubAddress}.\n\n🔑 Your Pickup Verification OTP is: *${otpCode}*.\n\nPlease show this OTP at the counter within your 24-hr window to collect your parcel. Thank you!`;
      
      const shouldSend = window.confirm(
        `🔔 Order #${orderId} is now READY FOR PICKUP!\n\nWould you like to open WhatsApp to send the pickup ready message & OTP to ${custName} (${currentOrder.customer?.phone})?`
      );
      if (shouldSend && custPhone) {
        window.open(`https://wa.me/91${custPhone}?text=${encodeURIComponent(waMsg)}`, '_blank');
      }
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    if (isSupabaseConfigured && supabase) {
      supabase.from('orders').update({ status: newStatus }).eq('id', orderId).then();
    }

    if (completedOrder && completedOrder.id === orderId) {
      setCompletedOrder((prev) => ({ ...prev, status: newStatus }));
    }
  };

  // Regenerate fresh OTP for an order (e.g. if lost or requested resend)
  const regenerateOrderOtp = (orderId) => {
    const freshOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            pickupOtp: freshOtp,
            customer: {
              ...o.customer,
              pickupOtp: freshOtp
            }
          };
        }
        return o;
      })
    );

    if (completedOrder && completedOrder.id === orderId) {
      setCompletedOrder((prev) => ({
        ...prev,
        pickupOtp: freshOtp,
        customer: {
          ...prev.customer,
          pickupOtp: freshOtp
        }
      }));
    }

    if (isSupabaseConfigured && supabase) {
      supabase
        .from('orders')
        .update({
          pickup_otp: freshOtp,
          customer: {
            ...orders.find((o) => o.id === orderId)?.customer,
            pickupOtp: freshOtp
          }
        })
        .eq('id', orderId)
        .then();
    }

    return freshOtp;
  };

  // Submit Customer Feedback or Support Ticket
  const submitFeedback = async (feedbackData) => {
    const newFeedback = {
      id: `FB-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_name: feedbackData.customerName,
      customer_phone: feedbackData.customerPhone,
      type: feedbackData.type,
      rating: feedbackData.rating || 5,
      order_id: feedbackData.orderId || null,
      message: feedbackData.message,
      status: 'Open',
      created_at: new Date().toISOString()
    };

    setFeedbacks((prev) => [newFeedback, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('feedbacks').insert([newFeedback]);
      } catch (err) {
        console.warn('Supabase feedback insert note:', err);
      }
    }

    return newFeedback;
  };

  // Seed Default Catalog to Supabase Cloud so dummy products are permanently saved
  const seedDefaultCatalog = async () => {
    if (!isSupabaseConfigured || !supabase) {
      alert('Supabase is not configured yet. Please check your credentials.');
      return;
    }

    try {
      const inserts = INITIAL_PRODUCTS.map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        price: p.price,
        mrp: p.mrp,
        stock: p.stock,
        max_per_customer: p.maxPerCustomer || 0,
        has_variants: p.hasVariants || false,
        variants: p.variants || [],
        image: p.image,
        images: p.images || [p.image],
        description: p.description,
        specs: p.specs || {},
        badge: p.badge || null,
        rating: p.rating || 4.8,
        reviews_count: p.reviewsCount || 25
      }));

      const { error } = await supabase.from('products').upsert(inserts);
      if (error) throw error;

      setProducts(INITIAL_PRODUCTS);
      alert('✅ Default catalog successfully seeded to Supabase Cloud!');
    } catch (err) {
      console.error('Error seeding catalog:', err);
      alert('Failed to seed catalog: ' + err.message);
    }
  };

  // --- Admin Product Actions ---
  const addProduct = async (newProduct) => {
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

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('products').insert([
          {
            id: productWithDefaults.id,
            title: productWithDefaults.title,
            category: productWithDefaults.category,
            price: productWithDefaults.price,
            mrp: productWithDefaults.mrp,
            stock: productWithDefaults.stock,
            has_variants: productWithDefaults.hasVariants,
            variants: productWithDefaults.variants,
            image: productWithDefaults.image,
            images: productWithDefaults.images,
            description: productWithDefaults.description,
            specs: productWithDefaults.specs,
            badge: productWithDefaults.badge
          }
        ]);
      } catch (err) {
        console.warn('Supabase product insert note:', err);
      }
    }
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );

    if (isSupabaseConfigured && supabase) {
      const dbPayload = { ...updatedFields };
      if ('hasVariants' in updatedFields) dbPayload.has_variants = updatedFields.hasVariants;
      if ('reviewsCount' in updatedFields) dbPayload.reviews_count = updatedFields.reviewsCount;
      delete dbPayload.hasVariants;
      delete dbPayload.reviewsCount;

      supabase.from('products').update(dbPayload).eq('id', id).then();
    }
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.id !== id));

    if (isSupabaseConfigured && supabase) {
      supabase.from('products').delete().eq('id', id).then();
    }
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
        currentUser,
        setCurrentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        completedOrder,
        setCompletedOrder,
        invoiceOrder,
        setInvoiceOrder,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        categories,
        setCategories,
        feedbacks,
        setFeedbacks,
        isFeedbackModalOpen,
        setIsFeedbackModalOpen,
        submitFeedback,
        seedDefaultCatalog,
        isCloudConnected,
        isCloudLoaded,
        newOrderAlert,
        setNewOrderAlert,
        // Action methods
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        placeOrder,
        updateOrderStatus,
        regenerateOrderOtp,
        cancelOrderAndRestock,
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
